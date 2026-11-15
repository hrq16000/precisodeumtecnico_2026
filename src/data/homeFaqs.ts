/**
 * Rodada 25.1 — Bloco 0.
 * Fonte única das FAQs da home. Consumida pela seção visível
 * (components/home/FAQSection.tsx) e pelo schema FAQPage (pages/Index.tsx),
 * eliminando o risco de divergência UI ↔ schema.
 */

import { PRICING } from "./pricingPolicy";
import { COMMERCIAL_TERMS } from "./commercialTerms";

export interface HomeFaq { question: string; answer: string }

export const homeFaqs: HomeFaq[] = [
  {
    question: "Qual o valor da visita técnica?",
    answer: PRICING.technicalVisit.description,
  },
  {
    question: "Vocês atendem em domicílio?",
    answer:
      "Sim! Nossos técnicos vão até você em Curitiba e toda a Região Metropolitana. Atendemos residências, empresas, escritórios e comércios. Basta agendar pelo WhatsApp ou telefone.",
  },
  {
    question: "Qual a forma de pagamento?",
    answer:
      "Aceitamos dinheiro, PIX, cartão de débito e crédito (em até 12x). O pagamento é feito somente após a conclusão e aprovação do serviço.",
  },
  {
    question: "Vocês dão garantia nos serviços?",
    answer:
      "Sim! Todos os nossos serviços têm garantia de até 1 ano, dependendo do tipo de reparo. Em peças originais, a garantia é de 90 dias a 1 ano. Fornecemos nota fiscal e termo de garantia.",
  },
  {
    question: "Quanto tempo leva para fazer o reparo?",
    answer:
      "A maioria dos reparos é concluída no mesmo dia, em até 2 horas. Problemas mais complexos podem levar de 1 a 3 dias úteis. Informamos o prazo exato no momento do diagnóstico.",
  },
  {
    question: "Vocês atendem empresas?",
    answer:
      "Sim! Temos planos especiais para empresas, com contratos de manutenção, atendimento prioritário e condições diferenciadas. Entre em contato para uma proposta personalizada.",
  },
  {
    question: "Atendem aos finais de semana e feriados?",
    answer:
      "Sim, atendemos de segunda a domingo, das 08h às 22h, incluindo feriados. Para emergências fora do horário, consulte disponibilidade pelo WhatsApp.",
  },
  {
    question: "Como faço para agendar um técnico?",
    answer:
      "É simples! Basta clicar no botão de WhatsApp ou ligar para WhatsApp 24h. Informe o problema e sua localização, e agendaremos o técnico mais próximo de você.",
  },
];
