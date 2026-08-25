import { Helmet } from "@/lib/helmet-compat";
import { Link } from "@/lib/router-compat";
import { ArrowRight, ShieldCheck, Home, Clock, Wifi, CheckCircle2, HelpCircle, Router, Printer, AlertTriangle } from "lucide-react";
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
import { clampTitle, clampDescription } from "@/components/seo/SEOHead";

const GALLERY = [
  {
    src: "/gallery/wifi-heatmap.webp",
    alt: "Ilustração de planta baixa de residência com mapa de calor de sinal de Wi-Fi por cômodo",
    caption: "Diagnóstico de cobertura por cômodo com medição de sinal antes de recomendar qualquer troca.",
    width: 1280,
    height: 720,
  },
  {
    src: "/gallery/wifi-mesh.webp",
    alt: "Ilustração de técnico configurando sistema mesh Wi-Fi integrado a TV e câmera de segurança",
    caption: "Configuração de mesh e integração de TV, câmeras e assistentes na mesma rede.",
    width: 1280,
    height: 720,
  },
];

const SYMPTOM_SLUG = "wifi-lento-instavel";
const PAGE_PATH = "/servicos/configuracao-wifi-curitiba";
const PAGE_URL = `https://precisodeumtecnico.com${PAGE_PATH}`;

const PROCESS = [
  { title: "Triagem online", description: "Você descreve o que acontece: cai em cômodo específico, lento à noite, roteador novo, mudança de provedor, mesh a instalar." },
  { title: "Pré-orientação remota", description: "Ajustes simples (reiniciar, mudar canal, atualizar firmware) orientamos sem cobrar visita." },
  { title: "Agendamento da visita", description: "Confirmada a necessidade da visita, você escolhe janela de horário. Cobrança mínima R$ 99,99 informada por escrito." },
  { title: "Diagnóstico no local", description: "Medição de sinal por cômodo, análise de canais 2,4 e 5 GHz, teste de velocidade real e verificação do roteador do provedor." },
  { title: "Configuração e testes", description: "Reconfiguração de rede, SSID único, senha nova, integração de TV, câmeras, impressoras e assistentes de voz." },
  { title: "Entrega documentada", description: "Você recebe por escrito a nova configuração (SSID, senha, canal, posição do roteador) e recomendações de upgrade se fizer sentido." },
];

const INCLUDES = [
  "Diagnóstico de sinal por cômodo com equipamento de medição",
  "Configuração de roteador principal e/ou mesh",
  "SSID único, senha segura e rede de visitantes",
  "Integração de TV, câmeras IP, impressora e assistentes de voz",
  "Análise e mudança de canal Wi-Fi (2,4 e 5 GHz)",
  "Recomendações por escrito de upgrade, se necessário",
];
/**
 * Escopo de impressoras/periféricos tratado nesta página: exclusivamente
 * conectividade e compartilhamento em rede. Reparo mecânico ou eletrônico
 * está explicitamente fora e é sinalizado na própria seção.
 */
const PRINTER_NETWORK_SCOPE = [
  {
    title: "Impressora sumiu depois de trocar o roteador",
    description:
      "Reconexão do equipamento ao SSID correto e ajuste do endereço IP para ele não mudar a cada reinício da rede.",
  },
  {
    title: "Compartilhamento entre computadores",
    description:
      "Configuração para que todas as máquinas da casa ou do escritório enxerguem e usem a mesma impressora.",
  },
  {
    title: "Driver oficial e fila de impressão",
    description:
      "Instalação do driver do fabricante no computador e liberação de trabalhos travados na fila de impressão.",
  },
  {
    title: "Descoberta na rede e comunicação",
    description:
      "Verificação de por que o dispositivo não aparece: faixa de IP diferente, isolamento de clientes no roteador ou rede de visitantes.",
  },
  {
    title: "Scanner em rede, quando suportado",
    description:
      "Configuração da digitalização para o computador nos modelos que oferecem esse recurso de fábrica.",
  },
  {
    title: "Armazenamento simples em rede",
    description:
      "Compartilhamento de pastas entre computadores da mesma rede, dentro do que o equipamento existente permite.",
  },
];


