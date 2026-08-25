import { Helmet } from "@/lib/helmet-compat";
import { buildWebPageSchema } from "@/lib/seo/webPageSchema";
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
import { BAIRROS_CURITIBA_SERVICO } from "@/data/bairrosCuritibaServico";

const GALLERY = [
  {
    src: "/gallery/smart-tv-apps.webp",
    alt: "Ilustração de Smart TV na sala com ícones genéricos de aplicativos carregando corretamente",
    caption: "Após o reparo: apps abrindo sem travamento, sistema respondendo ao controle remoto.",
    width: 1280,
    height: 720,
  },
  {
    src: "/gallery/smart-tv-bench.webp",
    alt: "Ilustração de bancada técnica com Smart TV desmontada, multímetro e laptop mostrando diagnóstico",
    caption: "Diagnóstico em bancada com equipamento calibrado antes do orçamento fechado.",
    width: 1280,
    height: 720,
  },
];

const SYMPTOM_SLUG = "tv-smart-travando-apps";
const PAGE_PATH = "/servicos/reparo-smart-tv-curitiba";
const PAGE_URL = `https://precisodeumtecnico.com${PAGE_PATH}`;

const PROCESS = [
  { title: "Triagem online", description: "Você abre a triagem, informa marca, modelo, sistema (Tizen, webOS, Google TV, Roku) e descreve o que está travando." },
  { title: "Pré-orientação remota", description: "Se for algo resolvível por reset ou reinstalação de app, orientamos por escrito sem cobrar visita." },
  { title: "Coleta agendada", description: "Se precisar reparo físico, agendamos coleta em Curitiba e RMC com embalagem apropriada." },
  { title: "Diagnóstico em bancada", description: "Teste de placa principal, módulo Wi-Fi, memória eMMC e fonte. Identificamos exatamente o que está causando lentidão ou travamentos." },
  { title: "Orçamento fechado", description: "Você recebe o valor final por escrito. Só executamos com aprovação — se não compensar, avisamos honestamente." },
  { title: "Reparo e devolução", description: "Substituição do componente ou reinstalação de firmware, teste completo dos apps principais e devolução com garantia de 90 dias na mão de obra." },
];

const INCLUDES = [
  "Diagnóstico completo de software e hardware",
  "Reinstalação de firmware oficial do fabricante",
  "Teste de Netflix, YouTube, Prime Video, Globoplay e Disney+",
  "Verificação de módulo Wi-Fi e conectividade HDMI",
  "Coleta e devolução em Curitiba e RMC",
  "Garantia de 90 dias na mão de obra e nota fiscal (NFS-e)",
];

const NOT_WORTH_IT = [
  "Smart TVs com mais de 6 anos e placa principal descontinuada.",
  "Modelos de entrada onde a placa nova custa mais do que uma TV nova equivalente.",
  "TVs com painel também comprometido (nesses casos, orientamos comprar nova).",
];

function openTriage() {
  window.dispatchEvent(
    new CustomEvent("triage:open", {
      detail: {
        source: "servicos_reparo_smart_tv_curitiba",
        category: "tv",
        symptomSlug: SYMPTOM_SLUG,
      },
    }),
  );
}

export default function ReparoSmartTVCuritiba() {
  const symptom = getSymptomBySlug(SYMPTOM_SLUG)!;

  const metaTitle = "Reparo de Smart TV em Curitiba | Travando, App não abre, Wi-Fi";
  const metaDescription =
    "Reparo de Smart TV em Curitiba: TV travando, apps que não abrem, firmware e módulo Wi-Fi. Coleta, diagnóstico honesto e garantia de 90 dias.";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Reparo de Smart TV em Curitiba",
    serviceType: "Diagnóstico e reparo de televisores Smart (software, placa principal, módulo Wi-Fi)",
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
      { "@type": "ListItem", position: 3, name: "Reparo de Smart TV em Curitiba", item: PAGE_URL },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(buildWebPageSchema({ url: PAGE_URL, name: metaTitle, description: metaDescription }))}</script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Início</Link>
            <span className="mx-2">/</span>
            <Link to="/servicos" className="hover:text-primary">Serviços</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Reparo de Smart TV em Curitiba</span>
          </nav>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Tv className="w-3.5 h-3.5" /> Serviço técnico em Curitiba e RMC
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Reparo de Smart TV em Curitiba
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            TV Smart travando, apps que não abrem, reinício aleatório, Wi-Fi da TV que não conecta ou atualização de firmware travada. Fazemos diagnóstico honesto <strong>antes</strong> de qualquer orçamento — se não compensar reparar, avisamos.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Modalidade</div>
              <div className="font-semibold text-foreground mt-1 flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Coleta em bancada
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Faixa de preço</div>
              <div className="font-semibold text-foreground mt-1">R$ 250 a R$ 900</div>
              <div className="text-xs text-muted-foreground mt-1">coleta + diagnóstico R$ 299,99</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Prazo médio</div>
              <div className="font-semibold text-foreground mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> 5 a 20 dias
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={openTriage}
              data-triage-source="servicos_reparo_smart_tv_curitiba"
              data-triage-category="tv"
            >
              Iniciar triagem <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to="/servicos">
              <Button size="lg" variant="outline">Ver outros serviços</Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Todo contato começa pela triagem online. Após a classificação, você recebe o link direto para o WhatsApp do técnico responsável.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Como funciona o reparo</h2>
          <p className="mt-3 text-muted-foreground">
            Um processo padronizado, com decisão de viabilidade antes de qualquer cobrança maior.
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
              <AlertTriangle className="w-6 h-6 text-amber-600" /> Quando não compensa reparar
            </h2>
            <ul className="mt-5 space-y-3">
              {NOT_WORTH_IT.map((it) => (
                <li key={it} className="flex gap-2 text-sm text-foreground">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ServiceGallery
        title="O que está incluso no reparo de Smart TV"
        intro="Exemplos ilustrativos do que fazemos em bancada e do resultado esperado após o reparo. Não são fotos de atendimentos reais."
        items={GALLERY}
      />

      <section className="py-12 md:py-16 border-t border-border bg-muted/30">
        <div className="container-custom max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Reparo de Smart TV por bairro em Curitiba</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">Páginas dedicadas com contexto local, faixa de preço e triagem pré-classificada por bairro.</p>
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
            {BAIRROS_CURITIBA_SERVICO.map((b) => (
              <li key={b.slug}>
                <Link
                  to={`/servicos/reparo-smart-tv/curitiba/${b.slug}`}
                  className="block px-3 py-2 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground transition"
                >
                  {b.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="py-16 md:py-20 border-t border-border">
        <div className="container-custom max-w-3xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <HelpCircle className="w-3.5 h-3.5" /> Perguntas Frequentes
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              Dúvidas sobre reparo de Smart TV em Curitiba
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

      <section className="py-16 border-t border-border bg-primary/5">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Pronto para o diagnóstico da sua Smart TV?
          </h2>
          <p className="mt-3 text-muted-foreground">
            A triagem leva menos de 2 minutos e você recebe uma previsão realista antes de qualquer coleta.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              onClick={openTriage}
              data-triage-source="servicos_reparo_smart_tv_curitiba_final"
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
