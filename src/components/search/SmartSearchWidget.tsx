/**
 * Widget de busca inteligente.
 *
 * Combina autocomplete de cidade/bairro (a partir do índice real de rotas),
 * seleção de equipamento/serviço e duas ações:
 *   1. abrir a triagem já pré-preenchida (deep-link #triagem com querystring);
 *   2. ir direto para a página existente que melhor corresponde à busca.
 *
 * Nunca inventa rota: os destinos vêm de SEARCH_INDEX, que só contém páginas
 * publicadas.
 */
import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, MessageCircle, ArrowRight } from "lucide-react";
import { EQUIPMENTS } from "@/data/triage/config";
import { SEARCH_INDEX, searchEntries, normalize } from "@/lib/searchIndex";
import { trackCtaClick, trackEvent } from "@/lib/analytics";

interface Place {
  label: string;
  city: string;
  bairro?: string;
}

/** Cidades e bairros extraídos das rotas reais (sem duplicar). */
const PLACES: Place[] = (() => {
  const map = new Map<string, Place>();
  for (const entry of SEARCH_INDEX) {
    if (entry.bairro && entry.city) {
      const key = `${entry.city}|${entry.bairro}`;
      if (!map.has(key)) map.set(key, { label: `${entry.bairro}, ${entry.city}`, city: entry.city, bairro: entry.bairro });
    } else if (entry.city) {
      if (!map.has(entry.city)) map.set(entry.city, { label: entry.city, city: entry.city });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label, "pt-BR"));
})();

interface Props {
  title?: string;
  description?: string;
  className?: string;
}

export function SmartSearchWidget({
  title = "Encontre o atendimento certo",
  description = "Escolha o equipamento e informe sua região — a triagem abre já preenchida com esses dados.",
  className = "",
}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [equipment, setEquipment] = useState<string>("");
  const [placeQuery, setPlaceQuery] = useState("");
  const [selected, setSelected] = useState<Place | null>(null);
  const [openList, setOpenList] = useState(false);
  const blurTimer = useRef<number | null>(null);

  const suggestions = useMemo(() => {
    const q = normalize(placeQuery);
    if (!q) return PLACES.slice(0, 8);
    return PLACES.filter((p) => normalize(p.label).includes(q)).slice(0, 8);
  }, [placeQuery]);

  /** Melhor página existente para o par equipamento + região. */
  const bestMatch = useMemo(() => {
    const terms = [
      EQUIPMENTS.find((e) => e.id === equipment)?.label ?? "",
      selected?.bairro ?? "",
      selected?.city ?? "",
    ]
      .filter(Boolean)
      .join(" ");
    if (!terms.trim()) return null;
    return searchEntries({ query: terms }, 1)[0] ?? null;
  }, [equipment, selected]);

  const openTriage = () => {
    const params = new URLSearchParams();
    if (equipment) params.set("equipamento", equipment);
    if (selected?.city) params.set("cidade", selected.city);
    if (selected?.bairro) params.set("bairro", selected.bairro);
    params.set("utm_source", "busca-inteligente");

    trackCtaClick({
      surface: "quick_form",
      cta_id: "smart_search_triage",
      label: "Abrir triagem pela busca inteligente",
      destination: "#triagem",
      service: equipment || undefined,
      city: selected?.city,
      bairro: selected?.bairro,
    });
    trackEvent("smart_search_submit", {
      has_equipment: Boolean(equipment),
      has_city: Boolean(selected?.city),
      has_bairro: Boolean(selected?.bairro),
    });

    navigate(`${location.pathname}?${params.toString()}#triagem`);
  };

  return (
    <div
      className={`rounded-2xl border border-border bg-card p-5 md:p-6 shadow-xs ${className}`}
      data-testid="smart-search"
    >
      <h2 className="text-lg md:text-xl font-semibold mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-5">{description}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="smart-search-equipment" className="block text-sm font-medium mb-1.5">
            Equipamento ou serviço
          </label>
          <select
            id="smart-search-equipment"
            data-testid="smart-search-equipment"
            value={equipment}
            onChange={(e) => setEquipment(e.target.value)}
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Selecione o equipamento</option>
            {EQUIPMENTS.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <label htmlFor="smart-search-place" className="block text-sm font-medium mb-1.5">
            Cidade ou bairro
          </label>
          <MapPin
            className="pointer-events-none absolute left-3 top-[42px] h-4 w-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="smart-search-place"
            data-testid="smart-search-place"
            className="pl-9 h-12"
            autoComplete="off"
            role="combobox"
            aria-expanded={openList}
            aria-controls="smart-search-place-list"
            placeholder="Ex.: Batel, Curitiba ou Pinhais"
            value={selected ? selected.label : placeQuery}
            onChange={(e) => {
              setSelected(null);
              setPlaceQuery(e.target.value);
              setOpenList(true);
            }}
            onFocus={() => setOpenList(true)}
            onBlur={() => {
              blurTimer.current = window.setTimeout(() => setOpenList(false), 150);
            }}
          />
          {openList && suggestions.length > 0 && (
            <ul
              id="smart-search-place-list"
              data-testid="smart-search-suggestions"
              role="listbox"
              className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-md border border-border bg-popover p-1 shadow-lg"
            >
              {suggestions.map((p) => (
                <li key={p.label}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected?.label === p.label}
                    className="w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-muted"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      if (blurTimer.current) window.clearTimeout(blurTimer.current);
                      setSelected(p);
                      setPlaceQuery(p.label);
                      setOpenList(false);
                    }}
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <Button variant="whatsapp" onClick={openTriage} data-testid="smart-search-triage">
          <MessageCircle className="w-4 h-4" /> Abrir triagem com esses dados
        </Button>
        {bestMatch ? (
          <Button variant="outline" asChild data-testid="smart-search-page">
            <Link to={bestMatch.path}>
              <Search className="w-4 h-4" /> Ver página: {bestMatch.title}
            </Link>
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link to="/busca">
              <Search className="w-4 h-4" /> Busca completa por serviço e bairro
            </Link>
          </Button>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Sem telefone exposto: o atendimento começa pela triagem, que define modalidade (remoto,
        visita ou coleta) e as condições em{" "}
        <Link to="/precos" className="text-primary hover:underline">
          preços
        </Link>
        .{" "}
        <Link to="/areas-atendidas" className="inline-flex items-center gap-1 text-primary hover:underline">
          Ver cobertura <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </Link>
      </p>
    </div>
  );
}
