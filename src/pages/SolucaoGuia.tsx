/**
 * Guia editorial de resolução de problemas (/solucoes/:slug).
 *
 * Conteúdo técnico profundo + FAQ + malha interna (guias irmãos, hub temático
 * e páginas comerciais). O CTA abre a triagem já pré-preenchida com o
 * equipamento e o sintoma do guia, via deep-link #triagem.
 */
import { useParams, Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/button";
import NotFound from "@/pages/NotFound";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import {
  GUIDE_BY_SLUG,
  CLUSTER_BY_ID,
  relatedGuides,
  guidePath,
  SOLUTIONS_HUB_PATH,
} from "@/data/solutionGuides";

const BASE = "https://precisodeumtecnico.com";

export default function SolucaoGuia() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? GUIDE_BY_SLUG[slug] : undefined;
  if (!guide) return <NotFound />;

  const cluster = CLUSTER_BY_ID[guide.cluster];
  const canonical = `${BASE}${guidePath(guide.slug)}`;
  const siblings = relatedGuides(guide.slug);

  const triageHref = `${guidePath(guide.slug)}?equipamento=${guide.triage.equipment}${
    guide.triage.symptom ? `&sintoma=${guide.triage.symptom}` : ""
  }#triagem`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.description,
    articleSection: cluster.label,
    inLanguage: "pt-BR",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    author: { "@type": "Organization", name: "Preciso de um Técnico", url: `${BASE}/` },
    publisher: { "@type": "Organization", name: "Preciso de um Técnico", url: `${BASE}/` },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Layout>
      <SEOHead
        title={guide.title}
        description={guide.description}
        canonical={canonical}
        schema={[articleSchema, faqSchema]}
        breadcrumbs={[
          { name: "Início", url: `${BASE}/` },
          { name: "Soluções", url: `${BASE}${SOLUTIONS_HUB_PATH}` },
          { name: cluster.label, url: `${BASE}${SOLUTIONS_HUB_PATH}#${cluster.id}` },
          { name: guide.h1, url: canonical },
        ]}
      />

      <article>
        <header className="relative py-12 lg:py-16 overflow-hidden">
          <div className="absolute inset-0 hero-gradient" />
          <div className="absolute inset-0 hero-overlay" />
          <div className="relative container-custom max-w-3xl">
            <Breadcrumbs
              className="mb-5 [&_*]:text-white/80 [&_a:hover]:text-white"
              items={[
                { name: "Início", url: "/" },
                { name: "Soluções", url: SOLUTIONS_HUB_PATH },
                { name: cluster.label, url: `${SOLUTIONS_HUB_PATH}#${cluster.id}` },
                { name: guide.h1, url: guidePath(guide.slug) },
              ]}
            />
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {guide.h1}
            </h1>
            <p className="text-white/85 text-lg">{guide.answer}</p>
          </div>
        </header>

        <div className="section-padding">
          <div className="container-custom max-w-3xl">
            {/* Sumário — reduz profundidade de leitura e gera âncoras internas */}
            <nav aria-label="Neste guia" className="rounded-xl border border-border bg-muted/30 p-5 mb-10">
              <h2 className="font-semibold mb-3 text-base">Neste guia</h2>
              <ol className="space-y-1.5 text-sm list-decimal pl-4">
                {guide.sections.map((s, i) => (
                  <li key={i}>
                    <a href={`#secao-${i + 1}`} className="text-primary hover:underline">
                      {s.h2}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#perguntas" className="text-primary hover:underline">
                    Perguntas frequentes
                  </a>
                </li>
              </ol>
            </nav>

            {guide.sections.map((section, i) => (
              <section key={i} id={`secao-${i + 1}`} className="mb-10 scroll-mt-24">
                <h2 className="text-2xl font-display font-bold mb-4">{section.h2}</h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j} className="text-muted-foreground leading-relaxed mb-4">
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 mt-4">
                    {section.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-success" aria-hidden="true" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* CTA — abre a triagem já com equipamento e sintoma deste guia */}
            <div className="rounded-xl border border-border bg-card p-6 mb-12">
              <h2 className="text-xl font-semibold mb-2">Quer que a gente avalie o seu caso?</h2>
              <p className="text-sm text-muted-foreground mb-4">
                A triagem online abre com o equipamento e o sintoma deste guia já selecionados.
                Você recebe a modalidade de atendimento (remoto, visita ou coleta) e as condições
                antes de qualquer reparo.
              </p>
              <Button asChild variant="whatsapp">
                <Link to={triageHref} data-testid="guia-triagem">
                  <MessageCircle className="w-4 h-4" /> Abrir triagem com este problema
                </Link>
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Condições comerciais completas em{" "}
                <Link to="/precos" className="text-primary hover:underline">
                  preços e condições
                </Link>
                .
              </p>
            </div>

            <section id="perguntas" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-display font-bold mb-5">Perguntas frequentes</h2>
              <dl className="space-y-5">
                {guide.faqs.map((f, i) => (
                  <div key={i} className="rounded-lg border border-border p-4">
                    <dt className="font-semibold mb-1">{f.q}</dt>
                    <dd className="text-sm text-muted-foreground">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        {/* Malha interna: serviços relacionados + guias irmãos + hub */}
        <section className="section-padding bg-muted/30" aria-labelledby="malha-title">
          <div className="container-custom">
            <h2 id="malha-title" className="text-2xl font-display font-bold mb-6">
              Continue por aqui
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div>
                <h3 className="font-semibold mb-3">Serviços relacionados</h3>
                <ul className="space-y-2 text-sm">
                  {guide.related.map((r) => (
                    <li key={r.to}>
                      <Link to={r.to} className="text-primary hover:underline">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to={cluster.servicePath} className="text-primary hover:underline">
                      {cluster.serviceLabel}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Outros guias de solução</h3>
                <ul className="space-y-2 text-sm">
                  {siblings.map((g) => (
                    <li key={g.slug}>
                      <Link to={guidePath(g.slug)} className="text-primary hover:underline">
                        {g.h1}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Cobertura e condições</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to={SOLUTIONS_HUB_PATH} className="text-primary hover:underline">
                      Central de soluções por equipamento
                    </Link>
                  </li>
                  <li>
                    <Link to="/areas-atendidas" className="text-primary hover:underline">
                      Áreas atendidas: cidades e bairros
                    </Link>
                  </li>
                  <li>
                    <Link to="/precos" className="text-primary hover:underline">
                      Preços e condições de atendimento
                    </Link>
                  </li>
                  <li>
                    <Link to="/assistencia-tecnica-curitiba" className="text-primary hover:underline">
                      Assistência técnica em Curitiba
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <p className="mt-8">
              <Link
                to={SOLUTIONS_HUB_PATH}
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                Ver todos os guias de solução <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </p>
          </div>
        </section>
      </article>
    </Layout>
  );
}
