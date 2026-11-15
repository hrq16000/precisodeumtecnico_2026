import { PRICING } from "@/data/pricingPolicy";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { CTASection } from "@/components/home/CTASection";
import { PageTableOfContents } from "@/components/layout/PageTableOfContents";
import { RelatedLinksSection } from "@/components/seo/RelatedLinksSection";
import { Button } from "@/components/ui/button";
import { openTriage } from "@/lib/triageFlag";
import { trackCtaClick } from "@/lib/analytics";
import { ClipboardList, Search, Wrench, ShieldCheck, MessageCircle } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/como-funciona";

const STEPS = [
  {
    icon: Search,
    title: "1. Você descreve o problema na triagem",
    text: "A triagem online tem poucas perguntas objetivas: equipamento, sintoma, cidade e bairro. Nada de telefonema ou espera em fila — em menos de um minuto o caso já está registrado com o contexto certo para o técnico.",
  },
  {
    icon: ClipboardList,
    title: "2. Você vê a faixa de preço antes de decidir",
    text: `Com o sintoma classificado, a própria triagem indica o caminho: visita de inspeção (a partir de R$ 99,99, ${PRICING.technicalVisit.timeLabel}) ou coleta para bancada (R$ 299,99). A faixa completa por tipo de serviço fica na página de preços e condições, sem valor escondido.`,
  },
  {
    icon: Wrench,
    title: "3. Um técnico responsável assume o atendimento",
    text: "O caso é direcionado ao técnico da rota do seu bairro. Ele confirma janela de atendimento, leva as peças e ferramentas prováveis para o sintoma informado e faz o diagnóstico presencial ou em bancada.",
  },
  {
    icon: ShieldCheck,
    title: "4. Orçamento aprovado antes do reparo, com garantia",
    text: "Nenhum reparo começa sem aprovação. Depois do diagnóstico você recebe o orçamento fechado; se aprovar, o serviço é executado e sai com garantia de 90 dias sobre a mão de obra e as peças aplicadas.",
  },
];

const FAQ = [
  {
    question: "Preciso ligar para alguém para conseguir atendimento?",
    answer:
      "Não. Todo o atendimento começa pela triagem online. Ela substitui a ligação: você descreve o problema, informa cidade e bairro e recebe a confirmação com o resumo do caso já registrado.",
  },
  {
    question: "Como sei quanto vou pagar antes de fechar?",
    answer:
      "A triagem mostra qual modalidade se aplica ao seu caso — visita de inspeção por R$ 99,99 ou coleta para bancada por R$ 299,99. O valor do reparo em si só é fechado depois do diagnóstico, sempre com aprovação sua antes da execução.",
  },
  {
    question: "Como encontro um técnico que atenda o meu bairro?",
    answer:
      "A página de áreas atendidas lista todas as cidades e bairros com rota ativa. Ao abrir a página do bairro, a triagem já vem contextualizada com a sua localidade e a janela de atendimento disponível.",
  },
  {
    question: "O que acontece se o equipamento não tiver conserto viável?",
    answer:
      "Você recebe o laudo com o motivo da recusa e paga apenas a taxa de diagnóstico já informada no início (visita ou bancada). Não cobramos por serviço que não foi executado.",
  },
  {
    question: "Qual é a garantia do serviço?",
    answer:
      "90 dias sobre a mão de obra e sobre as peças fornecidas por nós, contados da entrega. A garantia não cobre novos danos por queda, líquido, surto elétrico ou intervenção de terceiros.",
  },
];

export default function ComoFunciona() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Como funciona o atendimento técnico: da triagem ao reparo com garantia",
    description:
      "Passo a passo para encontrar preço e técnico responsável: triagem online, faixa de preço, atendimento na rota do bairro e orçamento aprovado antes do reparo.",
    totalTime: "PT10M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "BRL", value: "99.99" },
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title.replace(/^\d+\.\s*/, ""),
      text: s.text,
      url: `${CANONICAL}#passo-${i + 1}`,
    })),
  };

  return (
    <Layout>
      <SEOHead
        title="Como funciona: preço e técnico em poucos passos"
        description="Entenda o passo a passo do atendimento: triagem online sem telefone, faixa de preço antes de decidir, técnico na rota do seu bairro e orçamento aprovado antes do reparo."
        canonical={CANONICAL}
        schema={howToSchema}
        faq={FAQ}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Como funciona", url: CANONICAL },
        ]}
      />

      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container-custom text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-5">
            Como funciona: do problema ao reparo com garantia
          </h1>
          <p className="text-lg text-white/80">
            Sem telefone, sem fila e sem preço escondido. Veja em quatro passos como você encontra a
            faixa de preço e o técnico responsável pelo seu bairro em Curitiba e região.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              variant="whatsapp"
              onClick={() => {
                trackCtaClick({
                  surface: "service_page",
                  cta_id: "como_funciona_hero_triagem",
                  label: "Iniciar triagem",
                  destination: "/como-funciona",
                });
                openTriage({ source: "como_funciona_hero" });
              }}
            >
              <MessageCircle className="w-4 h-4" /> Iniciar triagem agora
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-background">
        <div className="container-custom">
          <PageTableOfContents
            className="mb-10"
            items={[
              { id: "passos", label: "Os 4 passos do atendimento" },
              { id: "preco", label: "Onde ver os preços" },
              { id: "como-funciona-faq", label: "Perguntas frequentes" },
            ]}
          />

          <h2 id="passos" className="text-2xl md:text-3xl font-bold mb-6 scroll-mt-24">
            Os 4 passos do atendimento
          </h2>
          <ol className="grid gap-5 md:grid-cols-2">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                id={`passo-${i + 1}`}
                className="p-6 rounded-xl border border-border bg-card scroll-mt-24"
              >
                <step.icon className="w-6 h-6 text-success mb-3" aria-hidden="true" />
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>

          <h2 id="preco" className="text-2xl md:text-3xl font-bold mt-14 mb-4 scroll-mt-24">
            Onde ver os preços e a cobertura
          </h2>
          <p className="text-muted-foreground max-w-3xl mb-4">
            A referência de valores fica na página de{" "}
            <a href="/precos" className="text-success underline underline-offset-4">
              preços e condições de atendimento
            </a>
            , com a visita a partir de R$ 99,99 e a coleta por R$ 299,99. Para conferir se a sua
            localidade tem rota ativa, consulte as{" "}
            <a href="/areas-atendidas" className="text-success underline underline-offset-4">
              áreas atendidas: cidades e bairros
            </a>
            . As duas páginas levam direto à triagem já com o contexto da sua região.
          </p>

          <h2 id="como-funciona-faq" className="text-2xl md:text-3xl font-bold mt-14 mb-6 scroll-mt-24">
            Perguntas frequentes
          </h2>
          <div className="space-y-4 max-w-3xl">
            {FAQ.map((item) => (
              <div key={item.question} className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold mb-2">{item.question}</h3>
                <p className="text-muted-foreground text-sm">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedLinksSection surface="service_page" items={["precos", "areas", "servicos"]} />

      <CTASection />
    </Layout>
  );
}
