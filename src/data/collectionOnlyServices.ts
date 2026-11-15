/**
 * Serviços atendidos EXCLUSIVAMENTE com coleta (não há balcão de atendimento
 * ao público). Fonte única para o aviso exibido nas páginas de serviço.
 *
 * Valores derivam de COMMERCIAL_TERMS / PRICING — nunca literais soltos.
 */
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";
import { PRICING } from "@/data/pricingPolicy";

export const COLLECTION_ONLY_SLUGS = [
  "games",
  "celulares",
  "tvs",
  "macbook",
] as const;

export const isCollectionOnlyService = (slug?: string): boolean =>
  !!slug && (COLLECTION_ONLY_SLUGS as readonly string[]).includes(slug);

export const COLLECTION_ONLY_POLICY = {
  headline: "Atendimento exclusivamente com coleta",
  summary:
    "Videogames, consoles, controles, tablets e equipamentos similares são atendidos apenas com coleta e entrega no endereço do cliente. Não temos balcão de atendimento ao público e não recebemos equipamento sem triagem prévia.",
  bullets: [
    `Coleta e entrega personalizada: valor mínimo pré-aprovado de ${COMMERCIAL_TERMS.preApprovedBudget.minLabel}, sem incluir peças, componentes ou materiais adicionais.`,
    `Diagnóstico em bancada: ${COMMERCIAL_TERMS.diagnosisFee.priceLabel}. Visita de inspeção de até 20 minutos: R$ 99,99.`,
    COMMERCIAL_TERMS.cancellationText,
    COMMERCIAL_TERMS.minimumQueueText,
    PRICING.pickupDelivery.description,
  ] as const,
  faq: [
    {
      question: "Posso levar meu videogame ou tablet no balcão?",
      answer:
        "Não. Não temos balcão de atendimento ao público. O atendimento desses equipamentos é feito exclusivamente com coleta e entrega no endereço informado na triagem.",
    },
    {
      question: "Quanto custa o atendimento com coleta?",
      answer: COMMERCIAL_TERMS.preApprovedPolicyText,
    },
    {
      question: "E se eu quiser só o diagnóstico?",
      answer: `O diagnóstico em bancada custa ${COMMERCIAL_TERMS.diagnosisFee.priceLabel}. A visita de inspeção dura até 20 minutos e custa R$ 99,99. ${COMMERCIAL_TERMS.cancellationText}`,
    },
  ] as const,
} as const;
