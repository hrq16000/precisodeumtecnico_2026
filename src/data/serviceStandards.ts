/**
 * Rodada 34 — Ficha padrão obrigatória das páginas de serviço.
 *
 * Fonte única dos campos que TODAS as páginas de serviço curadas devem exibir:
 * valor inicial, tempo estimado, o que está incluso/não incluso, acréscimos,
 * observações, limitações e o gancho de agendamento (triagem).
 *
 * Regras (fail-closed):
 *  - O valor inicial NUNCA é inventado aqui: vem de PRICING.technicalVisit.
 *  - O prazo de execução vem de SLA (nada de prazo específico por serviço).
 *  - Um serviço sem ficha completa quebra o gate scripts/check-service-standards.ts.
 */
import { PRICING, SLA } from "./pricingPolicy";

export interface ServiceStandard {
  slug: string;
  /** Valor inicial cobrado para abrir o atendimento (visita/diagnóstico). */
  startingPriceBRL: number;
  startingPriceLabel: string;
  startingPriceNote: string;
  /** Duração do bloco inicial de diagnóstico. */
  diagnosisDurationLabel: string;
  /** Prazo de execução após aprovação (política única). */
  executionSlaLabel: string;
  included: string[];
  notIncluded: string[];
  surcharges: string[];
  notes: string[];
  limitations: string[];
  scheduling: { label: string; description: string; source: string; category?: string };
}

const BASE = {
  startingPriceBRL: PRICING.technicalVisit.priceBRL,
  startingPriceLabel: PRICING.technicalVisit.priceLabel,
  startingPriceNote: PRICING.technicalVisit.description,
  diagnosisDurationLabel: `até ${PRICING.technicalVisit.durationMinutes} minutos de inspeção`,
  executionSlaLabel: SLA.minLabel,
} as const;

const COMMON_SURCHARGES = [
  "Trabalho fora da inspeção mediante orçamento e aprovação.",
  "Peças, componentes e materiais, orçados à parte e só após aprovação.",
  `Coleta e entrega personalizada no endereço: ${PRICING.pickupDelivery.priceLabel}.`,
  "Deslocamento fora de Curitiba e Região Metropolitana, conforme distância.",
];

const COMMON_NOTES = [
  "Orçamento de execução só é fechado após o diagnóstico presencial.",
  "Atendimento iniciado apenas com triagem preenchida (fotos/vídeos do equipamento).",
  SLA.disclaimer,
];

const COMMON_NOT_INCLUDED = [
  "Peças de reposição e licenças de software.",
  "Serviços de terceiros (operadora, fabricante, garantia de fábrica).",
  "Obras civis, alvenaria e infraestrutura elétrica nova.",
];

export const SERVICE_STANDARDS: Record<string, ServiceStandard> = {
  "formatacao-computadores": {
    slug: "formatacao-computadores",
    ...BASE,
    included: [
      "Diagnóstico do equipamento e checagem de disco e memória.",
      "Backup dos arquivos do usuário antes da formatação.",
      "Instalação limpa do sistema operacional e drivers oficiais.",
      "Instalação de navegador, utilitários básicos e antivírus.",
      "Restauração dos dados do backup e teste final com o cliente.",
    ],
    notIncluded: [
      ...COMMON_NOT_INCLUDED,
      "Recuperação de dados de disco danificado (serviço específico).",
    ],
    surcharges: [
      ...COMMON_SURCHARGES,
      "Mídia externa para backup, quando o cliente não dispõe de uma.",
    ],
    notes: COMMON_NOTES,
    limitations: [
      "Discos com falha física podem inviabilizar backup — avaliado no diagnóstico.",
      "Licenças de sistema e Office são de responsabilidade do cliente.",
    ],
    scheduling: {
      label: "Agendar formatação com triagem",
      description: "Envie modelo, sintomas e fotos na triagem para receber a estimativa antes da visita.",
      source: "service-standard:formatacao-computadores",
      category: "pc",
    },
  },
  "instalacao-cameras": {
    slug: "instalacao-cameras",
    ...BASE,
    included: [
      "Levantamento dos pontos de instalação e checagem de infraestrutura.",
      "Fixação das câmeras e passagem de cabo em infraestrutura existente.",
      "Configuração de DVR/NVR, gravação e acesso remoto pelo celular.",
      "Testes de imagem diurna e noturna com o cliente presente.",
    ],
    notIncluded: [...COMMON_NOT_INCLUDED, "Fornecimento de câmeras, DVR/NVR, HD e cabos."],
    surcharges: [
      ...COMMON_SURCHARGES,
      "Instalação em altura com necessidade de escada/andaime extra.",
      "Nova infraestrutura de cabeamento ou conduítes.",
    ],
    notes: COMMON_NOTES,
    limitations: [
      "Qualidade de acesso remoto depende da internet do local.",
      "Não realizamos obra civil para passagem de cabos.",
    ],
    scheduling: {
      label: "Agendar visita de CFTV",
      description: "Informe quantidade de pontos e envie fotos do local na triagem.",
      source: "service-standard:instalacao-cameras",
    },
  },
  "instalacao-ar-condicionado": {
    slug: "instalacao-ar-condicionado",
    ...BASE,
    included: [
      "Avaliação do ponto de instalação e da capacidade do circuito.",
      "Fixação de suportes, unidade interna e unidade externa.",
      "Interligação frigorígena, vácuo e teste de estanqueidade.",
      "Teste de funcionamento e orientação de uso ao cliente.",
    ],
    notIncluded: [
      ...COMMON_NOT_INCLUDED,
      "Fornecimento do aparelho, suportes e tubulação.",
      "Criação de circuito elétrico dedicado.",
    ],
    surcharges: [
      ...COMMON_SURCHARGES,
      "Metragem adicional de tubulação além do kit padrão.",
      "Instalação em fachada com necessidade de acesso especial.",
    ],
    notes: COMMON_NOTES,
    limitations: [
      "Modelos acima de 12.000 BTUs podem exigir circuito dedicado por conta do cliente.",
      "Não emitimos laudo de garantia de fábrica do equipamento.",
    ],
    scheduling: {
      label: "Agendar instalação de ar-condicionado",
      description: "Envie o modelo do aparelho e fotos do local de instalação na triagem.",
      source: "service-standard:instalacao-ar-condicionado",
    },
  },
  "pc-gamer": {
    slug: "pc-gamer",
    ...BASE,
    included: [
      "Conferência das peças recebidas e checagem de compatibilidade.",
      "Montagem, cable management e instalação do sistema.",
      "Atualização de BIOS/drivers e testes de temperatura e estabilidade.",
      "Entrega com checklist de testes assinado.",
    ],
    notIncluded: [
      ...COMMON_NOT_INCLUDED,
      "Garantia sobre peças fornecidas pelo cliente (garantia é do fabricante).",
      "Overclock fora de especificação do fabricante.",
    ],
    surcharges: [
      ...COMMON_SURCHARGES,
      "Refrigeração líquida custom e retrabalho por peça incompatível.",
    ],
    notes: COMMON_NOTES,
    limitations: [
      "Peças do cliente seguem a política de peças publicada no site.",
      "Montagem não inicia sem checklist e aceite dos termos.",
    ],
    scheduling: {
      label: "Agendar montagem com triagem",
      description: "Liste as peças e envie fotos na triagem para receber a estimativa.",
      source: "service-standard:pc-gamer",
      category: "pc",
    },
  },
};

export function getServiceStandard(slug?: string): ServiceStandard | null {
  if (!slug) return null;
  return SERVICE_STANDARDS[slug] ?? null;
}
