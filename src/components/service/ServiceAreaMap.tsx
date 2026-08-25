import { useMemo, useState } from "react";
import { MapPin, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { openTriage } from "@/lib/triageFlag";
import { trackCtaClick } from "@/lib/analytics";
import {
  CURITIBA_ZONES,
  TRAVEL_DISCLAIMER,
  findZoneByPlace,
  type ServiceZone,
} from "@/data/serviceAreaCuritiba";

/**
 * Mapa esquemático da área de atendimento em Curitiba + indicador de tempo
 * estimado de deslocamento por zona. Sem dependência de API externa de mapas
 * (custo zero, sem chave, sem impacto em Core Web Vitals).
 */
export function ServiceAreaMap({ surface = "city_page" }: { surface?: "city_page" | "service_page" }) {
  const [activeId, setActiveId] = useState<string>("centro");
  const [query, setQuery] = useState("");

  const searched = useMemo(() => findZoneByPlace(query), [query]);
  const active: ServiceZone =
    searched ?? CURITIBA_ZONES.find((z) => z.id === activeId) ?? CURITIBA_ZONES[0];

  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-8" aria-labelledby="mapa-cobertura">
      <h2 id="mapa-cobertura" className="text-2xl md:text-3xl font-bold text-foreground">
        Mapa da área de atendimento em Curitiba
      </h2>
      <p className="mt-2 text-muted-foreground">
        Selecione a sua região para ver o tempo estimado de deslocamento do técnico e abrir a
        triagem já com a localidade preenchida.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Diagrama de zonas */}
        <div className="relative min-w-0">
          <svg
            viewBox="0 0 100 100"
            role="img"
            aria-label="Diagrama das zonas de atendimento de Curitiba e Região Metropolitana"
            className="w-full h-auto rounded-xl bg-muted/40"
          >
            <circle cx="50" cy="50" r="46" className="fill-primary/5 stroke-border" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" className="fill-primary/10 stroke-border" strokeWidth="0.4" />
            {CURITIBA_ZONES.map((z) => {
              const isActive = z.id === active.id;
              return (
                <g key={z.id} onClick={() => { setQuery(""); setActiveId(z.id); }} className="cursor-pointer">
                  <circle
                    cx={z.x}
                    cy={z.y}
                    r={isActive ? 9 : 7}
                    className={isActive ? "fill-primary" : "fill-secondary stroke-border"}
                    strokeWidth="0.5"
                  />
                  <text
                    x={z.x}
                    y={z.y + 1.5}
                    textAnchor="middle"
                    className={isActive ? "fill-primary-foreground" : "fill-foreground"}
                    style={{ fontSize: "4px", fontWeight: 700 }}
                  >
                    {z.travelMinMin}′
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-xs text-muted-foreground">
            Diagrama ilustrativo de cobertura — não é mapa cartográfico.
          </p>
        </div>

        {/* Painel da zona */}
        <div className="flex flex-col min-w-0">
          <label htmlFor="busca-zona" className="text-sm font-medium text-foreground">
            Buscar por bairro ou cidade
          </label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden />
            <Input
              id="busca-zona"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex.: Bacacheri, Portão, São José dos Pinhais"
              className="pl-9"
              autoComplete="off"
            />
          </div>
          {query && !searched && (
            <p className="mt-2 text-sm text-muted-foreground" role="status">
              Não encontramos esse bairro na lista de referência. Abra a triagem e informe a
              localidade — a cobertura é confirmada no atendimento.
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {CURITIBA_ZONES.map((z) => (
              <button
                key={z.id}
                type="button"
                onClick={() => { setQuery(""); setActiveId(z.id); }}
                aria-pressed={z.id === active.id}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  z.id === active.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:bg-muted"
                }`}
              >
                {z.name}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-border bg-background p-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" aria-hidden />
              {active.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{active.summary}</p>
            <p className="mt-3 flex items-center gap-2 text-foreground font-semibold">
              <Clock className="w-4 h-4 text-primary" aria-hidden />
              Deslocamento estimado: {active.travelMinMin}–{active.travelMinMax} minutos
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{TRAVEL_DISCLAIMER}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {active.places.map((p) => (
                <li key={p} className="text-xs px-2 py-1 rounded-sm bg-muted text-muted-foreground">
                  {p}
                </li>
              ))}
            </ul>
            <Button
              className="mt-4 w-full"
              onClick={() => {
                trackCtaClick({
                  surface,
                  cta_id: "service_area_zone_triage",
                  destination: "/triagem",
                  city: "Curitiba",
                });
                openTriage({ source: "service_area_map" });
              }}
            >
              Abrir triagem para {active.name}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
