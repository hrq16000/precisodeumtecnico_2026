import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { PRICING, SLA } from "@/data/pricingPolicy";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, ClipboardList, MessageCircle } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/processo-de-atendimento";

interface Step {
  name: string;
  text: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    name: "1. Triagem online",
    text:
      "Você abre a triagem técnica, informa equipamento, sintoma e localidade e envia fotos ou vídeos do problema.",
    detail:
      "A triagem é obrigatória e substitui o telefone: é ela que registra o histórico do atendimento, evita deslocamento inútil e permite estimar prazo e faixa de valor antes de qualquer cobrança.",
  },
  {
    name: "2. Pré-diagnóstico e agendamento",
    text:
      "A equipe analisa o registro, classifica a urgência e confirma se o caso é visita no local, bancada ou coleta.",
    detail:
      `Casos leves resolvem em visita técnica (${PRICING.technicalVisit.priceLabel} por bloco de até 30 minutos). Equipamentos que exigem bancada seguem para coleta e entrega, com valor mínimo pré-aprovado de ${PRICING.pickupDelivery.priceLabel}.`,
  },
  {
    name: "3. Diagnóstico técnico",
    text:
      "O técnico executa os testes, identifica a causa raiz e registra as evidências do estado do equipamento.",
    detail:
      `O diagnóstico em bancada custa ${PRICING.benchDiagnosis.priceLabel} e é abatido quando o serviço é fechado com a gente.`,
  },
  {
    name: "4. Orçamento por escrito",
    text:
      "Você recebe o escopo, o prazo e o valor separados entre serviço e peças/materiais, sem execução antes do aceite.",
    detail: COMMERCIAL_TERMS.preApprovedPolicyText,
  },
  {
    name: "5. Execução do serviço",
    text:
      "Com o aceite registrado, o serviço entra na fila técnica e é executado com acompanhamento de status.",
    detail: `${COMMERCIAL_TERMS.minimumQueueText} ${SLA.disclaimer}`,
  },
  {
    name: "6. Entrega e pós-serviço",
    text:
      "Testes finais na sua frente, orientação de uso e abertura de garantia registrada para o serviço executado.",
    detail:
      "O acionamento de garantia é feito pela mesma triagem, com o comprovante de entrega e a descrição do sintoma — o histórico completo fica vinculado ao atendimento original.",
  },
];

const FAQ = [
  {
    question: "Preciso mesmo passar pela triagem online?",
    answer:
      "Sim. A triagem é o único canal de abertura de atendimento: é nela que registramos equipamento, sintoma, localidade e as fotos ou vídeos que permitem estimar prazo e valor antes do deslocamento.",
  },
  {
    question: "Quanto custa o diagnóstico?",
    answer: `Diagnóstico em bancada: ${PRICING.benchDiagnosis.priceLabel}, abatido em caso de fechamento. Visita técnica no seu endereço: ${PRICING.technicalVisit.priceLabel} por bloco de até 30 minutos, limitado a 2 horas.`,
  },
  {
    question: "O orçamento já inclui as peças?",
    answer: `Não. ${COMMERCIAL_TERMS.preApprovedPolicyText}`,
  },
  {
    question: "Em quanto tempo o serviço fica pronto?",
    answer: `${COMMERCIAL_TERMS.minimumQueueText} Com encomenda de peças, o prazo mínimo passa para ${SLA.minWithPartsLabel}, podendo chegar à faixa de ${SLA.maxLabel} em casos complexos.`,
  },
  {
    question: "E se eu desistir depois do diagnóstico?",
    answer: COMMERCIAL_TERMS.cancellationText,
  },
];

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como funciona o atendimento técnico, passo a passo",
  description:
    "Etapas do atendimento: triagem online, pré-diagnóstico, diagnóstico técnico, orçamento por escrito, execução e pós-serviço com garantia.",
  totalTime: "P3D",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "BRL",
    value: PRICING.benchDiagnosis.priceBRL,
  },
  step: STEPS.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: `${step.text} ${step.detail}`,
    url: `${CANONICAL}#passo-${index + 1}`,
  })),
};

export default function ProcessoAtendimento() {
  const waUrl = buildWhatsAppUrl({
    service: "abertura de atendimento",
    sourcePage: "/processo-de-atendimento",
  });

  return (
    <Layout>
      <SEOHead
        title="Processo de Atendimento Passo a Passo | Preciso de Um Técnico"
        description="Da triagem online ao pós-serviço: as 6 etapas do nosso atendimento técnico, com prazos, valores de diagnóstico e regras de orçamento por escrito."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Como funciona", url: "https://precisodeumtecnico.com/como-funciona" },
          { name: "Processo de atendimento", url: CANONICAL },
        ]}
        structuredData={[howToSchema]}
        faq={FAQ}
      />

      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Processo transparente
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Como funciona o atendimento, passo a passo
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Seis etapas registradas, do primeiro contato à garantia. Nada é executado sem
            diagnóstico e sem o seu aceite por escrito.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="processo-hero"
              data-service="abertura de atendimento"
              aria-label="Abrir atendimento pela triagem no WhatsApp"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Começar pela triagem
            </a>
            <Link
              to="/precos-e-politicas"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Preços e políticas
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">As 6 etapas</h2>
          <ol className="mt-8 space-y-5">
            {STEPS.map((step, index) => (
              <li
                key={step.name}
                id={`passo-${index + 1}`}
                className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-foreground">{step.name}</h3>
                <p className="mt-2 text-sm text-foreground/90">{step.text}</p>
                <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Perguntas frequentes</h2>
          <div className="mt-6 space-y-4">
            {FAQ.map((item) => (
              <article key={item.question} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
