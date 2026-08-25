/**
 * FAQ regional (cidade e bairro) derivada de src/data/symptoms.ts.
 *
 * Contexto: as respostas do catálogo master citam Curitiba/Região Metropolitana.
 * Para páginas de outras cidades, adaptamos automaticamente as menções de
 * localidade sem inventar preços ou prazos — só substituímos o token de cidade.
 *
 * Renderiza DOM legível + JSON-LD FAQPage (paridade DOM ↔ schema) para
 * aumentar relevância local sem duplicar conteúdo entre 100+ páginas
 * (usamos apenas 3 sintomas por página, escolhidos deterministicamente).
 */
import { Helmet } from "@/lib/helmet-compat";
import { SYMPTOMS, type Symptom } from "@/data/symptoms";
import { buildSymptomFAQ } from "@/components/seo/SymptomFAQ";

interface RegionalSymptomFAQProps {
  cityName: string;
  neighborhoodName?: string;
  /** Slug estável usado para seleção determinística (evita conteúdo idêntico entre páginas). */
  seedSlug: string;
  /** Quantos sintomas exibir (default 3). */
  count?: number;
  /** Perguntas específicas da localidade (src/data/localFaq.ts). */
  localFaqs?: ReadonlyArray<{ question: string; answer: string }>;
  /** Título do bloco de perguntas locais. */
  localFaqsHeading?: string;
}

const CURITIBA_REGION_TOKENS = [
  "Curitiba e Região Metropolitana",
  "Curitiba e Região",
  "em Curitiba",
];

function localize(text: string, cityName: string, neighborhoodName?: string): string {
  const scope = neighborhoodName
    ? `${neighborhoodName}, ${cityName}`
    : cityName;
  let out = text;
  for (const token of CURITIBA_REGION_TOKENS) {
    out = out.split(token).join(scope);
  }
  return out;
}

/**
 * Seleção determinística de N sintomas baseada em hash simples do slug.
 * Garante que a mesma página sempre mostra o mesmo subconjunto (bom pra cache
 * e paridade DOM ↔ JSON-LD entre renders), mas cidades/bairros diferentes
 * recebem conjuntos diferentes.
 */
function pickSymptoms(seedSlug: string, count: number): Symptom[] {
  let h = 0;
  for (let i = 0; i < seedSlug.length; i++) {
    h = ((h << 5) - h + seedSlug.charCodeAt(i)) | 0;
  }
  const start = Math.abs(h) % SYMPTOMS.length;
  const out: Symptom[] = [];
  for (let i = 0; i < count && i < SYMPTOMS.length; i++) {
    out.push(SYMPTOMS[(start + i) % SYMPTOMS.length]);
  }
  return out;
}

export function RegionalSymptomFAQ({
  cityName,
  neighborhoodName,
  seedSlug,
  count = 3,
  localFaqs = [],
  localFaqsHeading = "Sobre o atendimento nesta localidade",
}: RegionalSymptomFAQProps) {
  const chosen = pickSymptoms(seedSlug, count);
  const heading = neighborhoodName
    ? `Perguntas frequentes — ${neighborhoodName}, ${cityName}`
    : `Perguntas frequentes — ${cityName}`;

  const symptomItems = chosen.flatMap((s) =>
    s.faq.map((qa) => ({
      q: localize(qa.q, cityName, neighborhoodName),
      a: localize(qa.a, cityName, neighborhoodName),
      symptomLabel: s.label,
    })),
  );

  // Perguntas ancoradas na localidade (tempo médio, cobertura, condições
  // comerciais oficiais) — entram no mesmo FAQPage para manter paridade 1:1.
  const localItems = localFaqs.map((f) => ({ q: f.question, a: f.answer }));
  const faqItems = [...localItems, ...symptomItems];

  if (faqItems.length === 0) return null;

  const jsonLd = buildSymptomFAQ(
    neighborhoodName ? `${neighborhoodName}, ${cityName}` : cityName,
    faqItems.map(({ q, a }) => ({ q, a })),
  );

  return (
    <section className="py-12 md:py-16 bg-background" aria-labelledby="regional-faq-heading">
      <div className="container-custom max-w-3xl">
        <h2 id="regional-faq-heading" className="font-display text-2xl md:text-3xl font-bold mb-6">
          {heading}
        </h2>
        <p className="text-muted-foreground mb-8">
          Dúvidas reais recebidas pelo nosso atendimento, adaptadas para
          quem procura técnico em {neighborhoodName ? `${neighborhoodName}, ` : ""}
          {cityName}.
        </p>
        <div className="space-y-6" data-testid="regional-faq-items">
          {localItems.length > 0 && (
            <div className="border-l-4 border-primary/40 pl-4">
              <h3 className="font-semibold text-foreground mb-3">{localFaqsHeading}</h3>
              <dl className="space-y-4">
                {localItems.map((qa, i) => (
                  <div key={`local-${i}`} data-faq-item>
                    <dt className="font-medium text-foreground" data-testid="faq-question" data-faq-question>
                      {qa.q}
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground leading-relaxed" data-faq-answer>
                      {qa.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {chosen.map((s) => (
            <div key={s.slug} className="border-l-4 border-primary/40 pl-4">
              <h3 className="font-semibold text-foreground mb-3">{s.label}</h3>
              <dl className="space-y-4">
                {s.faq.map((qa, i) => (
                  <div key={i} data-faq-item>
                    <dt className="font-medium text-foreground" data-testid="faq-question" data-faq-question>
                      {localize(qa.q, cityName, neighborhoodName)}
                    </dt>
                    <dd className="mt-1 text-sm text-muted-foreground leading-relaxed" data-faq-answer>
                      {localize(qa.a, cityName, neighborhoodName)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
      {jsonLd && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>
      )}
    </section>
  );
}

