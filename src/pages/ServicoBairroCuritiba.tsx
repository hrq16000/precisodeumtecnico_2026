import { Helmet } from "@/lib/helmet-compat";
import { Link, useParams, Navigate } from "@/lib/router-compat";
import { ArrowRight, MapPin, ShieldCheck, Clock, HelpCircle, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getBairroServicoContent,
  getBairrosVizinhos,
  REGIAO_LABEL,
  SERVICO_META,
  type ServiceKey,
} from "@/data/bairrosCuritibaServico";
import { getSymptomBySlug } from "@/data/symptoms";
import { LocalityPhotoBand } from "@/components/media/LocalityPhotoBand";
import { clampTitle, clampDescription } from "@/components/seo/SEOHead";

interface Props {
  service: ServiceKey;
}

/**
 * Página dedicada por bairro de Curitiba para um serviço específico (Wi-Fi ou Smart TV).
 * - Conteúdo local exclusivo vindo de `bairrosCuritibaServico.ts` (sem duplicidade).
 * - CTA único de triagem pré-classificada com `category` e `symptomSlug` corretos.
 * - JSON-LD `Service`, `BreadcrumbList` e `FAQPage` (reaproveitando o catálogo de sintomas).
 */
export default function ServicoBairroCuritiba({ service }: Props) {
  const { bairro } = useParams<{ bairro: string }>();
  const bairroData = bairro ? getBairroServicoContent(bairro) : undefined;
  const meta = SERVICO_META[service];
  const symptom = getSymptomBySlug(meta.symptomSlug);
  const vizinhos = bairroData ? getBairrosVizinhos(bairroData.slug, 4) : [];

  if (!bairroData || !symptom) {
    return <Navigate to={meta.parentPath} replace />;
  }

  const isWifi = service === "configuracao-wifi";
  const localIntro = isWifi ? bairroData.wifiIntro : bairroData.tvIntro;
  const localDestaque = isWifi ? bairroData.wifiDestaque : bairroData.tvLogistica;
  const destaqueLabel = isWifi ? "Como resolvemos no bairro" : "Como funciona a coleta e a entrega";

  const title = `${meta.label} no ${bairroData.nome}, Curitiba — Preciso de um Técnico`;
  const description = `${meta.label} no bairro ${bairroData.nome} em Curitiba. ${localIntro} Triagem online e orçamento fechado.`;
  const canonical = `https://precisodeumtecnico.com/servicos/${service}/curitiba/${bairroData.slug}`;

  const handleTriage = () => {
    window.dispatchEvent(
      new CustomEvent("triage:open", {
        detail: {
          source: `bairro-${bairroData.slug}-${service}`,
          preclassify: {
            category: symptom.category,
            symptomSlug: symptom.slug,
            city: "Curitiba",
            neighborhood: bairroData.nome,
          },
        },
      })
    );
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: meta.parentLabel, item: `https://precisodeumtecnico.com${meta.parentPath}` },
      { "@type": "ListItem", position: 3, name: `${meta.label} - ${bairroData.nome}`, item: canonical },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${meta.label} no ${bairroData.nome}`,
    description: meta.description,
    provider: {
      "@type": "LocalBusiness",
      name: "Preciso de um Técnico",
      areaServed: { "@type": "Place", name: `${bairroData.nome}, Curitiba, PR` },
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: symptom.triage.ticketMin.toFixed(2),
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: symptom.triage.ticketMin,
        maxPrice: symptom.triage.ticketMax,
        priceCurrency: "BRL",
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: symptom.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Layout>
      <Helmet>
        <title>{clampTitle(title)}</title>
        <meta name="description" content={clampDescription(description)} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={clampTitle(title)} />
        <meta property="og:description" content={clampDescription(description)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav aria-label="Trilha de navegação" className="container-custom max-w-5xl pt-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link to="/" className="hover:text-foreground">Início</Link></li>
          <li><ChevronRight className="w-3 h-3" aria-hidden /></li>
          <li><Link to={meta.parentPath} className="hover:text-foreground">{meta.parentLabel}</Link></li>
          <li><ChevronRight className="w-3 h-3" aria-hidden /></li>
          <li className="text-foreground font-medium">{bairroData.nome}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin className="w-4 h-4" /> {bairroData.nome}, Curitiba
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {meta.label} no {bairroData.nome}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{bairroData.perfil}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" onClick={handleTriage} data-testid="cta-triage-hero">
              Iniciar triagem agora <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={meta.parentPath}>Ver página geral em Curitiba</Link>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Orçamento fechado por escrito</li>
            <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Prazo: {symptom.triage.slaMinDays}–{symptom.triage.slaMaxDays} dias</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Atendemos o {bairroData.nome} com equipe própria</li>
          </ul>
        </div>
      </section>

      {/* Contexto local */}
      <section className="py-12 md:py-16 border-t border-border bg-muted/30">
        <div className="container-custom max-w-5xl grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {isWifi ? `Wi-Fi no ${bairroData.nome}: o cenário real` : `Smart TV no ${bairroData.nome}: o cenário real`}
            </h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{localIntro}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{destaqueLabel}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{localDestaque}</p>
          </div>
        </div>
      </section>

      {/* Faixa de preço + CTA */}
      <section className="py-12 md:py-16 border-t border-border">
        <div className="container-custom max-w-5xl">
          <div className="rounded-xl border border-border p-6 md:p-8 bg-card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">Faixa de investimento</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">
                  R$ {symptom.triage.ticketMin.toFixed(2).replace(".", ",")} –
                  R$ {symptom.triage.ticketMax.toFixed(2).replace(".", ",")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                  Valor final definido após triagem online e {isWifi ? "visita técnica" : "diagnóstico em bancada"}. Nada é executado sem aprovação por escrito.
                </p>
              </div>
              <Button size="lg" onClick={handleTriage} data-testid="cta-triage-price">
                Iniciar triagem para o {bairroData.nome} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-20 border-t border-border">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <HelpCircle className="w-4 h-4" /> Perguntas frequentes
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
            Dúvidas de quem mora no {bairroData.nome}
          </h2>
          <Accordion type="single" collapsible className="mt-6" data-testid="faq-accordion">
            {symptom.faq.map((f, i) => (
              <AccordionItem data-faq-item key={f.q} value={`faq-${i}`}>
                <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent data-faq-answer className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Bairros vizinhos + páginas-mãe do serviço */}
      <section className="py-12 md:py-16 border-t border-border bg-muted/30" aria-labelledby="vizinhos-heading">
        <div className="container-custom max-w-5xl">
          <h2 id="vizinhos-heading" className="text-2xl font-bold text-foreground">
            Bairros vizinhos ({REGIAO_LABEL[bairroData.regiao]})
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl text-sm">
            Também atendemos {meta.label.toLowerCase()} nos bairros próximos ao {bairroData.nome}.
          </p>
          {vizinhos.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm" data-testid="vizinhos-list">
              {vizinhos.map((v) => (
                <li key={v.slug}>
                  <Link
                    to={`/servicos/${service}/curitiba/${v.slug}`}
                    className="block px-3 py-2 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
                  >
                    {v.nome}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              to={meta.parentPath}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
            >
              {meta.parentLabel}
            </Link>
            <Link
              to={service === "configuracao-wifi" ? SERVICO_META["reparo-smart-tv"].parentPath : SERVICO_META["configuracao-wifi"].parentPath}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
            >
              {service === "configuracao-wifi" ? SERVICO_META["reparo-smart-tv"].parentLabel : SERVICO_META["configuracao-wifi"].parentLabel}
            </Link>
          </div>
        </div>
      </section>
      <LocalityPhotoBand
        title={"Como o serviço é executado na prática"}
        intro={"Fotos reais de bancada, redes e infraestrutura — referência visual do tipo de trabalho descrito nesta página."}
      />

    </Layout>
  );
}
