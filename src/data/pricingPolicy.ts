/**
 * Fonte única de política de preços, prazos e condições comerciais.
 * Todos os componentes que exibem valores/prazos devem importar daqui.
 * Alterar aqui reflete no site inteiro sem risco de divergência.
 */

const visitPriceLabel = "R$ 99,99";
const visitDurationMinutes = 20;
const visitToleranceMinutes = 30;
const visitTimeLabel = `até ${visitDurationMinutes} minutos de inspeção, com tolerância até ${visitToleranceMinutes} minutos no total`;

export const PRICING = {
  /** Diagnóstico em bancada — cliente entrega/retira em nosso endereço */
  benchDiagnosis: {
    label: "Diagnóstico em bancada (até 30 min)",
    priceBRL: 99.99,
    priceLabel: "R$ 99,99",
    description:
      "Diagnóstico em bancada, até 30 minutos, no nosso endereço. Valor abatido em caso de fechamento.",
  },
  technicalVisit: {
    label: "Visita técnica de inspeção",
    priceBRL: 99.99,
    priceLabel: visitPriceLabel,
    startingPriceLabel: `A partir de ${visitPriceLabel}`,
    minPriceBRL: 99.99,
    durationMinutes: visitDurationMinutes,
    timeLabel: visitTimeLabel,
    description:
      `Visita técnica a partir de ${visitPriceLabel}: ${visitTimeLabel}. A tolerância faz parte da mesma visita. O valor é confirmado antes do agendamento e abatido se você aprovar o serviço. A inspeção inclui avaliação no local e ajustes simples quando couberem. Serviços adicionais exigem aprovação prévia.`,
  },

  demandService: {
    description:
      "A estimativa usual é de R$ 299,99 por demanda. Confirmamos o valor e o escopo antes de começar ou, quando o trabalho for contratado por tempo, o limite de até 1 hora. A execução cobre o que for tecnicamente compatível com o combinado. Peças, trabalho fora do escopo e tempo adicional exigem nova aprovação.",
  },

  /** Coleta e entrega personalizada até 2h no endereço — valor mínimo pré-aprovado */
  pickupDelivery: {
    label: "Coleta e entrega personalizada",
    priceBRL: 299.99,
    minPriceBRL: 299.99,
    priceLabel: "A partir de R$ 299,99",
    description:
      "Atendimento personalizado com coleta e entrega no endereço (até 2h). Valor mínimo pré-aprovado de R$ 299,99 — pode variar conforme distância, equipamento e complexidade.",
  },
} as const;

export const SLA = {
  /** Prazo mínimo em horas úteis para conclusão do atendimento */
  minBusinessHours: 72,
  minLabel: "3 dias úteis ou 72 horas úteis",
  /** Prazo mínimo quando há necessidade de encomenda de peças */
  minWithPartsLabel: "15 dias úteis",
  /** Prazo máximo estimado (faixa) */
  maxLabel: "3 semanas a 60 dias",
  disclaimer:
    "Termos, condições, valores e prazos são 4 parâmetros que variam conforme a situação: fila técnica, encomenda de peças, triagem interna do equipamento, complexidade e logística.",
} as const;

export const COMMERCIAL = {
  installments: "Aceitamos em até 12x sem juros",
  experienceYears: 25,
  experienceLabel: "Mais de 25 anos de experiência",
  partnersLabel: "+5.000 parcerias no Brasil",
  partnersDisclaimer:
    "Parceiros podem praticar termos, condições, valores e prazos diferentes. Não somos responsáveis pelo tratamento direto com o parceiro.",
  triageRequirement:
    "Termos, condições, valores e prazos válidos somente com triagem completa e coleta/entrega diretamente com nossa central. Preenchimento obrigatório do formulário online com fotos e vídeos para iniciar o atendimento — sem cadastro, sem fotos e/ou vídeos prévios não é realizado o atendimento.",
} as const;

export const WHATSAPP = {
  /** Rótulo genérico usado em botões (número não deve aparecer) */
  ctaLabel: "WhatsApp 24h",
} as const;
