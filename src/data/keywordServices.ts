/**
 * Rodada 28.1 — Páginas dedicadas por serviço, uma keyword-alvo por rota.
 *
 * Fonte única de conteúdo das landing pages de serviço otimizadas para
 * busca local. Cada entrada gera H1 único, intro com a keyword no primeiro
 * parágrafo, seções H2/H3, FAQ própria, tabela comparativa, imagem com alt
 * descritivo e schema Service + FAQPage + BreadcrumbList.
 *
 * Regras:
 *  - Preço sempre derivado de src/data/pricingPolicy.ts (sem valores soltos).
 *  - Meta description SEMPRE começa com verbo de ação.
 *  - Nenhum link interno para rota inexistente (validado em e2e).
 */
import { PRICING } from "@/data/pricingPolicy";

export interface KeywordFAQ {
  question: string;
  answer: string;
}

export interface CompareRow {
  aspect: string;
  before: string;
  after: string;
}

export interface KeywordServicePage {
  /** Slug da rota (sem barra). */
  slug: string;
  /** Keyword-alvo principal. */
  keyword: string;
  /** H1 único da página. */
  h1: string;
  /** <title> (inclui cidade e preço quando aplicável). */
  title: string;
  /** Meta description — começa com verbo de ação. */
  description: string;
  /** Primeiro parágrafo, contém a keyword-alvo. */
  intro: string;
  /** Cidade principal da página ("Curitiba" ou "Brasil" para remoto). */
  city: string;
  /** Categoria de triagem pré-classificada (data-triage-*). */
  triageCategory: string;
  triageSymptom?: string;
  image: { src: string; alt: string };
  whatIs: string[];
  whenYouNeed: string[];
  howWeDo: { title: string; description: string }[];
  averageTime: string;
  priceFrom: string;
  priceNote: string;
  warranty: string;
  compare: CompareRow[];
  faq: KeywordFAQ[];
  /** Links internos para outros serviços do portal (rotas reais). */
  relatedServices: { label: string; to: string }[];
  /** Trilhas/contextos atendidos por tipo de empresa (hub empresarial). */
  businessTracks?: { title: string; description: string; includes: string[] }[];
  /** Modelos de contratação: avulso x recorrente. */
  engagementModels?: { name: string; howItWorks: string; includes: string[] }[];
  /** Limites explícitos de escopo — o que não fazemos. */
  scopeLimits?: string[];
}

const BENCH = PRICING.benchDiagnosis.priceLabel; // R$ 99,99
const VISIT = PRICING.technicalVisit.priceLabel;
const WARRANTY = "90 dias de garantia na mão de obra, com nota fiscal (NFS-e).";

const CITY_LINKS = [
  { label: "Assistência técnica em Curitiba", to: "/assistencia-tecnica-curitiba" },
  { label: "Atendimento em São José dos Pinhais", to: "/regioes/sao-jose-dos-pinhais" },
  { label: "Atendimento em Pinhais", to: "/regioes/pinhais" },
  { label: "Atendimento em Colombo", to: "/regioes/colombo" },
];

export const CITY_INTERNAL_LINKS = CITY_LINKS;

