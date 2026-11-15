/**
 * Catálogo inicial de sintomas para Curitiba.
 * Alimenta:
 *  - SymptomFAQ (JSON-LD FAQPage)
 *  - TriageWizard (Fase B): pré-classificação automática
 *  - Hubs /sintomas/:slug (Fase C)
 *
 * Cada sintoma tem regra técnica que o TriageWizard irá ler:
 *  - mode: 'bancada' | 'visita' | 'coleta'
 *  - ticketMin/ticketMax: pré-orçamento em R$
 *  - slaMinDays/slaMaxDays: prazo realista
 *  - mediaRequired: foto/vídeo obrigatório
 */
export type ServiceMode = "bancada" | "visita" | "coleta";

export interface Symptom {
  slug: string;
  category: "tv" | "celular" | "console" | "notebook" | "pc" | "som";
  label: string;
  shortDescription: string;
  faq: { q: string; a: string }[];
  triage: {
    mode: ServiceMode;
    ticketMin: number;
    ticketMax: number;
    slaMinDays: number;
    slaMaxDays: number;
    mediaRequired: boolean;
  };
}

export const SYMPTOMS: Symptom[] = [
  {
    slug: "tv-nao-liga-led-pisca",
    category: "tv",
    label: "TV não liga e LED fica piscando",
    shortDescription:
      "LED de stand-by piscando indica, na maioria dos casos, falha na fonte ou na placa principal (T-CON).",
    faq: [
      { q: "TV com LED piscando tem conserto?", a: "Sim. Na maioria dos modelos LED/QLED é falha na fonte ou capacitores. O conserto é em bancada, com coleta e devolução." },
      { q: "Quanto custa consertar TV que não liga em Curitiba?", a: "A faixa real é de R$ 300 a R$ 500 para troca de fonte e R$ 450 a R$ 900 para placa principal. Diagnóstico + coleta R$ 99,99, abatido se aprovar." },
      { q: "Quanto tempo demora o reparo?", a: "Entre 15 e 60 dias, conforme disponibilidade da peça. SLA realista, sem promessa furada." },
    ],
    triage: { mode: "coleta", ticketMin: 300, ticketMax: 900, slaMinDays: 15, slaMaxDays: 60, mediaRequired: true },
  },
  {
    slug: "celular-tela-quebrada",
    category: "celular",
    label: "Celular com tela trincada",
    shortDescription: "Troca de display original ou nacional, com garantia.",
    faq: [
      { q: "Vocês trocam tela na hora?", a: "Sim, para a maioria dos modelos populares. Modelos premium (iPhone, Galaxy S/Note) podem levar 1 a 3 dias se a peça precisar ser solicitada." },
      { q: "Tem garantia?", a: "90 dias para defeito de peça, conforme CDC." },
    ],
    triage: { mode: "bancada", ticketMin: 250, ticketMax: 1800, slaMinDays: 0, slaMaxDays: 3, mediaRequired: true },
  },
  {
    slug: "ps5-ejetando-disco-sozinho",
    category: "console",
    label: "PS5 ejetando o disco sozinho",
    shortDescription: "Falha clássica do sensor do leitor de disco — reparo em bancada.",
    faq: [
      { q: "Tem conserto sem perder garantia da Sony?", a: "Se o aparelho ainda estiver na garantia oficial, recomendamos acionar a Sony. Fora da garantia, fazemos o reparo em bancada." },
      { q: "Quanto custa?", a: "Entre R$ 350 e R$ 600 conforme o componente afetado." },
    ],
    triage: { mode: "bancada", ticketMin: 350, ticketMax: 600, slaMinDays: 3, slaMaxDays: 10, mediaRequired: false },
  },
  {
    slug: "notebook-nao-liga",
    category: "notebook",
    label: "Notebook não liga",
    shortDescription: "Pode ser fonte, bateria, BIOS ou chip de alimentação na placa.",
    faq: [
      { q: "Vale a pena consertar notebook antigo?", a: "Avaliamos sem compromisso. Se o orçamento passar de 60% do valor de mercado, indicamos não reparar." },
      { q: "Faz a domicílio?", a: "Inspeção inicial em visita (R$ 99,99). Reparo de placa é sempre em bancada." },
    ],
    triage: { mode: "visita", ticketMin: 150, ticketMax: 1200, slaMinDays: 1, slaMaxDays: 15, mediaRequired: false },
  },
  {
    slug: "tv-tela-quebrada",
    category: "tv",
    label: "TV com tela quebrada, trincada ou com manchas",
    shortDescription:
      "Painel LCD/LED danificado, imagem com rachaduras, listras ou manchas escuras — em muitos modelos, trocar o painel custa mais do que uma TV nova equivalente.",
    faq: [
      { q: "Vale a pena trocar a tela da minha TV?", a: "Nem sempre. Painéis novos de TVs de 43\" a 55\" custam entre R$ 1.800 e R$ 4.500, muitas vezes mais do que uma TV nova equivalente. Fazemos o diagnóstico e avaliação de viabilidade antes de qualquer serviço." },
      { q: "Como funciona a coleta para troca de tela em Curitiba?", a: "Coleta e devolução em Curitiba e Região Metropolitana. Taxa mínima de R$ 299,99, abatida do orçamento se aprovado. O prazo médio é 15 a 45 dias, dependendo da disponibilidade do painel." },
      { q: "Vocês têm painel de todos os tamanhos e marcas?", a: "Trabalhamos com Samsung, LG, Sony, TCL, Philco, Philips, AOC e Semp. Painéis de 32\", 40\", 43\", 50\", 55\", 65\" — sob consulta e conforme disponibilidade do fornecedor." },
      { q: "O que devo preparar antes da coleta?", a: "Retire a TV do suporte de parede, separe controle remoto, cabo de força e base (se tiver). Fotografe a etiqueta traseira (modelo + serial) e envie na triagem — acelera a cotação do painel em até 48h." },
      { q: "Quais sinais indicam que o painel está mesmo quebrado?", a: "Rachaduras visíveis, manchas escuras que crescem, listras verticais fixas, metade da tela apagada ou pontos coloridos que não somem em telas de teste. Se a imagem 'volta' ao dar batidas, ainda é painel — apenas com mau contato." },
      { q: "Como vocês definem o orçamento antes de eu decidir?", a: "Após a coleta, testamos o painel em bancada. Você recebe um orçamento fechado por escrito com preço da peça, mão de obra e prazo. Só executamos se aprovar; se recusar, a taxa de R$ 299,99 cobre a logística e o diagnóstico." },
    ],
    triage: { mode: "coleta", ticketMin: 1800, ticketMax: 4500, slaMinDays: 15, slaMaxDays: 45, mediaRequired: true },
  },
  {
    slug: "tv-smart-travando-apps",
    category: "tv",
    label: "TV Smart lenta, travando ou com apps que não abrem",
    shortDescription:
      "Sistema operacional travando, Netflix/YouTube/Prime que não abrem, TV que reinicia sozinha, controle remoto sem resposta ou atualização de firmware travada.",
    faq: [
      { q: "Quanto custa consertar Smart TV em Curitiba?", a: "Reparos de software (reset, reinstalação de firmware, apps travando) partem de R$ 250. Troca de placa principal ou de Wi-Fi fica entre R$ 450 e R$ 900. Diagnóstico + coleta R$ 299,99, abatido se aprovar." },
      { q: "Preciso levar a TV até vocês?", a: "Sim. Reparos de Smart TV são feitos em bancada com equipamento calibrado. Fazemos coleta e devolução em Curitiba e Região Metropolitana." },
      { q: "Vale a pena consertar Smart TV antiga?", a: "Se a TV tiver mais de 6 anos e o orçamento passar de 60% do valor de mercado, avisamos honestamente que não compensa. O diagnóstico é sempre feito antes do orçamento fechado." },
      { q: "O que tentar antes de acionar o técnico?", a: "Desligue da tomada por 2 minutos (reset físico), limpe cache de apps em Configurações → Aplicativos, e teste a internet em outro aparelho. Se o problema persistir em modo de segurança ou após reset de fábrica, é hardware." },
      { q: "Como saber se é a TV ou o app (Netflix, YouTube)?", a: "Se vários apps travam ao mesmo tempo, é firmware ou memória da TV. Se só um app falha, geralmente é atualização pendente. Envie na triagem o modelo + qual app trava — usamos isso para pré-classificar o reparo." },
      { q: "Vocês orçam a placa antes de trocar?", a: "Sim. Após bancada, cotamos a placa principal com o distribuidor autorizado e enviamos orçamento fechado. Nada é trocado sem aprovação por escrito." },
    ],
    triage: { mode: "coleta", ticketMin: 250, ticketMax: 900, slaMinDays: 5, slaMaxDays: 20, mediaRequired: true },
  },
  {
    slug: "wifi-lento-instavel",
    category: "pc",
    label: "Wi-Fi lento, caindo ou sem sinal em partes da casa",
    shortDescription:
      "Configuração e troubleshooting de rede Wi-Fi: roteador novo, mudança de senha, mesh, análise de canais, cobertura por cômodo e integração com dispositivos (TV, câmeras, impressora).",
    faq: [
      { q: "Quanto custa configurar Wi-Fi em Curitiba?", a: "Visita técnica a partir de R$ 99,99 para diagnóstico e configuração básica de roteador. Instalação de mesh, cabeamento leve ou reconfiguração completa de rede é orçada na visita, tipicamente entre R$ 150 e R$ 450." },
      { q: "Vocês vão até minha casa?", a: "Sim, atendemos em domicílio em Curitiba e Região Metropolitana. Toda visita começa pela triagem online — você recebe janela de atendimento e o WhatsApp do técnico após a classificação." },
      { q: "Meu Wi-Fi cai em um cômodo específico. Precisa trocar de roteador?", a: "Nem sempre. Muitas vezes é reposicionamento, mudança de canal ou instalação de um repetidor/mesh no ponto certo. Avaliamos na visita e só recomendamos troca se realmente for necessário." },
      { q: "Configuram câmera, impressora e TV na mesma rede?", a: "Sim. A visita inclui configuração dos dispositivos que estiverem no local: TV, câmeras IP, impressoras Wi-Fi, campainhas inteligentes e assistentes de voz." },
      { q: "O que fazer antes da visita para agilizar?", a: "Anote o modelo do roteador e da operadora, teste a velocidade em fastcom-tipo em 2 cômodos diferentes (com e sem sinal ruim), tenha as senhas de Wi-Fi anteriores em mãos e deixe o técnico ter acesso físico ao roteador principal." },
      { q: "Como identificar se o problema é da operadora ou da minha rede?", a: "Conecte um notebook direto no cabo do modem por rede cabeada. Se a velocidade bater com o plano contratado, o gargalo é o Wi-Fi (roteador, canal, cobertura). Se estiver ruim no cabo, o problema é da operadora e a visita não resolve." },
      { q: "Quando o orçamento inclui mesh e quando basta ajuste?", a: "Se a casa tem menos de 80 m² e um andar, quase sempre resolvemos com reposicionamento e ajuste de canal (R$ 99,99). Acima disso, ou com paredes de concreto entre cômodos, o mesh (R$ 300–R$ 450) costuma ser a única solução estável." },
      { q: "Vocês consertam impressora?", a: "Não fazemos reparo mecânico ou eletrônico de impressoras: nada de troca de engrenagem, cabeça de impressão, placa lógica ou limpeza interna de hardware. Tratamos a impressora apenas como dispositivo em rede — conexão ao Wi-Fi, endereço IP fixo, descoberta pelos computadores, driver oficial e fila de impressão." },
      { q: "A impressora sumiu depois que troquei o roteador. Isso vocês resolvem?", a: "Sim, esse caso é de rede. Reconectamos o equipamento ao SSID correto, fixamos o endereço IP para ele não mudar a cada reinício e reconfiguramos os computadores que imprimem nela. Se o equipamento não ligar ou apresentar erro de hardware no painel, o caso é da assistência do fabricante." },
      { q: "Dá para deixar a impressora compartilhada entre todos os computadores?", a: "Sim, quando o modelo suporta rede (Wi-Fi ou cabo). Configuramos o compartilhamento, instalamos o driver oficial do fabricante em cada máquina e testamos uma impressão em todas. Modelos apenas USB só funcionam compartilhados a partir de um computador ligado." },
      { q: "E scanner, câmera IP e outros periféricos em rede?", a: "Configuramos digitalização em rede nos modelos que oferecem o recurso de fábrica, além de câmeras IP, TVs, campainhas e assistentes de voz — sempre no escopo de conectividade e comunicação na rede. Defeito físico do periférico não é coberto nesta visita." },
    ],
    triage: { mode: "visita", ticketMin: 99.99, ticketMax: 450, slaMinDays: 0, slaMaxDays: 3, mediaRequired: false },
  },
];


export function getSymptomBySlug(slug: string): Symptom | undefined {
  return SYMPTOMS.find((s) => s.slug === slug);
}
