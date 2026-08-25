/**
 * Fonte única dos termos operacionais exibidos na abertura de Ordem de Serviço.
 * Valores monetários derivam de pricingPolicy/commercialTerms (fonte única).
 */
import { PRICING } from "@/data/pricingPolicy";
import { COMMERCIAL_TERMS } from "@/data/commercialTerms";

export interface TermGroup {
  id: string;
  title: string;
  items: string[];
}

export const VISIT_TERMS: TermGroup[] = [
  {
    id: "escopo",
    title: "Escopo e valor da visita técnica",
    items: [
      `Visita válida para serviços rápidos (até 30 minutos), montagem ou inspeção presencial para orçamento. Valor: ${PRICING.technicalVisit.priceLabel} por bloco de até 30 minutos.`,
      "Para reparo rápido ou upgrade, o equipamento precisa estar FUNCIONANDO (ligando e montado) no momento da visita.",
      "Não existe garantia de solução imediata para defeitos que não podem ser diagnosticados pelo WhatsApp: a visita serve para inspeção visual e tátil.",
      "Se a inspeção indicar necessidade de laboratório, o atendimento migra para coleta, com termos próprios.",
    ],
  },
  {
    id: "logistica",
    title: "Custos logísticos",
    items: [
      "O estacionamento é de responsabilidade do cliente: é necessário disponibilizar vaga no local ou reembolsar o profissional pelo valor pago.",
      "Deslocamentos extras, pedágios ou taxas de acesso ao condomínio seguem a mesma regra de reembolso.",
    ],
  },
  {
    id: "seguranca",
    title: "Protocolo de segurança (obrigatório)",
    items: [
      "Foco total durante o atendimento: sem diálogos ou perguntas enquanto o técnico trabalha. Toda dúvida deve ser esclarecida antes do agendamento.",
      "Crianças e animais (especialmente cães) devem manter distância segura do técnico, das ferramentas e da bancada de trabalho.",
      "Proibido fumo, fumantes ou odores fortes no interior do imóvel e na área coberta do atendimento.",
      "Proibido barulho excessivo durante o serviço (TV, rádio, caixa de som ou celular em volume alto).",
      "O descumprimento do protocolo permite a interrupção do atendimento, com cobrança do bloco já iniciado.",
    ],
  },
];

export const COLLECTION_TERMS: TermGroup[] = [
  {
    id: "valores",
    title: "Taxas e valores mínimos",
    items: [
      `Valor mínimo pré-aprovado: ${COMMERCIAL_TERMS.preApprovedBudget.minLabel}, com garantia de 90 dias sobre o reparo concluído.`,
      `Pagamento inicial de diagnóstico: ${COMMERCIAL_TERMS.diagnosisFee.priceLabel}. Se o serviço for aprovado, esse valor é abatido do total. Se não houver solução possível, o valor cobre a tentativa técnica e o diagnóstico.`,
      "Peças, componentes, materiais e itens adicionais não estão inclusos e são informados separadamente, sempre com aprovação prévia.",
      "Pagamento por PIX: a chave oficial (e-mail ou celular da empresa) é enviada pela central no WhatsApp junto com a confirmação da O.S.",
    ],
  },
  {
    id: "prazos",
    title: "Prazos",
    items: [
      "Logística (coleta, triagem e movimentação): de 2 a 90 dias úteis.",
      "Reparo: de 15 a 45 dias úteis após a aprovação do orçamento.",
      "Desistência sem custo adicional: válida somente se manifestada em até 24 horas após a coleta.",
    ],
  },
  {
    id: "processos",
    title: "Processos inclusos no reparo de circuito",
    items: [
      "Banho químico da placa.",
      "Limpeza completa interna do equipamento.",
      "Troca de pasta térmica de alta performance (12.8 w/mk).",
      "Peças e componentes não estão inclusos nesses processos.",
    ],
  },
  {
    id: "risco",
    title: "Aviso de risco — reballing",
    items: [
      "O reballing é executado em estação Honton R690, que trabalha com altas temperaturas.",
      "Em razão do estado prévio da placa (oxidação, reparos anteriores, trincas ou umidade), podem ocorrer danos irreversíveis durante o procedimento.",
      "A autorização do reballing implica ciência e aceite desse risco.",
    ],
  },
  {
    id: "extras",
    title: "Taxas extras, cancelamento e abandono",
    items: [
      "Taxa de tentativa de reparo: cobrada à vista quando o processo não resolve ou altera o defeito, cobrindo insumos e tempo técnico.",
      `Desistência ou cancelamento após a aprovação, ou após 24 horas da coleta: a taxa devida é o valor mínimo pré-aprovado (${COMMERCIAL_TERMS.preApprovedBudget.minLabel}).`,
      "Orçamento não aprovado ou cancelamento: a retirada do equipamento fica a cargo do cliente — não realizamos entrega de devolução nessas condições.",
      "Abandono: equipamentos não retirados em até 90 dias após o aviso (WhatsApp, mensagem ou ligação) serão reciclados.",
    ],
  },
];
