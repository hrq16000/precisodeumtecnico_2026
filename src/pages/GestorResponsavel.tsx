import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Award, MapPin, Wrench } from "lucide-react";
import { COMPANY } from "@/data/companyInfo";
import { MANAGER, MANAGER_URL } from "@/data/manager";
import { buildPersonSchema, buildOrganizationSchema } from "@/lib/schema/organization";
import { buildLocalBusinessSchema } from "@/lib/schema/localBusiness";

const faq = [
  {
    question: `Quem é o responsável técnico do ${COMPANY.brand}?`,
    answer: `${MANAGER.shortBio} Ele define o protocolo de triagem, os critérios de diagnóstico e as condições comerciais aplicadas a todos os atendimentos.`,
  },
  {
    question: "Desde quando a operação existe?",
    answer: `A atuação técnica começou em ${COMPANY.foundingYear}. São ${COMPANY.experiencePhrase.toLowerCase()} em manutenção eletrônica, informática e infraestrutura.`,
  },
  {
    question: "Qual é a área de atuação direta do gestor técnico?",
    answer: `${MANAGER.areaOfService.join(", ")}. ${MANAGER.nationalNote}`,
  },
  {
    question: "Como o orçamento é definido?",
    answer:
      "Sempre após a triagem técnica: o funil do site identifica equipamento, sintoma e modalidade (bancada, visita ou coleta) e apresenta o valor mínimo e o prazo antes de qualquer deslocamento.",
  },
];

export default function GestorResponsavel() {
  return (
    <Layout>
      <SEOHead
        title={`Gestor Técnico Responsável — Desde ${COMPANY.foundingYear}`}
        description={`Conheça o gestor técnico responsável pelo ${COMPANY.brand}: bio, certificações e área de atuação. Atuação em manutenção eletrônica e informática desde ${COMPANY.foundingYear}.`}
        canonical={MANAGER_URL}
        breadcrumbs={[
          { name: "Início", url: `${COMPANY.website}/` },
          { name: "Gestor Responsável", url: MANAGER_URL },
        ]}
        faq={faq}
        structuredData={[
          buildPersonSchema(),
          buildOrganizationSchema(),
          buildLocalBusinessSchema({ url: MANAGER_URL }),
        ]}
      />

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
            Desde {COMPANY.foundingYear}
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Gestor técnico responsável pelo {COMPANY.brand}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">{MANAGER.shortBio}</p>

          <div className="space-y-4 text-base leading-relaxed">
            {MANAGER.bio.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-12">
            <div className="rounded-xl border border-border p-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <Wrench className="h-5 w-5 text-primary" aria-hidden /> Áreas de atuação técnica
              </h2>
              <ul className="space-y-2 text-sm">
                {MANAGER.expertise.map((e) => (
                  <li key={e} className="flex gap-2">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-border p-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <Award className="h-5 w-5 text-primary" aria-hidden /> Certificações e qualificações
              </h2>
              <ul className="space-y-3 text-sm">
                {MANAGER.credentials.map((c) => (
                  <li key={c.name}>
                    <strong className="block">{c.name}</strong>
                    <span className="text-muted-foreground">{c.issuer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-6 mt-6">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-3">
              <MapPin className="h-5 w-5 text-primary" aria-hidden /> Área geográfica de atuação
            </h2>
            <p className="text-sm mb-2">{MANAGER.areaOfService.join(" · ")}</p>
            <p className="text-sm text-muted-foreground">{MANAGER.nationalNote}</p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-display font-bold mb-4">Perguntas frequentes</h2>
            <div className="space-y-4">
              {faq.map((f) => (
                <details key={f.question} className="rounded-lg border border-border p-4">
                  <summary className="cursor-pointer font-semibold">{f.question}</summary>
                  <p className="mt-2 text-sm text-muted-foreground">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Button size="lg" data-triage-cta data-triage-source="gestor-responsavel">
              Iniciar triagem técnica
            </Button>
            <Link to="/dados-da-empresa" className="text-primary underline">
              Dados da empresa
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
