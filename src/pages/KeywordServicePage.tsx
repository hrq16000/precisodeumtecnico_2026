/**
 * Rodada 28.1 — Template das landing pages por keyword de serviço.
 * Uma rota = uma keyword-alvo = um H1 único, com Service + FAQPage +
 * BreadcrumbList + LocalBusiness em JSON-LD e CTA de triagem pré-classificado.
 */
import { Link } from "@/lib/router-compat";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  Wallet,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SmartImage } from "@/components/SmartImage";
import { InternalLinkCluster } from "@/components/seo/InternalLinkCluster";
import { RelatedServiceLinks } from "@/components/seo/RelatedServiceLinks";

import { AuthoritySince } from "@/components/marketing/AuthoritySince";
import { TrustStrip } from "@/components/marketing/TrustStrip";
import { InlineTriageCTA } from "@/components/marketing/InlineTriageCTA";
import { EditorialCallout } from "@/components/marketing/EditorialCallout";
import {
  RemoteEligibility,
  RemoteSessionFlow,
  RemoteAuthorizationBox,
  RemoteNotSuitable,
} from "@/components/marketing/RemoteSupportBlocks";
import { PageTableOfContents } from "@/components/layout/PageTableOfContents";

import { COMPANY } from "@/data/companyInfo";
import { KEYWORD_SERVICE_BY_SLUG } from "@/data/keywordServices";
import { SERVICE_VISUAL_BY_SLUG } from "@/data/serviceVisualWave";
import { PRICING } from "@/data/pricingPolicy";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickServicePhotos } from "@/data/publicPhotos";

/**
 * Rodada 3K — faixa de autoridade apenas nas páginas comerciais aprovadas.
 */
const AUTHORITY_SLUGS = new Set([
  "conserto-de-notebook-curitiba",
  "assistencia-tecnica-empresas-curitiba",
]);



interface Props {
  slug: string;
}

