import { useParams, Link, Navigate } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { servicesData } from "@/data/services";
import { PRICING, SLA } from "@/data/pricingPolicy";
import {
  CURITIBA_ZONES,
  getCuritibaServiceLocal,
  CURITIBA_SERVICE_SLUGS,
  CURITIBA_SERVICE_LOCAL,
} from "@/data/curitibaServiceLocal";
import { ArrowRight, Building2, Home, MapPin, Route, Truck, CheckCircle2, MessageCircle } from "lucide-react";
import { COMPANY } from "@/data/companyInfo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";

const BASE = "https://precisodeumtecnico.com";

/**
 * /servicos/:servico/curitiba — intenção de CONTRATAÇÃO local.
 *
 * Não compete com /servicos/:slug (autoridade técnica do serviço): aqui o
 * conteúdo é cobertura, modalidades, residencial x empresas, logística,
 * regra comercial e como solicitar em Curitiba. O link canônico é próprio e
 * a página aponta explicitamente para o guia técnico global.
 */
export default function ServicoCuritibaContratacao() {
  const { servico } = useParams<{ servico: string }>();
  const local = getCuritibaServiceLocal(servico);
  const global = servico ? servicesData[servico] : undefined;

  if (!local || !global) return <Navigate to="/404" replace />;

  const url = `${BASE}/servicos/${local.slug}/curitiba`;
  const globalUrl = `${BASE}/servicos/${local.slug}`;

  const openTriage = () =>
    window.dispatchEvent(
      new CustomEvent("triage:open", {
        detail: { source: `servicos_${local.slug}_curitiba`, city: "Curitiba" },
      }),
    );

  const businessId = `${BASE}/#localbusiness-curitiba`;

  /** LocalBusiness da operação em Curitiba — referenciado pelo Service via @id. */
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessId,
    name: COMPANY.brand,
    legalName: COMPANY.legalName,
    url: BASE,
    taxID: COMPANY.cnpj,
    foundingDate: COMPANY.foundingYear,
    email: COMPANY.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Curitiba",
      addressRegion: "PR",
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: "-25.4284", longitude: "-49.2733" },
    areaServed: { "@type": "City", name: "Curitiba", addressRegion: "PR" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "22:00",
      },
    ],
    sameAs: [COMPANY.facebook, COMPANY.instagram],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: local.localTitle,
    serviceType: global.title,
    description: local.metaDescription,
    areaServed: { "@type": "City", name: "Curitiba", addressRegion: "PR" },
    provider: { "@id": businessId },
    isRelatedTo: { "@type": "Service", name: global.title, url: globalUrl },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Modalidades em Curitiba — ${local.localTitle}`,
      itemListElement: local.modalities.map((m) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: m.name, description: m.description },
        priceCurrency: "BRL",
        areaServed: { "@type": "City", name: "Curitiba", addressRegion: "PR" },
      })),
    },
    offers: {
      "@type": "Offer",
      price: PRICING.technicalVisit.priceBRL.toFixed(2),
      priceCurrency: "BRL",
      url,
      availability: "https://schema.org/InStock",
      availableAtOrFrom: { "@type": "Place", name: "Curitiba, PR" },
      seller: { "@id": businessId },
    },
  };

  const others = CURITIBA_SERVICE_SLUGS.filter((s) => s !== local.slug).map(
    (s) => CURITIBA_SERVICE_LOCAL[s],
  );

  /** CTA direto de WhatsApp — mesma mensagem em toda a rota, com contexto de cidade. */
  const waHref = buildWhatsAppUrl({
    service: local.localTitle,
    city: "Curitiba",
    sourcePage: `/servicos/${local.slug}/curitiba`,
  });

  const onWaClick = (surface: string) =>
    trackWhatsAppClick({
      source: `servicos_${local.slug}_curitiba`,
      service: local.slug,
      city: "Curitiba",
      source_component: surface,
      cta_label: "Falar no WhatsApp",
    });

  return (
    <Layout>
      <SEOHead
        title={local.metaTitle}
        description={local.metaDescription}
        canonical={url}
        keywords={[
          `${global.title.toLowerCase()} curitiba`,
          `${local.localTitle.toLowerCase()}`,
          "técnico em curitiba",
          "atendimento em curitiba",
        ].join(", ")}
        breadcrumbs={[
          { name: "Início", url: `${BASE}/` },
          { name: "Serviços", url: `${BASE}/servicos` },
          { name: global.title, url: globalUrl },
          { name: "Curitiba", url },
        ]}
        service={{
          name: local.localTitle,
          description: local.metaDescription,
          priceMinBRL: PRICING.technicalVisit.minPriceBRL,
          areaServed: "Curitiba, PR",
        }}
        structuredData={[localBusinessSchema, serviceSchema]}
        faq={local.faqs}
      />

      {/* Hero — contratação local */}
      <section className="bg-gradient-to-br from-foreground via-foreground to-primary/20 py-16 text-background md:py-24">
        <div className="container-custom">
          <Reveal>
            <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs text-background/60 sm:text-sm">
              <Link to="/" className="hover:text-background">Início</Link>
              <span>/</span>
              <Link to="/servicos" className="hover:text-background">Serviços</Link>
              <span>/</span>
              <Link to={`/servicos/${local.slug}`} className="hover:text-background">{global.title}</Link>
              <span>/</span>
              <span className="text-background">Curitiba</span>
            </nav>
            <div className="mb-4 flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">Curitiba — PR</span>
            </div>
            <h1 className="mb-4 font-display text-3xl font-bold md:text-5xl">{local.localTitle}</h1>
            <p className="mb-6 max-w-3xl text-lg text-background/80">
              Como contratar, quais modalidades existem na cidade, como funciona a logística e o que
              esperar do atendimento em cada região de Curitiba.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={openTriage} data-triage-source={`servicos_${local.slug}_curitiba`} data-triage-city="Curitiba">
                Iniciar triagem <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" asChild className="border-background/30 bg-transparent text-background hover:bg-background/10">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onWaClick("hero")}
                  data-wa-source={`servicos_${local.slug}_curitiba_hero`}
                  data-service={local.slug}
                  data-city="Curitiba"
                  aria-label={`Falar no WhatsApp sobre ${local.localTitle}`}
                >
                  <MessageCircle className="mr-2 h-4 w-4" /> Falar no WhatsApp
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-background/30 bg-transparent text-background hover:bg-background/10">
                <Link to={`/servicos/${local.slug}`}>Guia técnico completo do serviço</Link>
              </Button>
            </div>
            <p className="mt-3 max-w-2xl text-xs text-background/70">
              Sintomas, causas, diagnóstico e possibilidades de reparo estão detalhados no guia do
              serviço. Esta página trata da contratação em Curitiba.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Cobertura */}
          <Reveal>
            <h2 className="mb-6 font-display text-2xl font-bold md:text-3xl">
              Atendimento em Curitiba
            </h2>
            {local.coverage.map((p) => (
              <p key={p.slice(0, 40)} className="mb-4 leading-relaxed text-muted-foreground">{p}</p>
            ))}
          </Reveal>

          {/* Modalidades */}
          <Reveal>
            <h2 className="mb-6 mt-12 font-display text-2xl font-bold md:text-3xl">
              Modalidades disponíveis na cidade
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {local.modalities.map((m) => (
                <Card key={m.name} className="p-4">
                  <div className="mb-1 flex items-center gap-2 font-semibold">
                    <Truck className="h-4 w-4 text-primary" /> {m.name}
                  </div>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                </Card>
              ))}
            </div>
          </Reveal>

          {/* Residencial x empresas */}
          <Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <Card className="p-5">
                <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold">
                  <Home className="h-5 w-5 text-primary" /> Residencial
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{local.residential}</p>
              </Card>
              <Card className="p-5">
                <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold">
                  <Building2 className="h-5 w-5 text-primary" /> Empresas
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{local.business}</p>
              </Card>
            </div>
          </Reveal>

          {/* Processo */}
          <Reveal>
            <h2 className="mb-6 mt-12 font-display text-2xl font-bold md:text-3xl">
              Como solicitar em Curitiba
            </h2>
            <ol className="space-y-3">
              {local.howToRequest.map((step, i) => (
                <li key={step.slice(0, 30)} className="flex gap-3">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{local.logistics}</p>
          </Reveal>

          {/* Preço — fonte comercial central */}
          <Reveal>
            <h2 className="mb-6 mt-12 font-display text-2xl font-bold md:text-3xl">
              Regra comercial aplicada em Curitiba
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {[PRICING.benchDiagnosis, PRICING.technicalVisit, PRICING.pickupDelivery].map((p) => (
                <Card key={p.label} className="p-4">
                  <div className="mb-1 font-semibold">{p.label}</div>
                  <div className="mb-2 font-display text-xl font-bold text-primary">{p.priceLabel}</div>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </Card>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Prazo mínimo de {SLA.minLabel}. {SLA.disclaimer} Peças, componentes, materiais e itens
              adicionais não estão inclusos.{" "}
              <Link to="/termos-orcamento-pre-aprovado" className="underline hover:text-primary">
                Ver termos
              </Link>
              .
            </p>
          </Reveal>

          {/* Áreas */}
          <Reveal>
            <h2 className="mb-6 mt-12 font-display text-2xl font-bold md:text-3xl">
              Regiões atendidas em Curitiba
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {CURITIBA_ZONES.map((z) => (
                <div key={z.zone} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <Route className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <div>
                    <div className="text-sm font-semibold">{z.zone}</div>
                    <p className="text-xs text-muted-foreground">{z.areas}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              A região informada na triagem define a janela de agendamento e a modalidade sugerida.
            </p>
          </Reveal>

          {/* FAQ local */}
          <Reveal>
            <h2 className="mb-6 mt-12 font-display text-2xl font-bold md:text-3xl">
              Perguntas frequentes — {local.localTitle}
            </h2>
            <Accordion type="single" collapsible>
              {local.faqs.map((faq, i) => (
                <AccordionItem data-faq-item key={faq.question} value={`faq-${i}`}>
                  <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent data-faq-answer>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          {/* CTA contextual */}
          <Reveal>
            <div className="mt-12 rounded-xl border border-border bg-muted/40 p-6">
              <h2 className="mb-2 font-display text-xl font-bold">
                Contratar {global.title.toLowerCase()} em Curitiba
              </h2>
              <p className="mb-4 text-sm text-muted-foreground">
                A triagem online define modalidade, região e condições antes de qualquer
                deslocamento — sem cadastro, sem fotos e vídeos prévios, o atendimento não é iniciado.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={openTriage} data-triage-source={`servicos_${local.slug}_curitiba_final`} data-triage-city="Curitiba">
                  Iniciar triagem agora <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onWaClick("cta_final")}
                    data-wa-source={`servicos_${local.slug}_curitiba_final`}
                    data-service={local.slug}
                    data-city="Curitiba"
                    aria-label={`Falar no WhatsApp sobre ${local.localTitle}`}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" /> Falar no WhatsApp
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to={`/servicos/${local.slug}`}>Entender o serviço em detalhes</Link>
                </Button>
              </div>
              <ul className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                {["Cobertura em toda Curitiba", "Aprovação antes da execução", "Protocolo de acompanhamento", "Nota fiscal"].map((b) => (
                  <li key={b} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Outros serviços do lote — contratação em Curitiba */}
          <Reveal>
            <h2 className="mb-4 mt-12 font-display text-xl font-bold">
              Outros serviços contratáveis em Curitiba
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link
                    to={`/servicos/${o.slug}/curitiba`}
                    className="flex items-center gap-2 text-sm transition-colors hover:text-primary"
                  >
                    <ArrowRight className="h-4 w-4" /> {o.localTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