function openTriage() {
  window.dispatchEvent(
    new CustomEvent("triage:open", {
      detail: {
        source: "servicos_configuracao_wifi_curitiba",
        category: "pc",
        symptomSlug: SYMPTOM_SLUG,
      },
    }),
  );
}

export default function ConfiguracaoWifiCuritiba() {
  const symptom = getSymptomBySlug(SYMPTOM_SLUG)!;

  const metaTitle = "Configuração de Wi-Fi em Curitiba | Rede, Mesh e Troubleshooting";
  const metaDescription =
    "Configuração e troubleshooting de Wi-Fi em Curitiba e Região Metropolitana. Visita técnica a partir de R$ 99,99, análise de sinal por cômodo, instalação de mesh e integração de TV, câmeras e impressora. Toda visita começa pela triagem online.";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Configuração de Wi-Fi em Curitiba",
    serviceType: "Configuração, instalação e troubleshooting de rede Wi-Fi residencial e escritório",
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
      price: "99.99",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "BRL",
        minPrice: 99.99,
        description: "Visita técnica mínima. Serviços adicionais orçados no local antes de executar.",
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
      { "@type": "ListItem", position: 3, name: "Configuração de Wi-Fi em Curitiba", item: PAGE_URL },
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

      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="container-custom max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">Início</Link>
            <span className="mx-2">/</span>
            <Link to="/servicos" className="hover:text-primary">Serviços</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Configuração de Wi-Fi em Curitiba</span>
          </nav>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Wifi className="w-3.5 h-3.5" /> Visita técnica em Curitiba e RMC
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Configuração de Wi-Fi em Curitiba
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Rede que cai, cômodo sem sinal, roteador novo para configurar, mesh a instalar ou integração de TV, câmeras e impressora. Fazemos diagnóstico no local com medição real e ajustamos o que precisar — sem empurrar equipamento que você não precisa.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Modalidade</div>
              <div className="font-semibold text-foreground mt-1 flex items-center gap-2">
                <Home className="w-4 h-4 text-primary" /> Visita em domicílio
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Faixa de preço</div>
              <div className="font-semibold text-foreground mt-1">A partir de R$ 99,99</div>
              <div className="text-xs text-muted-foreground mt-1">mesh/reconfig. entre R$ 150 e R$ 450</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Prazo</div>
              <div className="font-semibold text-foreground mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Mesmo dia ou até 72h
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={openTriage}
              data-triage-source="servicos_configuracao_wifi_curitiba"
              data-triage-category="pc"
            >
              Iniciar triagem <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to="/servicos">
              <Button size="lg" variant="outline">Ver outros serviços</Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Todo contato começa pela triagem online. Após a classificação, você recebe o link direto para o WhatsApp do técnico e a janela de visita.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Etapas do atendimento</h2>
          <p className="mt-3 text-muted-foreground">
            Um roteiro claro, do primeiro contato à entrega da rede funcionando.
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
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" /> O que está incluso na visita
          </h2>
          <ul className="mt-5 grid sm:grid-cols-2 gap-3">
            {INCLUDES.map((it) => (
              <li key={it} className="flex gap-2 text-sm text-foreground rounded-lg border border-border bg-card p-4">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-lg border border-border bg-card p-5 flex gap-3">
            <Router className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Compra de equipamento é opcional.</strong> Se um mesh ou roteador novo for necessário, indicamos modelos e você compra por conta própria — sem markup embutido no orçamento.
            </p>
          </div>
        </div>
      </section>

      <ServiceGallery
        title="Como diagnosticamos e configuramos seu Wi-Fi"
        intro="Exemplos ilustrativos de cobertura por cômodo e da configuração de mesh integrado. Não são fotos de atendimentos reais."
        items={GALLERY}
      />

      <section
        id="impressoras-e-perifericos-em-rede"
        aria-labelledby="impressoras-rede-titulo"
        className="py-16 md:py-20 border-t border-border"
      >
        <div className="container-custom max-w-4xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Printer className="w-3.5 h-3.5" /> Dispositivos conectados à rede
          </span>
          <h2
            id="impressoras-rede-titulo"
            className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground"
          >
            Impressoras e periféricos em rede
          </h2>
          <p className="mt-3 text-muted-foreground">
            Impressora que some da rede depois de trocar o roteador, computador novo que não
            enxerga a multifuncional, digitalização que parou de chegar no PC, trabalho que fica
            preso na fila. São problemas de <strong className="text-foreground">rede e
            configuração</strong>, não de peça — e é exatamente esse recorte que atendemos aqui,
            junto com a visita de Wi-Fi.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {PRINTER_NETWORK_SCOPE.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-warning/40 bg-warning/5 p-5 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <h3 className="font-bold text-foreground">Até onde vai esse atendimento</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                O atendimento de impressoras e periféricos nesta página se limita à configuração,
                comunicação e compartilhamento em rede. Defeitos mecânicos ou eletrônicos dependem
                de assistência específica para o equipamento.
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Não fazemos, nesta modalidade: reparo mecânico, troca de cabeçote, recarga de
                cartucho ou toner, manutenção de fusor, reparo eletrônico, conserto de placa,
                manutenção de plotter nem fornecimento de suprimentos. Equipamentos muito antigos
                podem não ter driver compatível com o sistema atual — quando for o caso, avisamos
                antes de qualquer cobrança adicional.
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-border bg-muted/30 p-5">
            <h3 className="font-bold text-foreground">O que a visita costuma resolver</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Na prática, a maior parte dos chamados de impressora que chegam junto com Wi-Fi se
              resolve reconectando o equipamento à rede correta, fixando o endereço IP para ele não
              mudar a cada reinício do roteador, reinstalando o driver oficial do fabricante no
              computador e liberando a fila de impressão travada. Em escritórios, acrescenta-se o
              compartilhamento entre as máquinas e a verificação de que a rede permite a descoberta
              do dispositivo. Tudo isso entra na mesma visita de rede, sem cobrança de um
              atendimento separado.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link to="/suporte-tecnico-remoto" className="text-primary font-semibold hover:underline">
              Suporte técnico remoto
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">·</span>
            <Link
              to="/assistencia-tecnica-empresas-curitiba"
              className="text-primary font-semibold hover:underline"
            >
              Suporte técnico para empresas em Curitiba
            </Link>
            <span className="text-muted-foreground" aria-hidden="true">·</span>
            <Link to="/servicos" className="text-primary font-semibold hover:underline">
              Equipamentos e serviços atendidos
            </Link>
          </div>

          <div className="mt-6">
            <Button
              onClick={openTriage}
              data-triage-source="servicos_configuracao_wifi_curitiba_impressora"
              data-triage-category="pc"
            >
              Descrever o problema na triagem <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>


      <section className="py-12 md:py-16 border-t border-border bg-muted/30">
        <div className="container-custom max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Configuração de Wi-Fi por bairro em Curitiba</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl">Páginas dedicadas com o cenário real de rede em cada bairro e triagem pré-classificada.</p>
          <ul className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
            {BAIRROS_CURITIBA_SERVICO.map((b) => (
              <li key={b.slug}>
                <Link
                  to={`/servicos/configuracao-wifi/curitiba/${b.slug}`}
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
              Dúvidas sobre configuração de Wi-Fi em Curitiba
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
            Pronto para resolver seu Wi-Fi?
          </h2>
          <p className="mt-3 text-muted-foreground">
            A triagem leva menos de 2 minutos. Você recebe janela de visita e o WhatsApp direto do técnico após a classificação.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              onClick={openTriage}
              data-triage-source="servicos_configuracao_wifi_curitiba_final"
              data-triage-category="pc"
            >
              Iniciar triagem agora <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