export default function KeywordServicePage({ slug }: Props) {
  const page = KEYWORD_SERVICE_BY_SLUG[slug];
  if (!page) return null;

  const url = `${COMPANY.website}/${page.slug}`;
  const triageSource = `keyword_${page.slug.replace(/-/g, "_")}`;

  /** Rodada 3Q — padrão visual comum, com conteúdo próprio por serviço. */
  const visual = SERVICE_VISUAL_BY_SLUG[page.slug];
  /** Rodada 3U — atendimento remoto é modalidade: blocos exclusivos. */
  const isRemote = page.slug === "suporte-tecnico-remoto";
  const tocItems = visual
    ? [
        { id: "o-que-esta-incluido", label: "O que está incluído" },
        ...(isRemote ? [{ id: "requisitos", label: "Requisitos" }] : []),
        { id: "pontos-de-decisao", label: "Pontos de decisão" },
        { id: "como-funciona", label: "Como funciona o atendimento" },
        ...(isRemote
          ? [
              { id: "fluxo-remoto", label: "Como funciona a sessão" },
              { id: "seguranca-remota", label: "Segurança e autorização" },
              { id: "limites-remoto", label: "O que não pode ser remoto" },
            ]
          : []),
        ...(page.scopeLimits ? [{ id: "limites-do-atendimento", label: "Limites do atendimento" }] : []),
        ...(page.engagementModels ? [{ id: "avulso-ou-recorrente", label: "Avulso ou recorrente" }] : []),
        { id: "perguntas-frequentes", label: "Perguntas frequentes" },
        { id: "servicos-relacionados", label: "Serviços relacionados" },
      ]
    : [];


  return (
    <Layout>
      <SEOHead
        title={page.title}
        description={page.description}
        canonical={url}
        keywords={`${page.keyword}, ${page.h1.toLowerCase()}, assistência técnica ${page.city}`}
        breadcrumbs={[
          { name: "Início", url: `${COMPANY.website}/` },
          { name: "Serviços", url: `${COMPANY.website}/servicos` },
          { name: page.keyword, url },
        ]}
        service={{
          name: page.h1,
          description: page.description,
          priceMinBRL: PRICING.benchDiagnosis.priceBRL,
          areaServed:
            page.city === "Brasil" ? "Brasil" : "Curitiba e Região Metropolitana",
        }}
        faq={page.faq}
        // LocalBusiness/Organization já são emitidos sitewide pelo <head>
        // estático (index.html). Aqui só entram os schemas específicos da
        // página (Service + FAQPage + BreadcrumbList), evitando duplicidade.
        structuredData={[]}
      />

      {/* HERO */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom mb-6">
          <Breadcrumbs
            items={[
              { name: "Início", url: `${COMPANY.website}/` },
              { name: "Serviços", url: `${COMPANY.website}/servicos` },
              { name: page.keyword, url },
            ]}
          />
        </div>
        <div className="container-custom grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
              {page.city === "Brasil" ? "Atendimento em todo o Brasil" : `${page.city} e Região Metropolitana`}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
              {page.h1}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">{page.intro}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <Button
                size="lg"
                data-triage-cta
                data-triage-source={triageSource}
                data-triage-category={page.triageCategory}
                data-triage-symptom={page.triageSymptom}
                data-triage-city={page.city === "Brasil" ? undefined : page.city}
              >
                Iniciar triagem e receber o valor
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/precos">Ver tabela de preços</Link>
              </Button>
            </div>

            <dl className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-background p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Wallet className="h-4 w-4 text-primary" aria-hidden /> A partir de
                </dt>
                <dd className="mt-1 text-lg font-bold">{page.priceFrom}</dd>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary" aria-hidden /> Prazo médio
                </dt>
                <dd className="mt-1 text-sm font-medium">{page.averageTime}</dd>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <dt className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" aria-hidden /> Garantia
                </dt>
                <dd className="mt-1 text-sm font-medium">90 dias na mão de obra</dd>
              </div>
            </dl>
          </div>

          <SmartImage
            src={page.image.src}
            alt={page.image.alt}
            width={1280}
            height={720}
            eager
            className="w-full rounded-xl border border-border object-cover"
          />
        </div>
      </section>

      {AUTHORITY_SLUGS.has(page.slug) && <AuthoritySince />}

      {visual && (
        <section className="pt-8">
          <div className="container-custom max-w-4xl">
            <p className="text-base font-medium text-foreground mb-5">{visual.summary}</p>
            {/* Uma única ocorrência visual da prova de autoridade por página. */}
            {!AUTHORITY_SLUGS.has(page.slug) && <TrustStrip />}

            <PageTableOfContents className="mt-6" items={tocItems} />
          </div>
        </section>
      )}


      {/* O QUE É */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 id="o-que-esta-incluido" data-toc-anchor className="text-2xl md:text-3xl font-display font-bold mb-4">
            O que é {page.keyword} e o que está incluído
          </h2>

          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {page.whatIs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <h3 className="text-xl font-semibold mt-10 mb-4">
            Quando você precisa deste serviço
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {page.whenYouNeed.map((item) => (
              <li key={item} className="flex gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Rodada 3U — elegibilidade da modalidade remota */}
      {isRemote && (
        <section className="pb-4">
          <div className="container-custom max-w-4xl">
            <RemoteEligibility />
          </div>
        </section>
      )}

      {/* PONTOS DE DECISÃO — caixas editoriais próprias de cada serviço */}
      {visual && (
        <section className="pb-4">
          <div className="container-custom max-w-4xl">
            <h2
              id="pontos-de-decisao"
              data-toc-anchor
              className="text-2xl md:text-3xl font-display font-bold mb-6"
            >
              Pontos de decisão antes do atendimento
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {visual.callouts.map((c) => (
                <EditorialCallout key={c.title} title={c.title} items={c.items} tone={c.tone} />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* COMO FAZEMOS */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <h2 id="como-funciona" data-toc-anchor className="text-2xl md:text-3xl font-display font-bold mb-8">
            Como funciona o atendimento, passo a passo
          </h2>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {page.howWeDo.map((step, i) => (
              <li key={step.title} className="rounded-xl border border-border bg-background p-6">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary mb-3">
                  {i + 1}
                </span>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 rounded-xl border border-border bg-background p-6">
            <h3 className="font-semibold mb-2">Valores e condições</h3>
            <p className="text-sm text-muted-foreground mb-2">{page.priceNote}</p>
            <p className="text-sm text-muted-foreground">{page.warranty}</p>
          </div>

          {visual && (
            <InlineTriageCTA
              className="mt-8"
              label={visual.ctaLabel}
              description="A triagem online identifica equipamento, sintoma e modalidade e apresenta o valor mínimo antes de qualquer deslocamento."
              source={`${triageSource}_meio`}
              category={page.triageCategory}
              symptom={page.triageSymptom}
            />
          )}

        </div>
      </section>

      {/* Rodada 3U — fluxo da sessão, autorização e limites do remoto */}
      {isRemote && (
        <section className="section-padding">
          <div className="container-custom max-w-4xl space-y-12">
            <RemoteSessionFlow />
            <RemoteAuthorizationBox />
            <RemoteNotSuitable />
          </div>
        </section>
      )}

      {/* ANTES x DEPOIS */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 id="antes-e-depois" data-toc-anchor className="text-2xl md:text-3xl font-display font-bold mb-6">
            Antes e depois do serviço
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">
                Comparativo entre a situação antes e depois de {page.keyword}
              </caption>
              <thead>
                <tr className="bg-muted/50 text-left">
                  <th scope="col" className="border border-border p-3 font-semibold">Aspecto</th>
                  <th scope="col" className="border border-border p-3 font-semibold">Antes</th>
                  <th scope="col" className="border border-border p-3 font-semibold">Depois</th>
                </tr>
              </thead>
              <tbody>
                {page.compare.map((row) => (
                  <tr key={row.aspect}>
                    <th scope="row" className="border border-border p-3 text-left font-medium">
                      {row.aspect}
                    </th>
                    <td className="border border-border p-3 text-muted-foreground">{row.before}</td>
                    <td className="border border-border p-3">
                      <span className="inline-flex gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                        {row.after}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CONTEXTOS ATENDIDOS POR TIPO DE EMPRESA */}
      {page.businessTracks && (
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              Contextos atendidos por tipo de empresa
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              O escopo é o mesmo; o que muda é a prioridade. Abaixo, o que costuma ser crítico em
              cada contexto — sem prometer resultado dentro de software de terceiros.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {page.businessTracks.map((track) => (
                <article key={track.title} className="p-6 rounded-xl bg-card border border-border/50">
                  <h3 className="font-bold text-lg mb-2">{track.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{track.description}</p>
                  <ul className="space-y-2">
                    {track.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AVULSO x RECORRENTE */}
      {page.engagementModels && (
        <section className="section-padding bg-muted/30">
          <div className="container-custom max-w-5xl">
            <h2 id="avulso-ou-recorrente" data-toc-anchor className="text-2xl md:text-3xl font-display font-bold mb-8">
              Avulso ou recorrente: como funciona cada opção
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {page.engagementModels.map((model) => (
                <article key={model.name} className="p-6 rounded-xl bg-card border border-border/50">
                  <h3 className="font-bold text-lg mb-2">{model.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{model.howItWorks}</p>
                  <h4 className="font-semibold text-sm mb-2">O que está incluso</h4>
                  <ul className="space-y-2">
                    {model.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary mt-0.5" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* LIMITES DE ESCOPO */}
      {page.scopeLimits && (
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <h2 id="limites-do-atendimento" data-toc-anchor className="text-2xl md:text-3xl font-display font-bold mb-3">
              Limites do atendimento: o que não fazemos
            </h2>
            <p className="text-muted-foreground mb-6">
              Publicar o limite evita expectativa errada e retrabalho. Estes pontos ficam fora do
              escopo, mesmo em contrato recorrente.
            </p>
            <ul className="space-y-3">
              {page.scopeLimits.map((limit) => (
                <li key={limit} className="flex items-start gap-3 text-sm">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" aria-hidden />
                  <span>{limit}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}

      <section className="section-padding bg-muted/30">
        <div className="container-custom max-w-3xl">
          <h2 id="perguntas-frequentes" data-toc-anchor className="text-2xl md:text-3xl font-display font-bold mb-6">
            Perguntas frequentes sobre {page.keyword}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {page.faq.map((f, i) => (
              <AccordionItem data-faq-item key={f.question} value={`faq-${i}`}>
                <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{f.question}</AccordionTrigger>
                <AccordionContent data-faq-answer className="text-muted-foreground">{f.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* LINKS INTERNOS DO SERVIÇO */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h2 id="servicos-relacionados" data-toc-anchor className="text-2xl md:text-3xl font-display font-bold mb-4">
            Serviços relacionados
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {page.relatedServices.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-primary hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-xl border border-border bg-muted/40 p-6">
            <h3 className="text-xl font-semibold mb-2">
              Precisa resolver ainda hoje?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              A triagem online identifica equipamento, sintoma e modalidade (bancada,
              visita ou coleta) e apresenta o valor mínimo antes de qualquer deslocamento.
            </p>
            <Button
              size="lg"
              data-triage-cta
              data-triage-source={`${triageSource}_footer`}
              data-triage-category={page.triageCategory}
              data-triage-symptom={page.triageSymptom}
            >
              Iniciar triagem técnica
            </Button>
          </div>
        </div>
      </section>

      <section className="container-custom">
        <RelatedServiceLinks slug={page.slug} />
      </section>

      <InternalLinkCluster
        city={page.city === "Brasil" ? "Curitiba" : page.city}
        citySlug="curitiba"
      />

      <PublicPhotoBand
        title="Referências visuais do serviço"
        intro="Fotos reais licenciadas livremente que ilustram o tipo de equipamento e intervenção descritos nesta página."
        photos={pickServicePhotos("keyword-service", 3)}
      />
    </Layout>
  );
}