export const KEYWORD_SERVICE_PAGES: KeywordServicePage[] = [
  {
    slug: "formatacao-de-computador-curitiba",
    keyword: "formatação de computador em Curitiba",
    h1: "Formatação de computador em Curitiba com backup e garantia",
    title: `Formatação de PC em Curitiba desde ${BENCH}`,
    description: `Formate seu computador em Curitiba a partir de ${BENCH}: backup dos arquivos, sistema licenciado, drivers atualizados e 90 dias de garantia.`,
    intro:
      "Se o PC demora minutos para ligar, trava no meio do trabalho ou vive com telas de erro, a formatação de computador em Curitiba resolve o problema pela raiz — desde que seja feita com backup verificado, sistema licenciado e drivers corretos. É exatamente esse o protocolo que aplicamos em bancada e em visita técnica na capital e na Região Metropolitana.",
    city: "Curitiba",
    triageCategory: "pc",
    triageSymptom: "pc-lento",
    image: {
      src: "/gallery/pc-formatacao.webp",
      alt: "Técnico em bancada com gabinete de computador aberto e monitor exibindo a instalação limpa do sistema operacional",
    },
    whatIs: [
      "Formatação é a reinstalação limpa do sistema operacional: o disco é preparado do zero, o Windows (ou Linux) é reinstalado, drivers oficiais são aplicados e os programas essenciais voltam configurados.",
      "Feita corretamente, elimina lentidão acumulada, conflitos de driver, resíduos de programas desinstalados e boa parte das infecções persistentes que um antivírus comum não remove.",
    ],
    whenYouNeed: [
      "O computador demora mais de 2 minutos para chegar à área de trabalho.",
      "Travamentos, telas azuis ou reinicializações sem motivo aparente.",
      "Programas abrindo sozinhos, propaganda no navegador ou página inicial trocada.",
      "Sistema muito antigo, sem atualização de segurança há anos.",
      "Você vai vender, doar ou repassar o equipamento e precisa apagar os dados com segurança.",
    ],
    howWeDo: [
      { title: "Triagem online", description: "Você descreve o sintoma pela triagem do site. Já identificamos se o caso é formatação, upgrade ou defeito de hardware antes de qualquer cobrança." },
      { title: "Backup verificado", description: "Copiamos documentos, fotos, favoritos e perfis. O backup é conferido item a item antes de qualquer formatação." },
      { title: "Instalação limpa", description: "Sistema reinstalado do zero, com licenciamento e todas as atualizações de segurança aplicadas." },
      { title: "Drivers e otimização", description: "Drivers oficiais do fabricante, ajuste de inicialização e desativação de serviços desnecessários." },
      { title: "Restauração e entrega", description: "Arquivos restaurados, contas reconfiguradas e testes de desempenho antes da devolução." },
    ],
    averageTime: "2 a 4 horas em bancada (com backup, até 1 dia útil quando há muitos dados).",
    priceFrom: BENCH,
    priceNote: `Diagnóstico em bancada por ${BENCH}, abatido no fechamento. Visita técnica a partir de ${VISIT} por até 20 minutos.`,
    warranty: WARRANTY,
    compare: [
      { aspect: "Tempo de inicialização", before: "2 a 5 minutos até abrir a área de trabalho", after: "15 a 30 segundos com SSD e sistema limpo" },
      { aspect: "Travamentos", before: "Diários, principalmente com o navegador aberto", after: "Uso contínuo sem congelamento" },
      { aspect: "Segurança", before: "Sistema sem atualização e com adware ativo", after: "Sistema atualizado, sem programas indesejados" },
      { aspect: "Seus arquivos", before: "Risco real de perda ao formatar por conta própria", after: "Backup conferido e restaurado item a item" },
    ],
    faq: [
      { question: `Quanto custa formatar um computador em Curitiba?`, answer: `O atendimento começa em ${BENCH}, referente ao diagnóstico em bancada — valor abatido caso o serviço seja fechado. O valor final da formatação é informado por escrito na triagem, antes de qualquer execução.` },
      { question: "Vou perder meus arquivos na formatação?", answer: "Não. O backup é feito e conferido antes da formatação. Documentos, fotos, favoritos e perfis de e-mail voltam para a máquina após a instalação limpa." },
      { question: "Quanto tempo demora a formatação?", answer: "Entre 2 e 4 horas em bancada. Quando o volume de dados é grande, o prazo pode chegar a 1 dia útil por causa do backup e da restauração." },
      { question: "A formatação resolve vírus?", answer: "Na maioria dos casos, sim — a instalação limpa remove infecções persistentes. Se o objetivo é preservar o sistema atual, a remoção de vírus é a alternativa indicada." },
      { question: "Vocês formatam na minha casa ou empresa?", answer: `Sim. A visita técnica em Curitiba e Região começa em ${VISIT} por até 20 minutos. Para formatação com backup extenso, a bancada costuma sair mais barata.` },
    ],
    relatedServices: [
      { label: "Remoção de vírus em Curitiba", to: "/remocao-de-virus-curitiba" },
      { label: "Upgrade de SSD em Curitiba", to: "/upgrade-ssd-curitiba" },
      { label: "Conserto de notebook em Curitiba", to: "/conserto-de-notebook-curitiba" },
      { label: "Assistência em informática", to: "/servicos/informatica" },
    ],
  },
  {
    slug: "remocao-de-virus-curitiba",
    keyword: "remoção de vírus em Curitiba",
    h1: "Remoção de vírus em Curitiba sem perder seus arquivos",
    title: `Remoção de Vírus em Curitiba a partir de ${BENCH}`,
    description: `Remova vírus e malware do seu computador em Curitiba a partir de ${BENCH}: limpeza profunda, sem perder arquivos e com 90 dias de garantia.`,
    intro:
      "Propaganda abrindo sozinha, navegador com página inicial trocada, arquivos criptografados ou lentidão repentina são sinais clássicos de infecção — e a remoção de vírus em Curitiba precisa ser feita com ferramentas de varredura offline, não apenas com um antivírus gratuito instalado por cima do problema.",
    city: "Curitiba",
    triageCategory: "pc",
    triageSymptom: "pc-lento",
    image: {
      src: "/gallery/pc-formatacao.webp",
      alt: "Bancada técnica com computador em varredura de segurança e monitor exibindo o progresso da análise do sistema",
    },
    whatIs: [
      "Remoção de vírus é a limpeza controlada de malware, adware, sequestradores de navegador e mineradores que rodam em segundo plano consumindo processador e memória.",
      "Diferente da formatação, o objetivo é preservar o sistema e os programas instalados: só indicamos reinstalação quando a infecção comprometeu arquivos do próprio sistema.",
    ],
    whenYouNeed: [
      "Anúncios e abas abrindo sozinhas mesmo com o navegador fechado.",
      "Computador esquentando e lento sem nenhum programa pesado aberto.",
      "Arquivos com extensão estranha ou pedido de resgate na tela.",
      "Antivírus desativado sozinho ou impossível de reinstalar.",
      "Contas de e-mail e redes sociais acessadas sem sua autorização.",
    ],
    howWeDo: [
      { title: "Triagem e isolamento", description: "Identificamos o tipo de ameaça pela triagem e orientamos desconectar a máquina da rede quando há risco de propagação." },
      { title: "Backup preventivo", description: "Copiamos os dados críticos antes de qualquer varredura destrutiva." },
      { title: "Varredura offline", description: "Análise fora do sistema operacional infectado, alcançando ameaças que o antivírus comum não enxerga." },
      { title: "Limpeza de persistência", description: "Removemos tarefas agendadas, entradas de inicialização, extensões e serviços criados pela praga." },
      { title: "Blindagem e orientação", description: "Sistema atualizado, antivírus configurado corretamente e orientação prática para não reinfectar." },
    ],
    averageTime: "3 a 6 horas em bancada, conforme o volume de arquivos analisados.",
    priceFrom: BENCH,
    priceNote: `Diagnóstico em bancada por ${BENCH}, abatido no fechamento. Casos com criptografia de dados recebem avaliação específica antes de qualquer promessa de recuperação.`,
    warranty: WARRANTY,
    compare: [
      { aspect: "Navegador", before: "Abas e anúncios abrindo sozinhos", after: "Navegador limpo, sem extensões maliciosas" },
      { aspect: "Uso de CPU em repouso", before: "60% a 100% sem programas abertos", after: "Abaixo de 10% em repouso" },
      { aspect: "Seus arquivos", before: "Risco de perda ou criptografia", after: "Backup preventivo antes de qualquer limpeza" },
      { aspect: "Proteção futura", before: "Antivírus desativado pela praga", after: "Sistema atualizado e proteção ativa configurada" },
    ],
    faq: [
      { question: "Preciso formatar para remover o vírus?", answer: "Na maioria dos casos, não. A varredura offline remove a ameaça preservando programas e configurações. A formatação só é indicada quando arquivos do próprio sistema foram comprometidos." },
      { question: `Quanto custa a remoção de vírus em Curitiba?`, answer: `A partir de ${BENCH}, valor do diagnóstico em bancada, abatido caso o serviço seja fechado. O valor final é informado por escrito antes da execução.` },
      { question: "Vocês recuperam arquivos criptografados por ransomware?", answer: "Depende da família do ransomware. Fazemos a avaliação técnica e informamos com honestidade quando não há chave pública de descriptografia disponível — nunca prometemos recuperação impossível." },
      { question: "Como evitar reinfecção?", answer: "Sistema atualizado, antivírus ativo, cuidado com instaladores de sites de download e senhas fortes. Entregamos a máquina com essas orientações aplicadas." },
    ],
    relatedServices: [
      { label: "Formatação de computador em Curitiba", to: "/formatacao-de-computador-curitiba" },
      { label: "Suporte técnico remoto", to: "/suporte-tecnico-remoto" },
      { label: "Assistência em informática", to: "/servicos/informatica" },
    ],
  },
  {
    slug: "upgrade-ssd-curitiba",
    keyword: "upgrade de SSD em Curitiba",
    h1: "Upgrade de SSD em Curitiba: o computador rápido de novo",
    title: `Upgrade de SSD em Curitiba a partir de ${BENCH}`,
    description: `Acelere seu computador com upgrade de SSD em Curitiba a partir de ${BENCH}: clonagem do sistema sem reinstalar, teste de desempenho e 90 dias de garantia.`,
    intro:
      "O upgrade de SSD em Curitiba é a intervenção com melhor custo-benefício em máquinas antigas: trocar o HD mecânico por um SSD reduz o tempo de inicialização de minutos para segundos e resolve boa parte da lentidão sem precisar comprar um computador novo.",
    city: "Curitiba",
    triageCategory: "pc",
    triageSymptom: "pc-lento",
    image: {
      src: "/gallery/upgrade-ssd-ram.webp",
      alt: "Instalação de SSD NVMe M.2 na placa-mãe de um notebook, com módulos de memória RAM sobre a manta antiestática",
    },
    whatIs: [
      "É a substituição do disco rígido por uma unidade de estado sólido (SATA ou NVMe M.2), com clonagem do sistema atual ou instalação limpa, conforme o estado da máquina.",
      "Avaliamos antes qual padrão a sua placa aceita — nem todo notebook suporta NVMe, e instalar o modelo errado desperdiça dinheiro sem ganho de velocidade.",
    ],
    whenYouNeed: [
      "O computador é bom de configuração, mas demora muito para abrir qualquer coisa.",
      "O HD faz barulho de clique ou apresenta setores defeituosos.",
      "Você abre muitos programas ao mesmo tempo e tudo trava no disco.",
      "Quer reaproveitar uma máquina de 5 a 10 anos em vez de comprar outra.",
    ],
    howWeDo: [
      { title: "Compatibilidade", description: "Conferimos slot disponível (SATA, M.2 SATA ou NVMe), limites da placa-mãe e espaço físico no gabinete ou chassi." },
      { title: "Clonagem ou instalação limpa", description: "Clonamos o sistema atual (você não perde nada) ou fazemos instalação limpa quando o Windows já estava degradado." },
      { title: "Instalação e firmware", description: "Montagem com ferramentas antiestáticas, atualização de firmware do SSD e ajuste de BIOS/UEFI." },
      { title: "Teste de desempenho", description: "Medimos leitura, escrita e tempo de boot antes e depois. Você recebe o comparativo por escrito." },
      { title: "Reaproveitamento do HD", description: "Quando saudável, o HD antigo vira disco secundário de arquivos ou unidade externa." },
    ],
    averageTime: "1 a 3 horas em bancada, incluindo clonagem e testes.",
    priceFrom: BENCH,
    priceNote: `Diagnóstico e mão de obra a partir de ${BENCH}. A peça (SSD) é orçada à parte e você pode fornecer a sua.`,
    warranty: `${WARRANTY} Peças novas seguem a garantia do fabricante.`,
    compare: [
      { aspect: "Tempo de boot", before: "2 a 4 minutos (HD mecânico)", after: "10 a 25 segundos (SSD)" },
      { aspect: "Abrir navegador e Office", before: "20 a 60 segundos", after: "1 a 4 segundos" },
      { aspect: "Ruído e choque", before: "Disco com partes móveis, sensível a queda", after: "Sem partes móveis, silencioso e mais resistente" },
      { aspect: "Seus dados", before: "Reinstalar tudo do zero", after: "Clonagem: sistema e programas preservados" },
    ],
    faq: [
      { question: "Preciso reinstalar o Windows ao colocar SSD?", answer: "Não necessariamente. Na maioria dos casos clonamos o sistema atual para o SSD, preservando programas, arquivos e licenças." },
      { question: `Quanto custa o upgrade de SSD em Curitiba?`, answer: `A mão de obra começa em ${BENCH}. O valor do SSD depende da capacidade e do padrão (SATA ou NVMe) e é informado por escrito antes da compra.` },
      { question: "Qual capacidade de SSD escolher?", answer: "Para uso doméstico e escritório, 480 GB a 500 GB atende com folga. Para edição de vídeo, jogos ou muitos projetos, 1 TB é o mais indicado." },
      { question: "Meu notebook antigo aceita SSD?", answer: "Praticamente todo notebook com baia SATA aceita SSD de 2,5\". Modelos mais recentes aceitam NVMe M.2, bem mais rápido. Conferimos a compatibilidade na triagem." },
    ],
    relatedServices: [
      { label: "Upgrade de memória RAM", to: "/upgrade-memoria-ram-curitiba" },
      { label: "Formatação de computador em Curitiba", to: "/formatacao-de-computador-curitiba" },
      { label: "Conserto de notebook em Curitiba", to: "/conserto-de-notebook-curitiba" },
    ],
  },
  {
    slug: "upgrade-memoria-ram-curitiba",
    keyword: "upgrade de memória RAM",
    h1: "Upgrade de memória RAM em Curitiba para acabar com o travamento",
    title: `Upgrade de Memória RAM em Curitiba a partir de ${BENCH}`,
    description: `Amplie a memória RAM do seu computador em Curitiba a partir de ${BENCH}: análise de compatibilidade, teste de estabilidade e 90 dias de garantia.`,
    intro:
      "Quando o computador trava com várias abas abertas ou o Excel demora a responder, o gargalo quase sempre é memória. O upgrade de memória RAM resolve travamentos por falta de recurso — desde que o pente escolhido respeite a frequência, o padrão (DDR3, DDR4, DDR5) e o limite da placa-mãe.",
    city: "Curitiba",
    triageCategory: "pc",
    triageSymptom: "pc-lento",
    image: {
      src: "/gallery/upgrade-ssd-ram.webp",
      alt: "Módulos de memória RAM notebook prontos para instalação ao lado de uma placa-mãe aberta em bancada técnica",
    },
    whatIs: [
      "É a ampliação da memória de trabalho do computador, com pentes compatíveis instalados nos slots corretos e teste de estabilidade após a montagem.",
      "Antes de vender qualquer peça, verificamos o consumo real de memória: em alguns casos o problema é disco ou software, e o upgrade não traria ganho.",
    ],
    whenYouNeed: [
      "Travamentos ao abrir muitas abas no navegador ou planilhas grandes.",
      "Mensagem de 'memória insuficiente' ao abrir programas.",
      "Uso de memória sempre acima de 85% no Gerenciador de Tarefas.",
      "Trabalho com edição de imagem, vídeo, CAD ou máquinas virtuais.",
    ],
    howWeDo: [
      { title: "Diagnóstico de consumo", description: "Medimos o uso real de memória e confirmamos que a RAM é mesmo o gargalo antes de indicar a compra." },
      { title: "Compatibilidade", description: "Padrão (DDR3/DDR4/DDR5), frequência, tensão, número de slots e limite suportado pela placa-mãe." },
      { title: "Instalação em dual channel", description: "Distribuição correta dos pentes para aproveitar o ganho de banda do dual channel." },
      { title: "Teste de estabilidade", description: "Rodamos teste de memória para descartar módulo defeituoso antes da entrega." },
    ],
    averageTime: "1 a 2 horas em bancada, incluindo teste de estabilidade.",
    priceFrom: BENCH,
    priceNote: `Mão de obra e diagnóstico a partir de ${BENCH}. Os módulos de memória são orçados à parte e você pode fornecer os seus.`,
    warranty: `${WARRANTY} Módulos novos seguem a garantia do fabricante.`,
    compare: [
      { aspect: "Abas simultâneas no navegador", before: "Travamento acima de 10 abas", after: "30+ abas sem engasgo" },
      { aspect: "Uso de memória", before: "Acima de 90% em uso normal", after: "Entre 40% e 60% com folga" },
      { aspect: "Planilhas e edição", before: "Congelamento ao abrir arquivos grandes", after: "Resposta imediata" },
      { aspect: "Estabilidade", before: "Pente incompatível compra por conta própria", after: "Módulo testado e validado em bancada" },
    ],
    faq: [
      { question: "Quanto de RAM eu preciso?", answer: "8 GB atende uso doméstico e escritório. 16 GB é o ideal para multitarefa pesada, jogos e edição. Acima disso, só para vídeo profissional, CAD e virtualização." },
      { question: `Quanto custa o upgrade de memória RAM em Curitiba?`, answer: `A mão de obra começa em ${BENCH}. O valor dos módulos depende do padrão e da capacidade, e é informado por escrito antes da compra.` },
      { question: "Posso misturar pentes de marcas diferentes?", answer: "É possível, mas nem sempre estável. Damos preferência a módulos de mesma frequência e latência; quando misturamos, validamos com teste de memória antes de entregar." },
      { question: "Mais memória deixa o PC mais rápido para ligar?", answer: "Não. Tempo de inicialização depende do disco — nesse caso, o upgrade indicado é SSD. Memória resolve travamento por multitarefa." },
    ],
    relatedServices: [
      { label: "Upgrade de SSD em Curitiba", to: "/upgrade-ssd-curitiba" },
      { label: "Conserto de notebook em Curitiba", to: "/conserto-de-notebook-curitiba" },
      { label: "Assistência em informática", to: "/servicos/informatica" },
    ],
  },
  {
    slug: "conserto-de-notebook-curitiba",
    keyword: "conserto de notebook em Curitiba",
    h1: "Conserto de notebook em Curitiba com diagnóstico antes do orçamento",
    title: `Conserto de Notebook em Curitiba | ${BENCH}`,
    description: `Conserte seu notebook em Curitiba a partir de ${BENCH}: diagnóstico em bancada, orçamento fechado antes do reparo e 90 dias de garantia.`,
    intro:
      "Notebook que não liga, desliga sozinho, esquenta demais, não carrega ou está com a tela quebrada tem solução — e o conserto de notebook em Curitiba começa sempre pelo diagnóstico em bancada, para que você saiba o custo real do reparo antes de autorizar qualquer peça.",
    city: "Curitiba",
    triageCategory: "notebook",
    triageSymptom: "notebook-nao-liga",
    image: {
      src: "/gallery/notebook-reparo.webp",
      alt: "Notebook aberto em bancada com teclado removido, placa-mãe exposta e parafusos organizados durante o reparo",
    },
    whatIs: [
      "Reparo de hardware e software em notebooks de todas as marcas: placa-mãe, fonte, carregamento, teclado, dobradiça, tela, cooler, armazenamento e sistema operacional.",
      "O diagnóstico em bancada identifica a causa real — muitas trocas de placa indicadas por aí são, na prática, um problema de alimentação ou de conector.",
    ],
    whenYouNeed: [
      "Não liga, não dá vídeo ou liga e desliga em seguida.",
      "Carregador conectado e bateria não carrega.",
      "Superaquecimento, cooler barulhento ou desligamento por temperatura.",
      "Tela trincada, com manchas ou linhas.",
      "Teclado com teclas mortas, dobradiça quebrada ou carcaça solta.",
    ],
    howWeDo: [
      { title: "Triagem detalhada", description: "Marca, modelo, sintoma e histórico do equipamento — já indicamos se o caso é bancada, visita ou coleta." },
      { title: "Diagnóstico em bancada", description: "Testes de alimentação, medições de placa, checagem de memória, disco e temperatura." },
      { title: "Orçamento fechado", description: "Valor final por escrito, com peça e prazo. Se o reparo não compensar, dizemos com honestidade." },
      { title: "Reparo com peças testadas", description: "Substituição de componente ou reparo em nível de placa, sempre com testes após a intervenção." },
      { title: "Teste final e entrega", description: "Bateria de testes de estabilidade, temperatura e autonomia antes de devolver o equipamento." },
    ],
    averageTime: "1 a 3 dias úteis, conforme disponibilidade de peça.",
    priceFrom: BENCH,
    priceNote: `Diagnóstico em bancada por ${BENCH}, abatido no fechamento. Coleta e entrega personalizada a partir de ${PRICING.pickupDelivery.priceLabel.replace("A partir de ", "")}.`,
    warranty: WARRANTY,
    compare: [
      { aspect: "Origem do defeito", before: "Palpite de balcão, troca de peça no escuro", after: "Diagnóstico medido em bancada, causa identificada" },
      { aspect: "Orçamento", before: "Valor muda depois que a peça já foi trocada", after: "Valor fechado por escrito antes da execução" },
      { aspect: "Temperatura", before: "Desligamento por superaquecimento", after: "Troca de pasta térmica e limpeza do sistema de refrigeração" },
      { aspect: "Garantia", before: "Sem comprovante de serviço", after: "90 dias de garantia com nota fiscal" },
    ],
    faq: [
      { question: `Quanto custa consertar um notebook em Curitiba?`, answer: `O diagnóstico em bancada custa ${BENCH} e é abatido caso o reparo seja aprovado. O valor do conserto depende da peça e é sempre informado por escrito antes da execução.` },
      { question: "Vocês consertam placa-mãe de notebook?", answer: "Sim, fazemos reparo em nível de placa quando é viável tecnicamente e economicamente. Quando não compensa frente ao valor do equipamento, avisamos antes." },
      { question: "Quanto tempo leva o conserto?", answer: "Entre 1 e 3 dias úteis na maioria dos casos. Reparos que dependem de peça importada podem levar mais tempo — o prazo é informado no orçamento." },
      { question: "Vocês buscam o notebook na minha casa?", answer: `Sim. A coleta e entrega personalizada em Curitiba e Região tem valor mínimo pré-aprovado de ${PRICING.pickupDelivery.priceLabel.replace("A partir de ", "")}, variando conforme distância e complexidade.` },
      { question: "Tem garantia no serviço?", answer: "Sim: 90 dias de garantia na mão de obra, com nota fiscal. Peças novas seguem também a garantia do fabricante." },
    ],
    relatedServices: [
      { label: "Upgrade de SSD em Curitiba", to: "/upgrade-ssd-curitiba" },
      { label: "Upgrade de memória RAM", to: "/upgrade-memoria-ram-curitiba" },
      { label: "Assistência de notebooks", to: "/servicos/notebooks" },
    ],
  },
  {
    slug: "suporte-tecnico-remoto",
    keyword: "suporte técnico remoto",
    h1: "Suporte técnico remoto com atendimento no mesmo dia",
    title: `Suporte Técnico Remoto em Curitiba`,
    description: `Resolva problemas de computador com suporte técnico remoto a partir de ${BENCH}: acesso autorizado por você, atendimento no mesmo dia e garantia de 90 dias.`,
    intro:
      "Nem todo problema exige visita: configuração de e-mail, impressora que sumiu da rede, lentidão por software, atualização travada e instalação de programas se resolvem por suporte técnico remoto, com acesso autorizado por você e acompanhamento da tela do início ao fim.",
    city: "Brasil",
    triageCategory: "pc",
    triageSymptom: "pc-lento",
    image: {
      src: "/gallery/suporte-ti-empresas.webp",
      alt: "Técnico realizando sessão de suporte remoto em notebook, com rack de rede e switches ao fundo em ambiente corporativo",
    },
    whatIs: [
      "É o atendimento feito à distância, com ferramenta de acesso remoto autorizada por você em tempo real. Nada é instalado sem sua permissão e a sessão é encerrada ao final do atendimento.",
      "Atende todo o Brasil, sem custo de deslocamento — o que reduz o valor final e permite resolver no mesmo dia.",
    ],
    whenYouNeed: [
      "Configuração de e-mail, impressora, backup ou nuvem.",
      "Lentidão, atualização travada ou erro de sistema.",
      "Instalação e configuração de programas e antivírus.",
      "Dúvidas recorrentes de uso e treinamento pontual.",
      "Primeira análise antes de decidir por visita ou bancada.",
    ],
    howWeDo: [
      { title: "Triagem online", description: "Você descreve o problema pela triagem e já sabemos se o caso é resolvível remotamente." },
      { title: "Agendamento imediato", description: "Sessão marcada no mesmo dia dentro do horário de atendimento (08h às 22h)." },
      { title: "Acesso autorizado", description: "Você inicia a ferramenta e autoriza o acesso. Acompanha tudo pela própria tela." },
      { title: "Execução e validação", description: "Aplicamos a correção, testamos junto com você e registramos o que foi feito." },
      { title: "Encerramento seguro", description: "A sessão é encerrada e o acesso removido ao final do atendimento." },
    ],
    averageTime: "30 a 90 minutos por sessão, na maior parte dos casos.",
    priceFrom: BENCH,
    priceNote: `Sessão remota a partir de ${BENCH}. Se o problema não for resolvível remotamente, orientamos a modalidade correta antes de qualquer cobrança adicional.`,
    warranty: WARRANTY,
    compare: [
      { aspect: "Prazo", before: "Agenda de visita para outro dia", after: "Atendimento no mesmo dia" },
      { aspect: "Custo", before: "Deslocamento somado ao serviço", after: "Sem custo de deslocamento" },
      { aspect: "Transparência", before: "Máquina sai de casa sem acompanhamento", after: "Você vê toda a intervenção na sua tela" },
      { aspect: "Alcance", before: "Limitado a Curitiba e Região", after: "Atendimento em todo o Brasil" },
    ],
    faq: [
      { question: "O suporte remoto é seguro?", answer: "Sim. O acesso só existe enquanto você autoriza, você acompanha tudo pela tela e a sessão é encerrada ao final. Não solicitamos senhas de banco em nenhuma hipótese." },
      { question: `Quanto custa o suporte técnico remoto?`, answer: `A partir de ${BENCH} por sessão. O valor é informado por escrito na triagem, antes do início do atendimento.` },
      { question: "Quais problemas não são resolvidos remotamente?", answer: "Defeitos físicos — tela quebrada, equipamento que não liga, problemas de fonte, rede sem link. Nesses casos indicamos bancada, visita ou coleta." },
      { question: "Vocês atendem fora de Curitiba?", answer: "Sim. O suporte remoto atende todo o Brasil dentro do horário de 08h às 22h, com triagem pelo WhatsApp 24h." },
    ],
    relatedServices: [
      { label: "Remoção de vírus em Curitiba", to: "/remocao-de-virus-curitiba" },
      { label: "Suporte de TI para empresas em Curitiba", to: "/assistencia-tecnica-empresas-curitiba" },
      { label: "Atendimento nacional", to: "/atendimento-nacional" },
    ],
  },
  {
    slug: "assistencia-tecnica-empresas-curitiba",
    keyword: "suporte de TI para empresas",
    h1: "Suporte de TI para empresas em Curitiba com SLA definido",
    title: `Suporte de TI para Empresas em Curitiba a partir de ${VISIT}`,
    description: `Contrate suporte de TI para empresas em Curitiba a partir de ${VISIT}: atendimento com SLA, rede, backup, CFTV e manutenção preventiva com garantia.`,
    intro:
      "Empresa parada custa caro por hora. O suporte de TI para empresas em Curitiba que oferecemos cobre estação de trabalho, rede cabeada e Wi-Fi, servidores de arquivo, backup, CFTV e manutenção preventiva — com prazo de atendimento definido em contrato e registro técnico de cada chamado.",
    city: "Curitiba",
    triageCategory: "pc",
    image: {
      src: "/gallery/suporte-ti-empresas.webp",
      alt: "Rack de rede corporativo com patch panel e switches organizados, e técnico operando notebook de gestão do ambiente",
    },
    whatIs: [
      "Atendimento corporativo sob demanda ou por contrato mensal: helpdesk remoto, visitas técnicas programadas, gestão de rede e infraestrutura, backup e políticas de segurança.",
      "Cada chamado gera registro técnico — o que foi solicitado, o que foi executado e o que ficou pendente —, o que permite acompanhar custo e recorrência de falhas.",
    ],
    whenYouNeed: [
      "Rede instável, lentidão de sistema ou Wi-Fi que cai no horário de pico.",
      "Nenhuma rotina de backup confiável dos arquivos da empresa.",
      "Crescimento de equipe exigindo padronização de estações e acessos.",
      "Necessidade de CFTV, controle de acesso ou cabeamento estruturado.",
      "Ausência de responsável técnico e chamados resolvidos no improviso.",
    ],
    howWeDo: [
      { title: "Levantamento do ambiente", description: "Inventário de estações, servidores, links, switches, roteadores e pontos de rede." },
      { title: "Plano técnico", description: "Prioridades, riscos, correções imediatas e cronograma de manutenção preventiva." },
      { title: "Atendimento com SLA", description: "Prazo de resposta e de solução acordados por criticidade, com registro de cada chamado." },
      { title: "Backup e continuidade", description: "Rotina de backup testada periodicamente — backup que nunca foi restaurado não é backup." },
      { title: "Relatório mensal", description: "Chamados, causas recorrentes e recomendações de investimento para o mês seguinte." },
    ],
    averageTime: "Resposta remota em até 4 horas úteis; visita conforme criticidade acordada.",
    priceFrom: VISIT,
    priceNote: `Visita técnica a partir de ${VISIT} por até 20 minutos. Contratos mensais são orçados conforme número de estações e escopo.`,
    warranty: WARRANTY,
    compare: [
      { aspect: "Chamados", before: "Resolvidos no improviso, sem registro", after: "Registro técnico e histórico por chamado" },
      { aspect: "Backup", before: "Cópia manual esquecida há meses", after: "Rotina automatizada com teste de restauração" },
      { aspect: "Rede", before: "Wi-Fi caindo em horário de pico", after: "Projeto de cobertura e segmentação de rede" },
      { aspect: "Custo", before: "Emergências caras e imprevisíveis", after: "Manutenção preventiva com custo previsível" },
    ],
    faq: [
      { question: `Quanto custa o suporte de TI para empresas em Curitiba?`, answer: `Atendimento avulso a partir de ${VISIT} por até 20 minutos. Contratos mensais são orçados conforme número de estações, criticidade e escopo (rede, backup, CFTV).` },
      { question: "Vocês atendem empresas fora de Curitiba?", answer: "Sim. Atendimento presencial em Curitiba e Região Metropolitana, e suporte remoto para todo o Brasil dentro do horário de 08h às 22h." },
      { question: "Existe contrato de fidelidade?", answer: "Não trabalhamos com fidelidade obrigatória. O contrato define escopo e SLA; o encerramento segue o aviso prévio combinado." },
      { question: "Vocês cuidam também de CFTV e cabeamento?", answer: "Sim. CFTV, controle de acesso, cabeamento estruturado e elétrica de baixa tensão fazem parte do escopo corporativo." },
      { question: "Como funciona o SLA?", answer: "O prazo de resposta e de solução é definido por criticidade do chamado. Cada atendimento registra abertura, execução e encerramento para auditoria." },
      { question: "Vocês instalam e dão suporte a certificado digital (A1/A3)?", answer: "Damos suporte técnico à instalação do certificado na estação, drivers de leitora/token e configuração do navegador. A emissão, renovação e validação do certificado são feitas pela Autoridade Certificadora contratada pela empresa — não emitimos nem revalidamos certificados." },
      { question: "Vocês dão suporte a sistemas de terceiros (ERP, contábil, prontuário, sistema jurídico)?", answer: "Atuamos na camada de infraestrutura: instalação do cliente, permissões de pasta, banco local, impressão, rede e acesso remoto. Erros internos do software, atualização de versão e regras de negócio permanecem com o fornecedor do sistema — quando necessário, participamos do chamado junto ao suporte dele." },
      { question: "Como funciona o acesso remoto e quem autoriza?", answer: "A sessão só é aberta com autorização de um responsável da empresa, é acompanhada na tela e encerrada ao final. Registramos data, chamado e o que foi executado. Não mantemos acesso permanente sem contrato que preveja isso." },
      { question: "Vocês acessam contas de terceiros da empresa (banco, e-mail, sistema fiscal)?", answer: "Não solicitamos e não usamos senhas de banco. Em contas administrativas de sistemas ou e-mail, o acesso é feito pelo responsável da empresa durante a sessão, ou com credencial técnica fornecida por escrito por ele. A responsabilidade pelo conteúdo e pelas permissões dessas contas é do cliente." },
      { question: "Qual a diferença entre atendimento avulso e contrato recorrente?", answer: `Avulso é por chamado, a partir de ${VISIT} por até 20 minutos, sem SLA garantido. Recorrente é mensal, com SLA por criticidade, manutenção preventiva, monitoramento de backup e relatório mensal.` },
    ],
    businessTracks: [
      {
        title: "Escritórios de advocacia",
        description: "Foco em disponibilidade das estações, certificado digital funcionando e arquivos com backup verificado.",
        includes: [
          "Instalação de leitora/token e drivers do certificado digital na estação",
          "Configuração de navegador e Java/assinador exigidos por tribunais",
          "Pasta compartilhada de processos com permissões por usuário",
          "Rotina de backup com teste de restauração",
          "Scanner e impressão em rede para digitalização de peças",
        ],
      },
      {
        title: "Consultórios e clínicas",
        description: "Continuidade do atendimento: estação da recepção, rede estável e acesso ao sistema de prontuário sem queda.",
        includes: [
          "Estação de recepção e consultório padronizadas",
          "Rede e Wi-Fi segmentados (equipe x visitantes)",
          "Suporte de infraestrutura ao cliente do sistema de prontuário",
          "Impressão de receituário e etiquetas em rede",
          "Backup de arquivos locais e verificação periódica",
        ],
      },
      {
        title: "Contabilidade e escritórios administrativos",
        description: "Volume alto de sistemas fiscais, certificados e impressão — o gargalo costuma ser rede, disco e permissão.",
        includes: [
          "Certificados A1/A3 instalados por usuário",
          "Servidor de arquivos e permissões por setor",
          "Upgrade de SSD/RAM nas estações que travam em fechamento",
          "Backup diário com retenção definida",
          "Suporte remoto prioritário em período de entrega de obrigações",
        ],
      },
      {
        title: "Comércio, obras e operações com CFTV",
        description: "Infraestrutura física: cabeamento, câmeras, ponto de rede e equipamentos em ambiente hostil.",
        includes: [
          "Cabeamento estruturado e organização de rack",
          "CFTV com acesso remoto configurado",
          "Pontos de rede e PoE para câmeras e access points",
          "Manutenção preventiva programada",
        ],
      },
    ],
    engagementModels: [
      {
        name: "Atendimento avulso (por chamado)",
        howItWorks: `Você aciona pela triagem, descreve o problema e recebe o valor por escrito antes de começar. Cobrança a partir de ${VISIT} por até 20 minutos.`,
        includes: [
          "Diagnóstico e execução do chamado aberto",
          "Registro técnico do que foi feito",
          "Garantia de 90 dias na mão de obra do serviço executado",
          "Sem SLA garantido — atendimento por ordem de fila",
        ],
      },
      {
        name: "Contrato recorrente (mensal)",
        howItWorks:
          "Escopo, número de estações e criticidade definidos em contrato, com prazo de resposta acordado e agenda de manutenção preventiva.",
        includes: [
          "SLA de resposta e de solução por criticidade",
          "Helpdesk remoto dentro do horário contratado",
          "Visitas preventivas programadas",
          "Monitoramento da rotina de backup, com teste de restauração",
          "Relatório mensal de chamados e recomendações",
        ],
      },
    ],
    scopeLimits: [
      "Não emitimos, renovamos nem validamos certificados digitais — isso é da Autoridade Certificadora.",
      "Não corrigimos bugs internos, atualizações ou regras de negócio de sistemas de terceiros (ERP, contábil, prontuário, jurídico).",
      "Não assumimos responsabilidade por conteúdo, permissões ou uso de contas de terceiros da empresa (banco, e-mail, portais fiscais).",
      "Não prometemos ganho de desempenho por software específico nem número de usuários simultâneos sem teste no ambiente real.",
      "Não realizamos consultoria de conformidade (LGPD, auditoria) — atuamos na infraestrutura técnica que a suporta.",
      "Não garantimos disponibilidade de link de internet ou serviço de nuvem operado por terceiros.",
    ],
    relatedServices: [
      { label: "Suporte técnico remoto", to: "/suporte-tecnico-remoto" },
      { label: "Redes e Wi-Fi", to: "/servicos/redes" },
      { label: "CFTV e monitoramento", to: "/servicos/cftv" },
      { label: "Configuração de Wi-Fi em Curitiba", to: "/servicos/configuracao-wifi-curitiba" },
      { label: "Upgrade de SSD em Curitiba", to: "/upgrade-ssd-curitiba" },
    ],
  },
];

export const KEYWORD_SERVICE_BY_SLUG: Record<string, KeywordServicePage> =
  Object.fromEntries(KEYWORD_SERVICE_PAGES.map((p) => [p.slug, p]));
