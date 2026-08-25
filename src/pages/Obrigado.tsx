import { useMemo } from "react";
import { Link, useSearchParams } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { PRICING } from "@/data/pricingPolicy";
import { CheckCircle2, Clock, Truck, Wrench, ArrowRight } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/obrigado";

type Modality = "coleta" | "visita" | "bancada" | "orcamento";

const MODALITIES: Record<
  Modality,
  { label: string; headline: string; body: string; icon: typeof Truck; next: string[] }
> = {
  coleta: {
    label: "Coleta",
    headline: "Coleta solicitada — agora é só combinar o horário",
    body: `A coleta é feita mediante agendamento prévio, com logística e seguro inclusos. O orçamento pré-aprovado mínimo é de ${COMMERCIAL_TERMS.preApprovedBudget.minLabel} e não inclui peças, componentes, materiais ou itens adicionais.`,
    icon: Truck,
    next: [
      "Confirme endereço completo e uma janela de horário no WhatsApp.",
      "Separe cabos, fonte e acessórios necessários para o teste.",
      "Você recebe o protocolo assim que o equipamento entra na fila técnica.",
    ],
  },
  visita: {
    label: "Visita técnica",
    headline: "Visita técnica registrada — vamos confirmar a agenda",
    body: `A visita/diagnóstico é de ${COMMERCIAL_TERMS.diagnosisFee.priceLabel} por bloco de até 30 minutos. Se o serviço exigir bancada, seguimos para coleta (${PRICING.pickupDelivery.priceLabel}), sempre com sua aprovação.`,
    icon: Wrench,
    next: [
      "Confirme bairro, referência e horário no WhatsApp.",
      "Deixe o equipamento acessível e ligado na tomada.",
      "Qualquer valor adicional é informado antes da execução.",
    ],
  },
  bancada: {
    label: "Bancada",
    headline: "Atendimento em bancada registrado",
    body: `O diagnóstico em bancada é de ${COMMERCIAL_TERMS.diagnosisFee.priceLabel}. ${COMMERCIAL_TERMS.cancellationText}`,
    icon: Wrench,
    next: [
      "Aguarde a confirmação da entrada na fila técnica pelo WhatsApp.",
      "Guarde o protocolo para consultar o status da ordem de serviço.",
      "Peças, componentes e materiais são orçados à parte.",
    ],
  },
  orcamento: {
    label: "Orçamento",
    headline: "Recebemos sua solicitação de orçamento",
    body: COMMERCIAL_TERMS.preApprovedPolicyText,
    icon: CheckCircle2,
    next: [
      "Responda as últimas perguntas do técnico no WhatsApp.",
      "Fotos e vídeos do sintoma aceleram bastante a análise.",
      "Nada é executado sem sua aprovação por escrito.",
    ],
  },
};

const FAQ = [
  {
    question: "Em quanto tempo recebo retorno depois de enviar a triagem?",
    answer: COMMERCIAL_TERMS.minimumQueueText,
  },
  {
    question: "O orçamento pré-aprovado inclui peças?",
    answer: `Não. O valor mínimo de ${COMMERCIAL_TERMS.preApprovedBudget.minLabel} não inclui peças, componentes, materiais ou itens adicionais — esses itens são informados separadamente e só seguem mediante aprovação.`,
  },
  {
    question: "E se eu desistir depois do diagnóstico?",
    answer: COMMERCIAL_TERMS.cancellationText,
  },
  {
    question: "Preciso refazer a triagem se eu fechar o WhatsApp?",
    answer:
      "Não. O atendimento já está registrado no nosso canal. Basta voltar à conversa no WhatsApp; refazer a triagem só duplica o chamado.",
  },
  {
    question: "Como acompanho o andamento do serviço?",
    answer:
      "Pela página de status da ordem de serviço, usando o número de protocolo e o celular informado no atendimento.",
  },
];

function parseModality(value: string | null): Modality {
  if (value && value in MODALITIES) return value as Modality;
  return "orcamento";
}

const Obrigado = () => {
  const [params] = useSearchParams();
  const modality = parseModality(params.get("modalidade"));
  const origem = params.get("origem")?.replace(/[^a-z0-9\-/_]/gi, "").slice(0, 60) ?? "";
  const data = MODALITIES[modality];
  const Icon = data.icon;

  const description = useMemo(
    () =>
      `Solicitação enviada (${data.label.toLowerCase()}). Veja os próximos passos, prazos e as regras de orçamento pré-aprovado do atendimento técnico em Curitiba e região.`,
    [data.label],
  );

  return (
    <Layout>
      <SEOHead
        title="Obrigado! Recebemos sua solicitação | Preciso de Um Técnico"
        description={description}
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Obrigado", url: CANONICAL },
        ]}
        faq={FAQ}
      />

      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <Icon className="h-4 w-4" aria-hidden="true" />
            {data.label}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {data.headline}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">{data.body}</p>
          {origem ? (
            <p className="mt-3 text-xs text-muted-foreground" data-testid="obrigado-origem">
              Origem do atendimento: {origem}
            </p>
          ) : null}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Próximos passos</h2>
            <ul className="space-y-3">
              {data.next.map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground/85">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-accent/30 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-bold text-foreground">Prazo e fila técnica</h2>
            </div>
            <p className="text-sm text-foreground/85">{COMMERCIAL_TERMS.minimumQueueText}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Perguntas frequentes</h2>
            <dl className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.question} className="rounded-lg border border-border p-4">
                  <dt className="font-semibold text-foreground mb-1">{f.question}</dt>
                  <dd className="text-sm text-foreground/85">{f.answer}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/status-os"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground"
            >
              Consultar status da ordem
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/termos-orcamento-pre-aprovado"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-semibold text-foreground"
            >
              Ler os termos completos
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Obrigado;
