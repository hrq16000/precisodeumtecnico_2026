import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { COMMERCIAL, PRICING, SLA } from "@/data/pricingPolicy";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, CheckCircle2, MessageCircle, ScrollText, XCircle } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/precos-e-politicas";

const TABLE = [
  PRICING.benchDiagnosis,
  PRICING.technicalVisit,
  PRICING.pickupDelivery,
];

const ACCEPT = [
  "Triagem completa preenchida, com fotos e/ou vídeos do equipamento e do sintoma.",
  "Equipamento identificável (marca, modelo) e com acesso físico seguro para o técnico.",
  "Endereço dentro da área de atendimento direta ou atendimento por coleta e entrega.",
  "Aceite formal do escopo, prazo e valor apresentados no orçamento por escrito.",
  "Serviços de informática, notebooks, TVs, redes/Wi-Fi, CFTV, elétrica e ar-condicionado.",
];

const REFUSE = [
  "Pedidos sem triagem, sem fotos/vídeos ou com dados incompatíveis com o equipamento.",
  "Equipamentos com sinistro em aberto, origem duvidosa ou sem comprovação de posse.",
  "Serviços que exijam violação de lacre de garantia de fabricante ainda vigente.",
  "Casos em que a peça necessária foi descontinuada e não há alternativa segura.",
  "Solicitação de conserto usando peças fornecidas pelo cliente fora da política publicada.",
  "Reparos que coloquem em risco a segurança elétrica do imóvel ou do técnico.",
];

const WARRANTY_SCOPE = [
  "Mão de obra do serviço executado, limitada ao defeito descrito na ordem de atendimento.",
  "Configuração entregue (sistema, rede, dispositivos) dentro do escopo aprovado.",
  "Peças e materiais seguem a garantia do fabricante, informada no orçamento.",
];

const WARRANTY_OUT = [
  "Mau uso, queda, líquidos, surto elétrico e intervenção de terceiros após a entrega.",
  "Defeito diferente do que consta na ordem de atendimento original.",
  "Software, dados e licenças não incluídos no escopo aprovado.",
];

const FAQ = [
  {
    question: "Qual é o valor mínimo cobrado?",
    answer: `Diagnóstico em bancada e visita técnica partem de ${PRICING.benchDiagnosis.priceLabel} por bloco de até 30 minutos. Atendimento com coleta e entrega tem valor mínimo pré-aprovado de ${PRICING.pickupDelivery.priceLabel}.`,
  },
  {
    question: "O preço pode mudar depois do orçamento?",
    answer: COMMERCIAL_TERMS.preApprovedPolicyText,
  },
  {
    question: "Em que casos vocês recusam o atendimento?",
    answer: `Recusamos quando falta triagem completa, quando há lacre de fabricante vigente, quando não há comprovação de posse do equipamento ou quando o reparo oferece risco de segurança. ${REFUSE[0]}`,
  },
  {
    question: "Qual é o prazo de execução?",
    answer: `${COMMERCIAL_TERMS.minimumQueueText} Com encomenda de peças, o mínimo passa para ${SLA.minWithPartsLabel}; a faixa máxima estimada é de ${SLA.maxLabel}.`,
  },
  {
    question: "Como funciona o parcelamento?",
    answer: `${COMMERCIAL.installments}. Os valores de serviço e de peças aparecem separados no orçamento por escrito.`,
  },
];

export default function PrecosEPoliticas() {
  const waUrl = buildWhatsAppUrl({
    service: "consulta de preços e políticas",
    sourcePage: "/precos-e-politicas",
  });

  return (
    <Layout>
      <SEOHead
        title="Preços e Políticas de Atendimento | Preciso de Um Técnico"
        description="Tabela de valores, critérios de aceite e recusa de serviço, regras do orçamento pré-aprovado, prazos e escopo da garantia — tudo publicado por escrito."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Preços", url: "https://precisodeumtecnico.com/precos" },
          { name: "Preços e políticas", url: CANONICAL },
        ]}
        faq={FAQ}
      />

      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <ScrollText className="h-4 w-4" aria-hidden="true" />
            Regras publicadas
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Preços e políticas de atendimento
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Valores praticados, o que aceitamos, o que recusamos e até onde vai a garantia. Sem
            letra miúda e sem valor combinado por telefone.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="precos-politicas-hero"
              data-service="consulta de preços e políticas"
              aria-label="Tirar dúvidas sobre preços e políticas pelo WhatsApp"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Tirar dúvida na triagem
            </a>
            <Link
              to="/processo-de-atendimento"
              className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Ver o passo a passo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Valores praticados</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {TABLE.map((item) => (
              <article key={item.label} className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground">{item.label}</h3>
                <p className="mt-2 text-xl font-bold text-primary">{item.priceLabel}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{COMMERCIAL.installments}. {SLA.disclaimer}</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 max-w-4xl grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Critérios de aceite
            </div>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Quando aceitamos o serviço</h2>
            <ul className="mt-5 space-y-2 text-sm text-foreground/90 list-disc pl-5">
              {ACCEPT.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <XCircle className="h-4 w-4" aria-hidden="true" />
              Critérios de recusa
            </div>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Quando recusamos</h2>
            <ul className="mt-5 space-y-2 text-sm text-foreground/90 list-disc pl-5">
              {REFUSE.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Escopo da garantia</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-foreground">Coberto</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/90 list-disc pl-5">
                {WARRANTY_SCOPE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Não coberto</h3>
              <ul className="mt-3 space-y-2 text-sm text-foreground/90 list-disc pl-5">
                {WARRANTY_OUT.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{COMMERCIAL_TERMS.cancellationText}</p>
          <p className="mt-2 text-sm text-muted-foreground">{COMMERCIAL.partnersDisclaimer}</p>
          <Link to="/garantia-e-cobertura" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary underline">
            Regras completas de garantia e cobertura
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/40 border-t border-border">
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
