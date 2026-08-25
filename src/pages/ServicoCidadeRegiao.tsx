import { Helmet } from "@/lib/helmet-compat";
import { Link, Navigate, useParams } from "@/lib/router-compat";
import { ArrowRight, MapPin, Clock, ShieldCheck, HelpCircle, ChevronRight, Truck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getCidadeRegiao,
  CIDADE_SERVICO_META,
  CIDADES_REGIAO,
  type CidadeServicoKey,
} from "@/data/cidadesRegiao";
import { getSymptomBySlug } from "@/data/symptoms";
import { LocalityPhotoBand } from "@/components/media/LocalityPhotoBand";

interface Props {
  service: CidadeServicoKey;
}

/**
 * Página unificada de serviço replicada por cidade da RMC
 * (São José dos Pinhais, Pinhais, Colombo).
 * - Rota: /servicos/<serviço>/<cidade>
 * - CTA único abre a triagem V2 pré-classificada.
 * - JSON-LD Service + BreadcrumbList + FAQPage.
 */
export default function ServicoCidadeRegiao({ service }: Props) {
  const { cidade } = useParams<{ cidade: string }>();
  const meta = CIDADE_SERVICO_META[service];
  const cidadeInfo = cidade ? getCidadeRegiao(cidade) : undefined;
  const symptom = getSymptomBySlug(meta.symptomSlug);

  if (!cidadeInfo || !symptom) {
    return <Navigate to={meta.parentPath} replace />;
  }

  const title = `${meta.label} em ${cidadeInfo.nome} — Preciso de um Técnico`;
  const description = `${meta.label} em ${cidadeInfo.nome}. ${meta.descricaoCurta} Coleta e visita técnica com triagem online.`;
  const canonical = `https://precisodeumtecnico.com/servicos/${service}/${cidadeInfo.slug}`;

  const handleTriage = (source: string) => {
    window.dispatchEvent(
      new CustomEvent("triage:open", {
        detail: {
          source,
          category: symptom.category,
          symptomSlug: symptom.slug,
          preclassify: {
            category: symptom.category,
            symptomSlug: symptom.slug,
            city: cidadeInfo.nome,
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
      { "@type": "ListItem", position: 2, name: "Serviços", item: "https://precisodeumtecnico.com/servicos" },
      { "@type": "ListItem", position: 3, name: meta.parentLabel, item: `https://precisodeumtecnico.com${meta.parentPath}` },
      { "@type": "ListItem", position: 4, name: `${meta.label} em ${cidadeInfo.nome}`, item: canonical },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${meta.label} em ${cidadeInfo.nome}`,
    description: meta.descricaoCurta,
    provider: {
      "@type": "LocalBusiness",
      name: "Preciso de um Técnico",
      url: "https://precisodeumtecnico.com",
    },
    areaServed: { "@type": "City", name: cidadeInfo.nome, containedInPlace: { "@type": "State", name: "PR" } },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: symptom.triage.ticketMin.toFixed(2),
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "BRL",
        minPrice: symptom.triage.ticketMin,
        maxPrice: symptom.triage.ticketMax,
      },
      url: canonical,
    },
    url: canonical,
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

  // Sibling cities links (regional cross-linking)
  const outrasCidades = CIDADES_REGIAO.filter((c) => c.slug !== cidadeInfo.slug);
  const slaMax = symptom.triage.slaMaxDays + cidadeInfo.slaBoost;
  const slaMin = symptom.triage.slaMinDays;

  const sourceKey = `servicos_${service.replace(/-/g, "_")}_${cidadeInfo.slug.replace(/-/g, "_")}`;

  return (
    <Layout>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
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
          <li><Link to="/servicos" className="hover:text-foreground">Serviços</Link></li>
          <li><ChevronRight className="w-3 h-3" aria-hidden /></li>
          <li><Link to={meta.parentPath} className="hover:text-foreground">{meta.parentLabel}</Link></li>
          <li><ChevronRight className="w-3 h-3" aria-hidden /></li>
          <li className="text-foreground font-medium">{cidadeInfo.nome}</li>
        </ol>
      </nav>

      <section className="py-12 md:py-16">
        <div className="container-custom max-w-5xl">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <MapPin className="w-4 h-4" /> {cidadeInfo.nome}, Região Metropolitana de Curitiba
          </div>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {meta.label} em {cidadeInfo.nome}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">{cidadeInfo.perfil}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => handleTriage(sourceKey)}
              data-triage-source={sourceKey}
              data-triage-category={symptom.category}
              data-triage-symptom={symptom.slug}
              data-triage-city={cidadeInfo.slug}
            >
              {meta.callToAction} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to={meta.parentPath}>Ver página de Curitiba</Link>
            </Button>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Orçamento fechado por escrito</li>
            <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Prazo: {slaMin}–{slaMax} dias</li>
            <li className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> {cidadeInfo.prazoDeslocamento}</li>
          </ul>
        </div>
      </section>

      <section className="py-12 md:py-16 border-t border-border bg-muted/30">
        <div className="container-custom max-w-5xl grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Como atendemos {cidadeInfo.nome}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{cidadeInfo.logistica}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Bairros com maior demanda</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-foreground">
              {cidadeInfo.bairrosAncora.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {b}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Atendemos toda {cidadeInfo.nome}; os bairros acima concentram o maior volume de chamados.
            </p>
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
                  Valor final definido após triagem online e {symptom.triage.mode === "visita" ? "visita técnica" : "diagnóstico em bancada"}. Nada é executado sem aprovação por escrito.
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => handleTriage(`${sourceKey}_price`)}
                data-triage-source={`${sourceKey}_price`}
                data-triage-category={symptom.category}
                data-triage-symptom={symptom.slug}
              >
                {meta.callToAction} <ArrowRight className="w-4 h-4 ml-1" />
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
            Dúvidas de quem mora em {cidadeInfo.nome}
          </h2>
          <Accordion type="single" collapsible className="mt-6">
            {symptom.faq.map((f, i) => (
              <AccordionItem data-faq-item key={f.q} value={`faq-${i}`}>
                <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent data-faq-answer className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="py-12 md:py-16 border-t border-border bg-muted/30">
        <div className="container-custom max-w-5xl">
          <h2 className="text-2xl font-bold text-foreground">Também atendemos na região</h2>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {outrasCidades.map((c) => (
              <li key={c.slug}>
                <Link
                  to={`/servicos/${service}/${c.slug}`}
                  className="block px-4 py-3 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
                >
                  {meta.label} em {c.nome}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={meta.parentPath}
                className="block px-4 py-3 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
              >
                {meta.parentLabel}
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <LocalityPhotoBand
        title={"Como o serviço é executado na prática"}
        intro={"Fotos reais de bancada, redes e infraestrutura — referência visual do escopo atendido nesta cidade."}
      />

    </Layout>
  );
}
