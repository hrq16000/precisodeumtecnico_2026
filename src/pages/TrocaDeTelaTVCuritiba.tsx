import { Helmet } from "@/lib/helmet-compat";
import { Link } from "@/lib/router-compat";
import { ArrowRight, ShieldCheck, Truck, Clock, AlertTriangle, CheckCircle2, HelpCircle, Tv } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getSymptomBySlug } from "@/data/symptoms";
import { ServiceGallery } from "@/components/service/ServiceGallery";
import { clampTitle, clampDescription } from "@/components/seo/SEOHead";

const GALLERY = [
  {
    src: "/gallery/tela-coleta.webp",
    alt: "Ilustração de mãos com luvas embalando TV com tela trincada em espuma protetora para coleta",
    caption: "Coleta com embalagem apropriada para painéis frágeis em Curitiba e RMC.",
    width: 1280,
    height: 720,
  },
  {
    src: "/gallery/tela-troca.webp",
    alt: "Ilustração de técnico substituindo o painel de LCD de uma TV grande em bancada preparada",
    caption: "Substituição do painel em bancada após aprovação do orçamento fechado.",
    width: 1280,
    height: 720,
  },
];

const SYMPTOM_SLUG = "tv-tela-quebrada";
const PAGE_PATH = "/servicos/troca-de-tela-tv-curitiba";
const PAGE_URL = `https://precisodeumtecnico.com${PAGE_PATH}`;

const PROCESS = [
  { title: "Triagem online", description: "Você abre a triagem, informa marca, modelo, polegadas e envia fotos da tela danificada." },
  { title: "Avaliação de viabilidade", description: "Consultamos disponibilidade e custo real do painel com nossos fornecedores. Se não compensar, avisamos honestamente." },
  { title: "Coleta agendada", description: "Coleta na sua casa em Curitiba e Região Metropolitana, com embalagem apropriada para painel." },
  { title: "Diagnóstico em bancada", description: "Confirmação do painel exato, teste da placa T-CON e da fonte para descartar outros defeitos." },
  { title: "Orçamento fechado", description: "Você recebe o valor final com painel + mão de obra + devolução. Só executamos com aprovação." },
  { title: "Troca e devolução", description: "Substituição do painel, testes de imagem em todas as entradas e devolução em casa com garantia de 90 dias na mão de obra." },
];

const INCLUDES = [
  "Coleta e devolução em Curitiba e RMC",
  "Diagnóstico em bancada com equipamentos calibrados",
  "Painel compatível ou original conforme disponibilidade",
  "Teste completo de imagem (HDMI, USB, antena, apps)",
  "Garantia de 90 dias na mão de obra",
  "Nota fiscal (NFS-e)",
];

const NOT_WORTH_IT = [
  "TVs abaixo de 40\" com painel danificado — geralmente o custo do painel supera uma TV nova.",
  "TVs com mais de 6 anos de uso e painel indisponível no mercado nacional.",
  "Rachaduras extensas com múltiplas linhas verticais e horizontais + backlight comprometido.",
  "Modelos OLED de entrada com queima de pixel além do painel trincado.",
];

function openTriage() {
  window.dispatchEvent(
    new CustomEvent("triage:open", {
      detail: {
        source: "servicos_troca_tela_tv_curitiba",
        category: "tv",
        symptomSlug: SYMPTOM_SLUG,
      },
    }),
  );
}

