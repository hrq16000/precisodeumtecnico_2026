import { Helmet } from "@/lib/helmet-compat";
import { Link } from "@/lib/router-compat";
import {
  ArrowRight, Radio, Speaker, Plug, Wrench, Clock, ShieldCheck,
  CheckCircle2, HelpCircle, AlertTriangle,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { clampTitle, clampDescription } from "@/components/seo/SEOHead";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { audioPhotos } from "@/data/publicPhotos";
import { RelatedLinksSection } from "@/components/seo/RelatedLinksSection";
import { openTriage } from "@/lib/triageFlag";

const PAGE_PATH = "/servicos/conserto-de-som-e-audio-curitiba";
const PAGE_URL = `https://precisodeumtecnico.com${PAGE_PATH}`;

const metaTitle = "Conserto de Som, Rádio e Caixa de Som em Curitiba";
const metaDescription =
  "Conserto de micro system, rádio, caixa de som Bluetooth, amplificador e fontes (inclusive de scooter elétrica) em Curitiba. Mão de obra a partir de R$ 99,99, com laudo por escrito.";

const EQUIPMENTS = [
  {
    icon: Radio,
    title: "Micro system, rádio e aparelho de som",
    text:
      "Micro system com CD travado, bandeja que não abre, rádio sem sintonia, som que liga e desliga sozinho, entrada auxiliar/USB sem áudio e display apagado. Atendemos aparelhos antigos e atuais, incluindo equipamentos que já não têm assistência de fábrica.",
  },
  {
    icon: Speaker,
    title: "Caixa de som Bluetooth, ativa e passiva",
    text:
      "Caixa portátil que não carrega ou não segura carga, Bluetooth que não pareia, som distorcido ou chiado, alto-falante rasgado, conector P10/P2 solto e placa oxidada por umidade. Também atendemos caixas ativas de festa e retorno de palco.",
  },
  {
    icon: Wrench,
    title: "Amplificador, receiver e mesa de som",
    text:
      "Amplificador em proteção, canal mudo, ruído de fundo (hum), potenciômetro chiando, saída queimada, receiver que desliga ao subir o volume e mesas com canal sem sinal. Bancada com instrumentos de medição e teste sob carga.",
  },
  {
    icon: Plug,
    title: "Fontes e carregadores — inclusive de scooter",
    text:
      "Fonte chaveada de som, régua de fonte, carregador de scooter e patinete elétrico, fonte de bicicleta elétrica, fonte de mesa de som e adaptadores genéricos. Trocamos capacitores, diodos, fusíveis e reparamos o circuito quando é viável.",
  },
];

const SYMPTOMS = [
  "Não liga, sem nenhum sinal de vida",
  "Liga, mas não sai som em um ou nos dois canais",
  "Som distorcido, abafado ou com chiado constante",
  "Desliga sozinho ao aumentar o volume (entra em proteção)",
  "Bluetooth não pareia ou perde conexão a poucos metros",
  "Bateria da caixa portátil dura poucos minutos",
  "Cheiro de queimado, estalo ou fusível abrindo repetidamente",
  "Fonte esquenta demais, apita ou acende o LED e não carrega",
  "Carregador de scooter não completa a carga ou desarma",
  "Entrada USB, auxiliar ou cartão SD sem leitura",
];

const PROCESS = [
  { title: "Triagem online", description: "Você descreve o aparelho, a marca e o sintoma. Fotos ajudam a antecipar o diagnóstico ainda antes de sair de casa." },
  { title: "Orientação prévia", description: "Se o caso for cabo, configuração de fonte ou pareamento, orientamos sem cobrar nada. Só abrimos ordem de serviço quando há reparo real." },
  { title: "Entrada em bancada", description: "Você leva ou pedimos coleta. Mão de obra a partir de R$ 99,99, abatida do reparo se você aprovar o orçamento." },
  { title: "Diagnóstico com medição", description: "Teste de tensões, corrente, ESR de capacitores e prova de carga. Nada é trocado por chute." },
  { title: "Orçamento por escrito", description: "Peça, mão de obra, prazo e garantia detalhados antes de qualquer intervenção. Você aprova ou retira o aparelho." },
  { title: "Reparo, teste e entrega", description: "Após o conserto, o aparelho fica em teste de bancada com carga antes da devolução, com laudo do que foi feito." },
];

const INCLUDES = [
  "Diagnóstico eletrônico com multímetro, fonte de bancada e teste de carga",
  "Troca de capacitores, retificadores, fusíveis e reguladores",
  "Reparo de trilhas, solda fria e conectores de alimentação",
  "Substituição de potenciômetros, jacks P2/P10 e chaves",
  "Recuperação de placa com oxidação leve (limpeza e reflow de contatos)",
  "Troca de bateria e reparo de circuito de carga em caixas portáteis",
  "Reparo e substituição de fontes chaveadas e carregadores",
  "Laudo por escrito com garantia de 90 dias sobre o serviço executado",
];

const OUT_OF_SCOPE = [
  "Aparelhos com placa partida, corrosão generalizada ou peça descontinuada sem reposição no mercado — nesses casos informamos a inviabilidade e não cobramos reparo.",
  "Alteração de potência acima da especificação do fabricante ou 'turbinar' amplificador.",
  "Reparo em bateria de lítio danificada/inchada: por segurança, apenas substituímos por bateria compatível.",
];

const PRICES = [
  { item: "Diagnóstico / mão de obra mínima em bancada", value: "R$ 99,99", note: "abatido do reparo aprovado" },
  { item: "Reparo de fonte chaveada ou carregador", value: "a partir de R$ 99,99", note: "peças à parte, informadas no orçamento" },
  { item: "Micro system, rádio e caixa Bluetooth", value: "a partir de R$ 99,99", note: "valor final depende do componente" },
  { item: "Amplificador, receiver e caixa ativa", value: "a partir de R$ 99,99", note: "casos com estágio de potência queimado exigem avaliação" },
  { item: "Coleta e entrega em Curitiba e RMC", value: "R$ 299,99", note: "opcional, quando você não pode trazer o aparelho" },
];

const FAQ = [
  {
    q: "Quanto custa consertar um micro system ou uma caixa de som?",
    a: "A mão de obra começa em R$ 99,99, valor que é abatido do reparo caso você aprove o orçamento. O total depende da peça necessária, e nada é trocado antes da sua aprovação por escrito.",
  },
  {
    q: "Vocês consertam fonte de scooter e patinete elétrico?",
    a: "Sim. Carregadores de scooter, patinete e bicicleta elétrica são fontes chaveadas e entram na mesma linha de reparo: teste de saída, troca de capacitores, diodos, fusível e regulador, com prova de carga antes da entrega.",
  },
  {
    q: "Vale a pena consertar um aparelho de som antigo?",
    a: "Muitas vezes sim: micro systems e amplificadores antigos costumam falhar por capacitores e fonte, itens de custo baixo. Se o conserto ficar próximo do valor de um equipamento equivalente, dizemos isso claramente antes de você gastar.",
  },
  {
    q: "Minha caixa Bluetooth não segura carga. Tem solução?",
    a: "Na maioria dos casos é a bateria ou o circuito de carga. Testamos a autonomia real e o consumo em repouso; quando a bateria está degradada, substituímos por uma compatível com a mesma tensão e capacidade.",
  },
  {
    q: "Qual o prazo médio do reparo?",
    a: "Diagnóstico em até 48 horas úteis após a entrada. O reparo costuma sair entre 2 e 5 dias úteis; casos que dependem de peça sob encomenda têm prazo informado no orçamento.",
  },
  {
    q: "O serviço tem garantia?",
    a: "Sim, 90 dias sobre a mão de obra e sobre a peça substituída, cobrindo o mesmo defeito reparado. A garantia consta no laudo entregue com o aparelho.",
  },
  {
    q: "Posso levar minha própria peça?",
    a: "Pode. Nesse caso a garantia cobre apenas a mão de obra, já que não temos controle sobre a procedência do componente fornecido.",
  },
  {
    q: "Atendem fora de Curitiba?",
    a: "Sim. Atendemos Curitiba e Região Metropolitana com coleta opcional e recebemos aparelhos de outras cidades enviados por transportadora, com o mesmo fluxo de laudo e orçamento.",
  },
];

export default function ConsertoSomAudio() {
  const photos = audioPhotos();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Conserto de som, rádio, caixas de som e fontes",
    serviceType: "Reparo de equipamentos de áudio e fontes de alimentação",
    description: metaDescription,
    areaServed: "Curitiba e Região Metropolitana",
    provider: { "@type": "LocalBusiness", name: "Preciso de Um Técnico", url: "https://precisodeumtecnico.com" },
    offers: {
      "@type": "Offer",
      price: 99.99,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url: PAGE_URL,
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
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
      { "@type": "ListItem", position: 3, name: "Conserto de som e áudio em Curitiba", item: PAGE_URL },
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={clampDescription(metaDescription)} />

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
            <span className="text-foreground">Conserto de som e áudio</span>
          </nav>

          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Speaker className="w-3.5 h-3.5" /> Bancada de eletrônica em Curitiba e RMC
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Conserto de som, rádio, caixa de som e fontes em Curitiba
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Micro system, rádio, caixa Bluetooth, amplificador, mesa de som, fonte chaveada e carregador de scooter
            elétrica. Diagnóstico com medição real, orçamento por escrito antes de qualquer troca e mão de obra a
            partir de R$ 99,99 — valor abatido do reparo aprovado.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Modalidade</div>
              <div className="font-semibold text-foreground mt-1 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-primary" /> Bancada (coleta opcional)
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Mão de obra</div>
              <div className="font-semibold text-foreground mt-1">A partir de R$ 99,99</div>
              <div className="text-xs text-muted-foreground mt-1">abatida do reparo aprovado</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-xs text-muted-foreground">Prazo</div>
              <div className="font-semibold text-foreground mt-1 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Diagnóstico em até 48h úteis
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => openTriage({ source: "servicos_som_audio_curitiba", category: "som" })}
              data-triage-source="servicos_som_audio_curitiba"
              data-triage-category="som"
            >
              Iniciar triagem <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link to="/precos">
              <Button size="lg" variant="outline">Ver preços e condições</Button>
            </Link>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Todo atendimento começa pela triagem online. Depois da classificação você recebe o link direto do WhatsApp
            do técnico responsável, com o resumo do seu caso já preenchido.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border">
        <div className="container-custom max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Que tipo de aparelho de som consertamos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Trabalhamos com áudio doméstico, portátil e profissional de pequeno porte — e com as fontes que alimentam
            todos eles, incluindo carregadores de mobilidade elétrica.
          </p>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {EQUIPMENTS.map((e) => (
              <article key={e.title} className="rounded-lg border border-border bg-card p-5">
                <e.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="mt-3 font-bold text-foreground">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PublicPhotoBand
        title="Equipamentos e componentes que passam pela bancada"
        intro="Fotos reais de referência (Wikimedia Commons), com autoria e licença creditadas. Não usamos imagens geradas por IA nem apresentamos fotos de terceiros como atendimento próprio."
        photos={photos}
      />

      <section className="py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Sintomas mais comuns que atendemos
          </h2>
          <p className="mt-3 text-muted-foreground">
            Descreva o sintoma na triagem: quanto mais preciso, mais rápido o diagnóstico e menor a chance de troca
            desnecessária de peça.
          </p>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SYMPTOMS.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Como funciona o reparo, etapa por etapa
          </h2>
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
        <div className="container-custom max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              O que está incluído no serviço
            </h2>
            <ul className="mt-6 space-y-3">
              {INCLUDES.map((i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-primary" aria-hidden="true" /> O que não fazemos
            </h2>
            <ul className="mt-6 space-y-3">
              {OUT_OF_SCOPE.map((i) => (
                <li key={i} className="text-sm text-muted-foreground rounded-md border border-border bg-card p-3">
                  {i}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              Preferimos dizer que não tem conserto viável a cobrar por um reparo que não se sustenta.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 border-t border-border">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" aria-hidden="true" /> Valores de referência
          </h2>
          <p className="mt-3 text-muted-foreground">
            Faixas de partida. O valor fechado só existe depois do diagnóstico e sempre é enviado por escrito.
          </p>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
              <caption className="sr-only">Valores de referência para conserto de som, áudio e fontes</caption>
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="text-left p-3 font-semibold text-foreground">Serviço</th>
                  <th scope="col" className="text-left p-3 font-semibold text-foreground">Valor</th>
                  <th scope="col" className="text-left p-3 font-semibold text-foreground">Observação</th>
                </tr>
              </thead>
              <tbody>
                {PRICES.map((p) => (
                  <tr key={p.item} className="border-t border-border">
                    <td className="p-3 text-foreground">{p.item}</td>
                    <td className="p-3 font-semibold text-foreground whitespace-nowrap">{p.value}</td>
                    <td className="p-3 text-muted-foreground">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 md:py-20 bg-muted/30 border-t border-border">
        <div className="container-custom max-w-3xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              <HelpCircle className="w-3.5 h-3.5" /> Perguntas Frequentes
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              Dúvidas sobre conserto de som, rádio e fontes
            </h2>
          </div>
          <Accordion type="single" collapsible className="mt-8">
            {FAQ.map((f, i) => (
              <AccordionItem data-faq-item key={f.q} value={`faq-${i}`}>
                <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent data-faq-answer className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <RelatedLinksSection surface="service_page" items={["servicos", "precos", "areas", "faq"]} />

      <section className="py-16 border-t border-border bg-primary/5">
        <div className="container-custom max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Seu som parou? Comece pela triagem
          </h2>
          <p className="mt-3 text-muted-foreground">
            Leva menos de 2 minutos. Você descreve o aparelho e o sintoma, envia fotos se quiser e recebe o WhatsApp
            direto do técnico com o caso já resumido.
          </p>
          <div className="mt-6">
            <Button
              size="lg"
              onClick={() => openTriage({ source: "servicos_som_audio_curitiba_final", category: "som" })}
              data-triage-source="servicos_som_audio_curitiba_final"
              data-triage-category="som"
            >
              Iniciar triagem agora <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
