import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { RelatedLinksSection } from "@/components/seo/RelatedLinksSection";
import { SmartSearchWidget } from "@/components/search/SmartSearchWidget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, ArrowRight } from "lucide-react";
import { searchEntries, suggestTerms, type SearchEntryType } from "@/lib/searchIndex";
import { buildWhatsAppUrlFromText } from "@/lib/whatsapp";
import { trackCtaClick, trackEvent, trackWhatsAppClick } from "@/lib/analytics";

const CANONICAL = "https://precisodeumtecnico.com/busca";

const TYPE_FILTERS: { value: SearchEntryType | "todos"; label: string }[] = [
  { value: "todos", label: "Tudo" },
  { value: "servico", label: "Serviços" },
  { value: "bairro", label: "Bairros" },
  { value: "cidade", label: "Cidades" },
  { value: "pagina", label: "Páginas" },
];

export default function Busca() {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState<SearchEntryType | "todos">("todos");

  const results = useMemo(() => searchEntries({ query, type }), [query, type]);
  const suggestions = useMemo(
    () => (query.trim().length >= 2 ? suggestTerms(query, 6) : suggestTerms("", 6)),
    [query],
  );

  // Mantém a URL compartilhável sem recarregar a rota.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const next = new URLSearchParams(params);
      if (query.trim()) next.set("q", query.trim());
      else next.delete("q");
      setParams(next, { replace: true });
      if (query.trim().length >= 3) {
        trackEvent("site_search", {
          search_term_length: query.trim().length,
          result_type: type,
          results_count: results.length,
        });
      }
    }, 600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, type, results.length]);

  const waMessage = [
    "Olá! Vim pela busca do site.",
    query.trim() ? `Busca: ${query.trim()}` : null,
    `Filtro: ${TYPE_FILTERS.find((f) => f.value === type)?.label ?? "Tudo"}`,
    "Pode confirmar atendimento e faixa de preço?",
  ]
    .filter(Boolean)
    .join(" ");

  const searchSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://precisodeumtecnico.com/#website",
    name: "Preciso de um Técnico",
    url: "https://precisodeumtecnico.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://precisodeumtecnico.com/busca?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Layout>
      <SEOHead
        title="Busca: serviço, bairro ou cidade atendida"
        description="Encontre em segundos a página certa do serviço técnico que você precisa por bairro, cidade ou tipo de reparo em Curitiba e região metropolitana."
        canonical={CANONICAL}
        schema={searchSchema}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Busca", url: CANONICAL },
        ]}
      />

      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container-custom max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Busca por serviço, bairro ou cidade
          </h1>
          <p className="text-white/80">
            Digite o que você precisa — por exemplo “Wi-Fi Batel”, “formatação” ou “Pinhais” — e vá
            direto para a página com preço, prazo e triagem da sua região.
          </p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container-custom max-w-4xl">
          <SmartSearchWidget className="mb-8" />
          <form role="search" onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <label htmlFor="busca-input" className="block text-sm font-medium">
              O que você procura?
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="busca-input"
                data-testid="busca-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: notebook, Wi-Fi no Portão, São José dos Pinhais"
                className="pl-9 h-12"
                autoComplete="off"
                aria-describedby="busca-sugestoes"
              />
            </div>

            <div id="busca-sugestoes" className="flex flex-wrap gap-2">
              <span className="sr-only">Sugestões rápidas de busca</span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border px-3 py-1 text-xs hover:border-success"
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar resultados por tipo">
              {TYPE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={type === f.value}
                  onClick={() => setType(f.value)}
                  className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                    type === f.value
                      ? "border-success bg-success/10 text-success font-medium"
                      : "border-border text-muted-foreground hover:border-success"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </form>

          <p className="mt-6 text-sm text-muted-foreground" aria-live="polite" data-testid="busca-count">
            {results.length} resultado{results.length === 1 ? "" : "s"} encontrado
            {results.length === 1 ? "" : "s"}.
          </p>

          {results.length > 0 ? (
            <ul className="mt-4 grid gap-3" data-testid="busca-results">
              {results.map((entry) => (
                <li key={entry.id}>
                  <Link
                    to={entry.path}
                    className="group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition-colors hover:border-success"
                    onClick={() =>
                      trackCtaClick({
                        surface: "quick_form",
                        cta_id: "busca_result",
                        label: entry.title,
                        destination: entry.path,
                        service: entry.service,
                        city: entry.city,
                        bairro: entry.bairro,
                      })
                    }
                  >
                    <span className="inline-flex items-center gap-2 font-semibold group-hover:text-success">
                      {entry.title}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm text-muted-foreground">{entry.description}</span>
                    <span className="text-xs text-muted-foreground/80">{entry.path}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div
              className="mt-4 rounded-xl border border-border bg-card p-6"
              data-testid="busca-empty"
            >
              <h2 className="font-semibold mb-2">Nenhum resultado para esse termo</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Tente um termo mais simples (só o bairro ou só o equipamento) ou fale direto com a
                equipe informando cidade e bairro — a cobertura pode existir mesmo sem página
                específica.
              </p>
              <ul className="flex flex-wrap gap-3 text-sm">
                <li>
                  <Link to="/areas-atendidas" className="text-success underline underline-offset-4">
                    Ver todas as áreas atendidas
                  </Link>
                </li>
                <li>
                  <Link to="/servicos" className="text-success underline underline-offset-4">
                    Ver todos os serviços
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
            <h2 className="font-semibold mb-2">Não achou? Fale com a equipe</h2>
            <p className="text-sm text-muted-foreground mb-4">
              A mensagem já vai preenchida com exatamente os filtros usados aqui na busca.
            </p>
            <Button
              variant="whatsapp"
              asChild
              data-testid="busca-whatsapp"
              onClick={() => {
                trackWhatsAppClick({
                  source: "busca",
                  source_component: "busca_page",
                  service: type,
                  cta_label: "Falar sobre a busca",
                });
                trackEvent("whatsapp_message_context", {
                  source: "busca",
                  wa_message: waMessage,
                  result_type: type,
                  results_count: results.length,
                });
              }}
            >
              <a
                data-wa-source="busca"
                data-service="assistência técnica"
                aria-label="Falar no WhatsApp sobre o que você procurou"
                href={buildWhatsAppUrlFromText(waMessage)} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" /> Falar no WhatsApp com esses filtros
              </a>
            </Button>
          </div>
        </div>
      </section>

      <RelatedLinksSection surface="quick_form" items={["areas", "precos", "servicos"]} />
    </Layout>
  );
}