export default function TrocaDeTelaTVCuritiba() {
  const symptom = getSymptomBySlug(SYMPTOM_SLUG)!;

  const metaTitle = "Troca de Tela de TV em Curitiba | Diagnóstico Honesto e Coleta";
  const metaDescription =
    "Troca de tela (painel) de TV LED, LCD, QLED e OLED em Curitiba e Região Metropolitana. Coleta a partir de R$ 299,99, diagnóstico de viabilidade antes do orçamento e garantia de 90 dias na mão de obra.";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Troca de tela de TV em Curitiba",
    serviceType: "Substituição de painel LCD/LED/QLED/OLED de televisor",
    provider: {
      "@type": "LocalBusiness",
      name: "Preciso de um Técnico",
      url: "https://precisodeumtecnico.com",
      areaServed: { "@type": "City", name: "Curitiba" },
    },
    areaServed: [
      { "@type": "City", name: "Curitiba" },
      { "@type": "City", name: "São José dos Pinhais" },
      { "@type": "City", name: "Pinhais" },
      { "@type": "City", name: "Colombo" },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: "299.99",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "BRL",
        minPrice: 299.99,
        description: "Taxa de coleta e diagnóstico, abatida do orçamento se aprovado.",
      },
      availability: "https://schema.org/InStock",
      url: PAGE_URL,
    },
    url: PAGE_URL,
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
      { "@type": "ListItem", position: 2, name: "Serviços", item: "https://precisodeumtecnico.com/servicos" },
      { "@type": "ListItem", position: 3, name: "Troca de tela de TV em Curitiba", item: PAGE_URL },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>{clampTitle(metaTitle)}</title>
        <meta name="description" content={clampDescription(metaDescription)} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={clampDescription(metaDescription)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* HERO */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Início</Link>
            <span className="mx-2">/</span>
            <Link to="/servicos" className="hover:text-primary">Serviços</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Troca de tela de TV em Curitiba</span>
          </nav>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Tv className="w-3.5 h-3.5" /> Serviço técnico em Curitiba e RMC
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Troca de tela de TV em Curitiba
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Painel LCD, LED, QLED ou OLED. Fazemos o diagnóstico de viabilidade <strong>antes</strong> de qualquer orçamento — se não compensar trocar, avisamos honestamente. Coleta e devolução em Curitiba e Região Metropolitana.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Modalidade</div>
              <div className="font-semibold text-foreground mt-1 flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Coleta obrigatória
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Coleta + diagnóstico</div>
              <div className="font-semibold text-foreground mt-1">A partir de R$ 299,99</div>
              <div className="text-xs text-muted-foreground mt-1">abatido se aprovar o serviço</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Prazo médio</div>
              <div className="font-semibold text-foreground mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> 15 a 45 dias
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={openTriage}
              data-triage-source="servicos_troca_tela_tv_curitiba"
              data-triage-category="tv"
            >
              Iniciar triagem <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to="/servicos">
              <Button size="lg" variant="outline">Ver outros serviços</Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Todo contato começa pela triagem online. Após a classificação, você recebe o link direto para o WhatsApp do técnico.
          </p>
        </div>
      </section>

      {/* PROCESSO */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Como funciona a troca de tela</h2>
          <p className="mt-3 text-muted-foreground">
            Um processo padronizado, sem promessas furadas, com decisão de viabilidade antes de qualquer cobrança maior.
          </p>
          <ol className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROCESS.map((step, i) => (
              <li key={step.title} className="rounded-lg border border-border bg-card p-5">
                <div className="text-xs font-semibold text-primary">Etapa {i + 1}</div>
                <div className="mt-1 font-bold text-foreground">{step.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* INCLUSO */}
      <section className="py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container-custom max-w-4xl grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" /> O que está incluso
            </h2>
            <ul className="mt-5 space-y-3">
              {INCLUDES.map((it) => (
                <li key={it} className="flex gap-2 text-sm text-foreground">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-600" /> Quando não compensa trocar
            </h2>
            <ul className="mt-5 space-y-3">
              {NOT_WORTH_IT.map((it) => (
                <li key={it} className="flex gap-2 text-sm text-foreground">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Nesses casos, indicamos comprar uma TV nova e podemos ajudar no descarte responsável do aparelho antigo.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <ServiceGallery
        title="Como é a coleta e a troca de painel"
        intro="Exemplos ilustrativos do processo de coleta e substituição do painel. Não são fotos de atendimentos reais."
        items={GALLERY}
      />

      <section id="faq" className="py-16 md:py-20 border-t border-border">
        <div className="container-custom max-w-3xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <HelpCircle className="w-3.5 h-3.5" /> Perguntas Frequentes
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              Dúvidas sobre troca de tela de TV em Curitiba
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-8">
            {symptom.faq.map((f, i) => (
              <AccordionItem data-faq-item key={f.q} value={`faq-${i}`}>
                <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{f.q}</AccordionTrigger>
                <AccordionContent data-faq-answer className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 border-t border-border bg-primary/5">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Pronto para o diagnóstico da sua TV?
          </h2>
          <p className="mt-3 text-muted-foreground">
            A triagem leva menos de 2 minutos e você recebe uma previsão realista antes de qualquer coleta.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              onClick={openTriage}
              data-triage-source="servicos_troca_tela_tv_curitiba_final"
              data-triage-category="tv"
            >
              Iniciar triagem agora <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
