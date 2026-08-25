/**
 * Hub temático de soluções (/solucoes).
 *
 * Concentra os guias editoriais por equipamento e distribui autoridade para
 * as páginas comerciais e locais já publicadas. Nenhuma rota nova é inventada:
 * todos os links apontam para páginas existentes.
 */
import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { SmartSearchWidget } from "@/components/search/SmartSearchWidget";
import { ArrowRight } from "lucide-react";
import {
  SOLUTION_CLUSTERS,
  SOLUTION_GUIDES,
  guidesByCluster,
  guidePath,
  SOLUTIONS_HUB_PATH,
} from "@/data/solutionGuides";

const BASE = "https://precisodeumtecnico.com";
const CANONICAL = `${BASE}${SOLUTIONS_HUB_PATH}`;

export default function SolucoesHub() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Guias de solução por equipamento",
    itemListElement: SOLUTION_GUIDES.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.h1,
      url: `${BASE}${guidePath(g.slug)}`,
    })),
  };

  return (
    <Layout>
      <SEOHead
        title="Soluções técnicas por equipamento e sintoma"
        description="Guias técnicos de resolução de problemas em computador, TV, redes, celular e dados: diagnóstico passo a passo antes de contratar reparo."
        canonical={CANONICAL}
        schema={itemListSchema}
        breadcrumbs={[
          { name: "Início", url: `${BASE}/` },
          { name: "Soluções", url: CANONICAL },
        ]}
      />

      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container-custom max-w-3xl">
          <Breadcrumbs
            className="mb-5 [&_*]:text-white/80 [&_a:hover]:text-white"
            items={[
              { name: "Início", url: "/" },
              { name: "Soluções", url: SOLUTIONS_HUB_PATH },
            ]}
          />
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Central de soluções: diagnóstico antes do orçamento
          </h1>
          <p className="text-white/85 text-lg">
            Guias técnicos organizados por equipamento e sintoma. Cada um mostra como isolar a
            causa, o que dá para testar em casa, o que já exige bancada e quando o reparo deixa de
            compensar.
          </p>
        </div>
      </section>

      <section className="py-10 bg-background">
        <div className="container-custom max-w-4xl">
          <SmartSearchWidget
            title="Achar o técnico certo para o seu caso"
            description="Escolha o equipamento e informe cidade e bairro — a triagem abre já preenchida."
          />
        </div>
      </section>

      {SOLUTION_CLUSTERS.map((cluster, idx) => {
        const guides = guidesByCluster(cluster.id);
        if (guides.length === 0) return null;
        return (
          <section
            key={cluster.id}
            id={cluster.id}
            className={`section-padding scroll-mt-24 ${idx % 2 === 1 ? "bg-muted/30" : ""}`}
            aria-labelledby={`cluster-${cluster.id}`}
          >
            <div className="container-custom">
              <h2 id={`cluster-${cluster.id}`} className="text-2xl md:text-3xl font-display font-bold mb-2">
                {cluster.heading}
              </h2>
              <p className="text-muted-foreground max-w-3xl mb-6">{cluster.description}</p>

              <div className="grid gap-4 md:grid-cols-2">
                {guides.map((g) => (
                  <Link
                    key={g.slug}
                    to={guidePath(g.slug)}
                    className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-success"
                  >
                    <span className="inline-flex items-center gap-2 font-semibold group-hover:text-success">
                      {g.h1}
                      <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                    </span>
                    <p className="mt-2 text-sm text-muted-foreground">{g.answer}</p>
                    <p className="mt-3 text-xs text-muted-foreground/80">
                      Sintomas: {g.symptoms.join(" · ")}
                    </p>
                  </Link>
                ))}
              </div>

              <p className="mt-5 text-sm">
                <Link to={cluster.servicePath} className="text-primary font-medium hover:underline">
                  Ver o serviço: {cluster.serviceLabel}
                </Link>
              </p>
            </div>
          </section>
        );
      })}

      <section className="section-padding bg-muted/30" aria-labelledby="hub-mesh">
        <div className="container-custom">
          <h2 id="hub-mesh" className="text-2xl font-display font-bold mb-6">
            Cobertura, preços e atendimento
          </h2>
          <div className="grid gap-8 md:grid-cols-3 text-sm">
            <ul className="space-y-2">
              <li>
                <Link to="/areas-atendidas" className="text-primary hover:underline">
                  Áreas atendidas: cidades e bairros
                </Link>
              </li>
              <li>
                <Link to="/assistencia-tecnica-curitiba" className="text-primary hover:underline">
                  Assistência técnica em Curitiba
                </Link>
              </li>
              <li>
                <Link to="/atendimento-nacional" className="text-primary hover:underline">
                  Atendimento nacional (remoto e bancada)
                </Link>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <Link to="/precos" className="text-primary hover:underline">
                  Preços e condições
                </Link>
              </li>
              <li>
                <Link to="/garantia-e-cobertura" className="text-primary hover:underline">
                  Garantia e cobertura
                </Link>
              </li>
              <li>
                <Link to="/termos-orcamento-pre-aprovado" className="text-primary hover:underline">
                  Termos de orçamento pré-aprovado
                </Link>
              </li>
            </ul>
            <ul className="space-y-2">
              <li>
                <Link to="/busca" className="text-primary hover:underline">
                  Busca por serviço, bairro ou cidade
                </Link>
              </li>
              <li>
                <Link to="/status-os" className="text-primary hover:underline">
                  Status da ordem de serviço
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary hover:underline">
                  Perguntas frequentes
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}
