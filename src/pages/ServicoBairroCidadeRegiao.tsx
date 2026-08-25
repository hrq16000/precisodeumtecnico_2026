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
  getBairroCidadeRegiao,
  getBairrosVizinhosCidade,
  CIDADE_REGIAO_META,
  type CidadeRegiaoBairroSlug,
  type ServicoBairroRegiaoKey,
} from "@/data/bairrosCidadesRegiao";
import { CIDADE_SERVICO_META } from "@/data/cidadesRegiao";
import { getSymptomBySlug } from "@/data/symptoms";
import { LocalityPhotoBand } from "@/components/media/LocalityPhotoBand";
import { clampTitle, clampDescription } from "@/components/seo/SEOHead";

interface Props {
  cidade: CidadeRegiaoBairroSlug;
  service: ServicoBairroRegiaoKey;
}

/**
 * Página dedicada por bairro para cidades da RMC (SJP e Pinhais).
 * Rota: /servicos/<serviço>/<cidade>/<bairro>
 * - Conteúdo local exclusivo por bairro (sem duplicidade).
 * - CTA único de triagem pré-classificada (category + symptomSlug + city + neighborhood).
 * - JSON-LD Service + BreadcrumbList + FAQPage sincronizado com o catálogo de sintomas.
 */
export default function ServicoBairroCidadeRegiao({ cidade, service }: Props) {
  const { bairro } = useParams<{ bairro: string }>();
  const cidadeMeta = CIDADE_REGIAO_META[cidade];
  const serviceMeta = CIDADE_SERVICO_META[service];
  const bairroData = bairro ? getBairroCidadeRegiao(cidade, bairro) : undefined;
  const symptom = getSymptomBySlug(serviceMeta.symptomSlug);
  const vizinhos = bairroData ? getBairrosVizinhosCidade(cidade, bairroData.slug, 4) : [];

  if (!bairroData || !symptom) {
    return <Navigate to={`/servicos/${service}/${cidade}`} replace />;
  }

  const isWifi = service === "configuracao-wifi";
  const isTela = service === "troca-de-tela-tv";
  const localIntro = isWifi
    ? bairroData.wifiIntro
    : isTela
      ? (bairroData.telaIntro ?? bairroData.tvIntro)
      : bairroData.tvIntro;
  const localDestaque = isWifi
    ? bairroData.wifiDestaque
    : isTela
      ? (bairroData.telaLogistica ?? bairroData.tvLogistica)
      : bairroData.tvLogistica;
  const destaqueLabel = isWifi ? "Como resolvemos no bairro" : "Como funciona a coleta e a entrega";

  const cidadePath = `/servicos/${service}/${cidade}`;
  const title = `${serviceMeta.label} no ${bairroData.nome}, ${cidadeMeta.nome} — Preciso de um Técnico`;
  const description = `${serviceMeta.label} no bairro ${bairroData.nome} em ${cidadeMeta.nome}. ${localIntro} Triagem online e orçamento fechado.`;
  const canonical = `https://precisodeumtecnico.com/servicos/${service}/${cidade}/${bairroData.slug}`;
  const sourceKey = `bairro_${cidade.replace(/-/g, "_")}_${bairroData.slug.replace(/-/g, "_")}_${service.replace(/-/g, "_")}`;

  const handleTriage = (source: string) => {
    window.dispatchEvent(
      new CustomEvent("triage:open", {
        detail: {
          source,
          preclassify: {
            category: symptom.category,
            symptomSlug: symptom.slug,
            city: cidadeMeta.nome,
            neighborhood: bairroData.nome,
          },
        },
      }),
    );
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: serviceMeta.parentLabel, item: `https://precisodeumtecnico.com${serviceMeta.parentPath}` },
      { "@type": "ListItem", position: 3, name: `${serviceMeta.label} em ${cidadeMeta.nome}`, item: `https://precisodeumtecnico.com${cidadePath}` },
      { "@type": "ListItem", position: 4, name: `${serviceMeta.label} - ${bairroData.nome}`, item: canonical },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceMeta.label} no ${bairroData.nome}`,
    description: serviceMeta.descricaoCurta,
    provider: {
      "@type": "LocalBusiness",
      name: "Preciso de um Técnico",
      areaServed: { "@type": "Place", name: `${bairroData.nome}, ${cidadeMeta.nome}, PR` },
    },
    areaServed: { "@type": "Place", name: `${bairroData.nome}, ${cidadeMeta.nome}, PR` },
    url: canonical,
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

      <nav aria-label="Trilha de navegação" className="container-custom max-w-5xl pt-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link to="/" className="hover:text-foreground">Início</Link></li>
          <li><ChevronRight className="w-3 h-3" aria-hidden /></li>
          <li><Link to={serviceMeta.parentPath} className="hover:text-foreground">{serviceMeta.parentLabel}</Link></li>
          <li><ChevronRight className="w-3 h-3" aria-hidden /></li>
          <li><Link to={cidadePath} className="hover:text-foreground">{cidadeMeta.nome}</Link></li>
          <li><ChevronRight className="w-3 h-3" aria-hidden /></li>
          <li className="text-foreground font-medium">{bairroData.nome}</li>
        </ol>
      </nav>

      <section className="py-12 md:py-16">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin className="w-4 h-4" /> {bairroData.nome}, {cidadeMeta.nome}
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {serviceMeta.label} no {bairroData.nome}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{bairroData.perfil}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => handleTriage(sourceKey)}
              data-testid="cta-triage-hero"
              data-triage-source={sourceKey}
              data-triage-category={symptom.category}
              data-triage-symptom={symptom.slug}
              data-triage-city={cidade}
              data-triage-neighborhood={bairroData.slug}
            >
              {serviceMeta.callToAction} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={cidadePath}>Ver página geral em {cidadeMeta.nome}</Link>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Orçamento fechado por escrito</li>
            <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Prazo: {symptom.triage.slaMinDays}–{symptom.triage.slaMaxDays} dias</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Atendemos o {bairroData.nome} com equipe própria</li>
          </ul>
        </div>
      </section>

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

      <section className="py-12 md:py-16 border-t border-border">
        <div className="container-custom max-w-5xl">
          <div className="rounded-xl border border-border p-6 md:p-8 bg-card">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wide">Faixa de investimento</p>
                <p className="mt-2 text-3xl font-extrabold text-foreground">
                  R$ {symptom.triage.ticketMin.toFixed(2).replace(".", ",")} – R$ {symptom.triage.ticketMax.toFixed(2).replace(".", ",")}
                </p>
                <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                  Valor final definido após triagem online e {isWifi ? "visita técnica" : "diagnóstico em bancada"}. Nada é executado sem aprovação por escrito.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => handleTriage(`${sourceKey}_price`)}
                data-testid="cta-triage-price"
              >
                Iniciar triagem para o {bairroData.nome} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

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

      <section className="py-12 md:py-16 border-t border-border bg-muted/30" aria-labelledby="vizinhos-heading">
        <div className="container-custom max-w-5xl">
          <h2 id="vizinhos-heading" className="text-2xl font-bold text-foreground">
            Bairros vizinhos em {cidadeMeta.nome}
          </h2>
          <p className="mt-2 text-muted-foreground max-w-2xl text-sm">
            Também atendemos {serviceMeta.label.toLowerCase()} nos bairros próximos ao {bairroData.nome}.
          </p>
          {vizinhos.length > 0 && (
            <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm" data-testid="vizinhos-list">
              {vizinhos.map((v) => (
                <li key={v.slug}>
                  <Link
                    to={`/servicos/${service}/${cidade}/${v.slug}`}
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
              to={cidadePath}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
            >
              {serviceMeta.label} em {cidadeMeta.nome}
            </Link>
            <Link
              to={serviceMeta.parentPath}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
            >
              {serviceMeta.parentLabel}
            </Link>
          </div>
        </div>
      </section>
      <LocalityPhotoBand
        title={"Como o serviço é executado na prática"}
        intro={"Fotos reais de bancada, redes e infraestrutura — referência visual do trabalho realizado neste bairro."}
      />

    </Layout>
  );
}
