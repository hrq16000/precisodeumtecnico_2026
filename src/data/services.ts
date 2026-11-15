export interface ServiceData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  icon: string;
  benefits: string[];
  includedServices: string[];
  process: { step: number; title: string; description: string }[];
  pricing: { name: string; price: string; description: string }[];
  faqs: { question: string; answer: string }[];
  relatedServices: string[];
  keywords: string[];
}

export const servicesData: Record<string, ServiceData> = {
  "informatica": {
    slug: "informatica",
    title: "Assistência Técnica em Informática",
    metaTitle: "Técnico em Informática Curitiba | Manutenção de Computadores 24h",
    metaDescription: "Assistência técnica em informática em Curitiba. Formatação, limpeza, upgrade, remoção de vírus. Técnico vai até você. Atendimento 24h via WhatsApp. A partir de R$ 99,99.",
    subtitle: "Manutenção e suporte especializado para seu computador",
    description: "Oferecemos serviços completos de manutenção em computadores desktop e workstations. Formatação, limpeza, upgrade de hardware, remoção de vírus e muito mais.",
    longDescription: "Nossa equipe de técnicos especializados em informática está pronta para resolver qualquer problema com seu computador. Realizamos desde manutenções preventivas até reparos complexos, sempre com peças de qualidade e garantia em todos os serviços. Atendemos residências e empresas em Curitiba e Região Metropolitana, com agendamento 24 horas via WhatsApp e atendimento presencial das 8h às 22h. Somos especialistas em diagnóstico de hardware, identificando problemas em placas-mãe, fontes, memórias e processadores. Também realizamos otimização de desempenho, deixando seu computador mais rápido e eficiente.",
    image: "service-computer.jpg",
    icon: "Monitor",
    benefits: [
      "Técnicos certificados e experientes",
      "Atendimento no local (residência ou empresa)",
      "Garantia de 90 dias a 1 ano",
      "Orçamento sem compromisso",
      "Peças originais e de qualidade",
      "Backup de dados incluído",
      "Suporte pós-atendimento",
      "Emissão de nota fiscal"
    ],
    includedServices: [
      "Formatação e instalação de Windows 10/11",
      "Instalação de Linux (Ubuntu, Mint)",
      "Limpeza interna e externa completa",
      "Remoção de vírus, malwares e ransomware",
      "Upgrade de memória RAM (4GB, 8GB, 16GB, 32GB)",
      "Troca de HD por SSD (240GB, 480GB, 1TB)",
      "Instalação de programas e drivers",
      "Configuração de rede e internet",
      "Backup e recuperação de dados",
      "Montagem de computadores personalizados",
      "Manutenção preventiva trimestral",
      "Reparo de placa-mãe",
      "Troca de fonte de alimentação",
      "Configuração de e-mail e Office"
    ],
    process: [
      { step: 1, title: "Contato via WhatsApp", description: "Entre em contato via WhatsApp WhatsApp 24h e descreva o problema do seu computador" },
      { step: 2, title: "Agendamento Flexível", description: "Escolha o melhor horário para a visita técnica - atendemos das 8h às 22h" },
      { step: 3, title: "Diagnóstico Completo", description: "Técnico realiza diagnóstico detalhado no local com equipamentos profissionais" },
      { step: 4, title: "Orçamento Transparente", description: "Apresentamos orçamento detalhado sem compromisso - você decide se aprova" },
      { step: 5, title: "Execução Profissional", description: "Serviço realizado com qualidade, agilidade e peças de primeira linha" },
      { step: 6, title: "Garantia por Escrito", description: "Receba garantia de 90 dias a 1 ano por escrito e nota fiscal" }
    ],
    pricing: [
      { name: "Visita técnica de inspeção", price: "R$ 99,99", description: "Inspeção no local (até 20 min)" },
      { name: "Formatação Completa", price: "A partir de R$ 150,00", description: "Windows + drivers + programas essenciais" },
      { name: "Formatação + Backup", price: "A partir de R$ 200,00", description: "Backup completo + formatação + restauração" },
      { name: "Limpeza Interna Completa", price: "A partir de R$ 80,00", description: "Limpeza + troca de pasta térmica premium" },
      { name: "Upgrade SSD 240GB", price: "A partir de R$ 250,00", description: "SSD Kingston/WD + instalação + clonagem" },
      { name: "Upgrade SSD 480GB", price: "A partir de R$ 350,00", description: "SSD Kingston/WD + instalação + clonagem" },
      { name: "Remoção de Vírus Completa", price: "A partir de R$ 100,00", description: "Limpeza profunda + antivírus premium" },
      { name: "Manutenção Preventiva", price: "A partir de R$ 120,00", description: "Limpeza + otimização + verificação geral" },
      { name: "Montagem de PC", price: "A partir de R$ 150,00", description: "Montagem + instalação + configuração" }
    ],
    faqs: [
      { question: "Quanto tempo demora uma formatação completa?", answer: "Uma formatação completa com instalação de Windows, drivers e programas básicos leva em média 2 a 3 horas. Com SSD o processo é mais rápido (1-2 horas). Já com HD tradicional pode levar até 4 horas dependendo da capacidade." },
      { question: "Vocês fazem backup dos meus arquivos antes de formatar?", answer: "Sim! Antes de qualquer formatação ou procedimento que possa afetar seus dados, realizamos backup completo de documentos, fotos, vídeos e outros arquivos importantes. O backup pode ser feito em HD externo (do cliente ou nosso) ou na nuvem." },
      { question: "Qual a garantia dos serviços de informática?", answer: "Oferecemos garantia de 90 dias para serviços de software (formatação, limpeza de vírus, configurações) e garantia de até 1 ano para troca de peças e upgrades. A garantia cobre defeitos de mão de obra e das peças instaladas." },
      { question: "Vocês atendem empresas e condomínios?", answer: "Sim! Atendemos empresas de todos os portes com contratos de manutenção mensal, trimestral ou atendimento avulso. Também atendemos condomínios com suporte técnico para moradores." },
      { question: "Emitem nota fiscal dos serviços?", answer: "Sim, emitimos nota fiscal eletrônica (NFS-e) para todos os serviços prestados. A nota pode ser emitida para pessoa física (CPF) ou jurídica (CNPJ)." },
      { question: "O atendimento via WhatsApp é realmente 24 horas?", answer: "Sim! O agendamento via WhatsApp funciona 24 horas, 7 dias por semana. O atendimento presencial (visita técnica) é realizado das 8h às 22h, de segunda a sábado." },
      { question: "Vocês consertam computador que não liga?", answer: "Sim! Fazemos diagnóstico completo para identificar a causa (fonte queimada, placa-mãe, memória, processador). Na maioria dos casos conseguimos resolver com troca de componentes específicos, evitando a troca do equipamento todo." }
    ],
    relatedServices: ["notebooks", "redes", "servidores", "pc-gamer"],
    keywords: ["técnico em informática curitiba", "manutenção de computadores", "formatação curitiba", "conserto de pc", "upgrade computador", "limpeza de vírus", "assistência técnica computador", "técnico domicílio curitiba"]
  },
  "notebooks": {
    slug: "notebooks",
    title: "Assistência Técnica em Notebooks",
    metaTitle: "Conserto de Notebook Curitiba | Assistência Técnica Especializada 24h",
    metaDescription: "Conserto de notebook em Curitiba. Troca de tela, teclado, bateria, upgrade SSD. Dell, HP, Lenovo, Acer, Asus, Samsung. Técnico vai até você. A partir de R$ 99,99.",
    subtitle: "Reparo especializado para todas as marcas de notebooks",
    description: "Especialistas em conserto de notebooks de todas as marcas. Troca de tela, teclado, bateria, dobradiças, upgrade de memória e SSD. Atendimento em domicílio.",
    longDescription: "Somos especialistas em assistência técnica para notebooks de todas as marcas: Dell, HP, Lenovo, Acer, Asus, Samsung, Positivo, Vaio, LG e outras. Nossa equipe possui experiência em diagnóstico e reparo de problemas de hardware e software, desde trocas de componentes até soluções complexas de placa-mãe com micro-soldagem. Trabalhamos com peças originais e compatíveis de alta qualidade, garantindo a durabilidade do reparo. Realizamos atendimento em domicílio ou na empresa, evitando que você precise se deslocar com seu equipamento.",
    image: "service-notebook.jpg",
    icon: "Laptop",
    benefits: [
      "Especialistas em todas as marcas e modelos",
      "Peças originais e compatíveis de alta qualidade",
      "Atendimento em domicílio ou empresa",
      "Garantia de até 1 ano nas peças",
      "Diagnóstico com valor fixo de R$ 99,99, deduzido se aprovar o serviço",
      "Orçamento sem compromisso",
      "Técnicos certificados pelos fabricantes",
      "Backup de dados incluído",
      "Coleta e entrega disponível"
    ],
    includedServices: [
      "Troca de tela LCD/LED/IPS",
      "Troca de tela touch screen",
      "Substituição de teclado ABNT/US",
      "Troca de bateria original e compatível",
      "Reparo de dobradiças quebradas",
      "Reconstrução de carcaça com resina",
      "Upgrade de memória RAM (até 64GB)",
      "Troca de HD por SSD NVMe/SATA",
      "Limpeza interna completa",
      "Troca de pasta térmica premium",
      "Reparo de conector de carga",
      "Troca de DC Jack",
      "Formatação e instalação de sistema",
      "Recuperação de dados",
      "Reparo de placa-mãe com micro-soldagem",
      "Troca de cooler e ventoinha"
    ],
    process: [
      { step: 1, title: "Contato WhatsApp", description: "Fale conosco via WhatsApp descrevendo o problema do notebook" },
      { step: 2, title: "Pré-Diagnóstico", description: "Fazemos uma avaliação inicial pelo WhatsApp para estimar o problema" },
      { step: 3, title: "Coleta ou Visita", description: "Coletamos o notebook ou vamos até você para diagnóstico" },
      { step: 4, title: "Diagnóstico Técnico", description: "Avaliação completa com equipamentos profissionais" },
      { step: 5, title: "Orçamento Detalhado", description: "Orçamento com fotos e explicação do problema" },
      { step: 6, title: "Aprovação", description: "Você aprova o orçamento e agendamos o reparo" },
      { step: 7, title: "Reparo Profissional", description: "Serviço executado com peças de qualidade" },
      { step: 8, title: "Entrega com Garantia", description: "Notebook entregue funcionando com garantia por escrito" }
    ],
    pricing: [
      { name: "Diagnóstico", price: "R$ 99,99", description: "Avaliação completa (deduzido do serviço)" },
      { name: "Troca de Tela 14/15.6", price: "A partir de R$ 350,00", description: "Tela HD/Full HD + mão de obra" },
      { name: "Troca de Tela Touch", price: "A partir de R$ 500,00", description: "Tela touch + instalação" },
      { name: "Troca de Teclado", price: "A partir de R$ 180,00", description: "Teclado ABNT2 + instalação" },
      { name: "Troca de Bateria", price: "A partir de R$ 200,00", description: "Bateria compatível + instalação" },
      { name: "Reparo de Dobradiça", price: "A partir de R$ 150,00", description: "Dobradiça + reconstrução" },
      { name: "Upgrade SSD NVMe 256GB", price: "A partir de R$ 280,00", description: "SSD + clonagem do sistema" },
      { name: "Upgrade SSD NVMe 512GB", price: "A partir de R$ 400,00", description: "SSD + clonagem do sistema" },
      { name: "Limpeza + Pasta Térmica", price: "A partir de R$ 100,00", description: "Limpeza completa + pasta Arctic" },
      { name: "Reparo Placa-Mãe", price: "A partir de R$ 300,00", description: "Micro-soldagem de componentes" }
    ],
    faqs: [
      { question: "Vocês consertam notebooks de todas as marcas?", answer: "Sim! Trabalhamos com Dell, HP, Lenovo, Acer, Asus, Samsung, Positivo, Vaio, LG, Compaq, Gateway e todas as outras marcas do mercado, incluindo modelos antigos e novos." },
      { question: "Quanto tempo leva um reparo de notebook?", answer: "Depende do serviço: formatação e upgrades são feitos em 1-2 dias. Troca de tela e teclado de 1 a 5 dias (dependendo da disponibilidade da peça). Reparo de placa-mãe pode levar de 3 a 10 dias." },
      { question: "As peças são originais?", answer: "Trabalhamos com peças originais (quando disponíveis) e compatíveis de alta qualidade. Sempre informamos qual tipo de peça será utilizada e você escolhe a melhor opção para seu orçamento." },
      { question: "Vocês buscam e entregam o notebook?", answer: "Sim! Oferecemos serviço de coleta e entrega em Curitiba e toda a região metropolitana. A coleta e entrega personalizada parte de R$ 299,99, conforme distância, equipamento e complexidade." },
      { question: "Consertam MacBook?", answer: "Sim! Somos especializados também em notebooks Apple, incluindo MacBook Air e MacBook Pro. Realizamos troca de bateria, tela, teclado, SSD, reparo de placa lógica e muito mais." },
      { question: "Meu notebook não liga, tem conserto?", answer: "Na maioria dos casos sim! Fazemos diagnóstico completo para identificar se o problema é na fonte, bateria, placa-mãe ou outro componente. Muitas vezes é possível recuperar com troca de peças específicas." },
      { question: "Notebook que caiu ou molhou tem conserto?", answer: "Depende do dano. Notebooks que caíram podem ter problemas de tela, dobradiça ou placa. Notebooks molhados precisam de limpeza urgente (banho químico) para evitar corrosão. Quanto antes trouxer, maior a chance de recuperação." }
    ],
    relatedServices: ["informatica", "macbook", "celulares", "redes"],
    keywords: ["conserto notebook curitiba", "assistência técnica notebook", "troca tela notebook", "troca teclado notebook", "upgrade notebook ssd", "reparo notebook dell hp lenovo"]
  },
  "cftv": {
    slug: "cftv",
    title: "Instalação de Câmeras e CFTV",
    metaTitle: "Instalação de Câmeras Curitiba | CFTV Residencial e Comercial 24h",
    metaDescription: "Instalação de câmeras de segurança em Curitiba. CFTV residencial e comercial. Câmeras IP, analógicas, DVR, NVR. Acesso remoto pelo celular. Kit 4 câmeras a partir de R$ 1.200.",
    subtitle: "Segurança completa para sua residência ou empresa",
    description: "Instalação profissional de sistemas de CFTV e câmeras de segurança. Câmeras IP, analógicas, WiFi, DVR, NVR. Configuração de acesso remoto pelo celular para você monitorar de qualquer lugar.",
    longDescription: "Proteja seu patrimônio com sistemas de videomonitoramento de última geração. Oferecemos soluções completas em CFTV para residências, comércios, condomínios, indústrias e áreas rurais. Trabalhamos com as melhores marcas do mercado como Intelbras, Hikvision, Giga Security, Tecvoz e outras. Realizamos desde a instalação de uma câmera Wi-Fi simples até sistemas complexos com dezenas de câmeras, gravadores DVR/NVR com armazenamento em nuvem e acesso remoto. Nossos técnicos são especializados em posicionamento estratégico de câmeras para máxima cobertura e segurança.",
    image: "service-cftv.jpg",
    icon: "Camera",
    benefits: [
      "Projeto personalizado para sua necessidade",
      "Equipamentos de alta qualidade com garantia",
      "Acesso remoto pelo celular (Android e iOS)",
      "Gravação em nuvem disponível",
      "Instalação profissional seguindo normas",
      "Garantia de 1 ano em equipamentos",
      "Suporte técnico incluso por 90 dias",
      "Manutenção preventiva disponível",
      "Câmeras com visão noturna infravermelha",
      "Detecção de movimento inteligente"
    ],
    includedServices: [
      "Projeto de sistema CFTV personalizado",
      "Instalação de câmeras IP PoE",
      "Instalação de câmeras analógicas HD",
      "Câmeras Wi-Fi residenciais",
      "Câmeras bullet (externas)",
      "Câmeras dome (internas)",
      "Câmeras PTZ (movimento 360°)",
      "Configuração de DVR/NVR",
      "Passagem de cabos estruturados (Cat5e/Cat6)",
      "Configuração de acesso remoto",
      "Integração com alarmes",
      "Backup em nuvem",
      "Câmeras com áudio bidirecional",
      "Câmeras com detecção facial",
      "Manutenção e limpeza de câmeras"
    ],
    process: [
      { step: 1, title: "Visita Técnica Gratuita", description: "Avaliamos o local e mapeamos os pontos estratégicos de instalação" },
      { step: 2, title: "Projeto Personalizado", description: "Elaboramos projeto com posicionamento ideal das câmeras" },
      { step: 3, title: "Orçamento Completo", description: "Apresentamos orçamento detalhado com todos os equipamentos" },
      { step: 4, title: "Aprovação e Agendamento", description: "Você aprova e agendamos a melhor data para instalação" },
      { step: 5, title: "Instalação Profissional", description: "Instalação seguindo normas técnicas e estéticas" },
      { step: 6, title: "Configuração Completa", description: "Configuramos acesso remoto no seu celular e treinamos você" },
      { step: 7, title: "Suporte Contínuo", description: "Oferecemos suporte técnico e manutenção preventiva" }
    ],
    pricing: [
      { name: "Kit 4 Câmeras Full HD", price: "A partir de R$ 1.200,00", description: "4 câmeras + DVR + HD 1TB + instalação" },
      { name: "Kit 8 Câmeras Full HD", price: "A partir de R$ 2.200,00", description: "8 câmeras + DVR + HD 2TB + instalação" },
      { name: "Kit 16 Câmeras Full HD", price: "A partir de R$ 4.000,00", description: "16 câmeras + DVR + HD 4TB + instalação" },
      { name: "Câmera Avulsa Instalada", price: "A partir de R$ 280,00", description: "Câmera + instalação + configuração" },
      { name: "Câmera Wi-Fi Instalada", price: "A partir de R$ 220,00", description: "Câmera Wi-Fi + configuração no app" },
      { name: "Manutenção Preventiva", price: "A partir de R$ 150,00", description: "Limpeza + verificação + ajustes" },
      { name: "Configuração Acesso Remoto", price: "R$ 100,00", description: "Configuração em até 3 dispositivos" },
      { name: "Troca de HD do DVR", price: "A partir de R$ 250,00", description: "HD 1TB + instalação" }
    ],
    faqs: [
      { question: "Quantas câmeras preciso para minha casa?", answer: "Depende do tamanho e layout do imóvel. Em média, casas térreas precisam de 4 a 6 câmeras para cobrir entradas, garagem, quintal e áreas comuns. Sobrados podem precisar de 6 a 10 câmeras. Fazemos visita técnica gratuita para dimensionar corretamente." },
      { question: "As câmeras gravam em HD ou Full HD?", answer: "Sim! Trabalhamos com câmeras de alta resolução: HD (720p), Full HD (1080p), 2K (1440p) e 4K (2160p). Recomendamos no mínimo Full HD para identificação clara de rostos e placas de veículos." },
      { question: "Consigo ver as câmeras pelo celular de qualquer lugar?", answer: "Sim! Configuramos acesso remoto para você assistir em tempo real e ver gravações pelo smartphone (Android/iOS), tablet ou computador, de qualquer lugar do mundo com internet. Funciona também fora do Brasil." },
      { question: "Preciso de internet para as câmeras funcionarem?", answer: "Para acesso remoto sim. Porém, o sistema grava localmente no DVR/NVR mesmo sem internet. Se a internet cair, você perde apenas o acesso remoto, mas continua gravando normalmente." },
      { question: "Quanto tempo de gravação o sistema armazena?", answer: "Depende do tamanho do HD e número de câmeras. Com HD de 1TB e 4 câmeras Full HD, você tem aproximadamente 15-20 dias de gravação. Com HD de 2TB, cerca de 30-40 dias. Também oferecemos backup em nuvem." },
      { question: "Vocês fazem manutenção em sistemas já instalados?", answer: "Sim! Fazemos manutenção e reparos em sistemas de CFTV de qualquer marca, mesmo que não tenha sido instalado por nós. Também atualizamos sistemas antigos para tecnologias mais modernas." },
      { question: "As câmeras funcionam à noite?", answer: "Sim! Todas as câmeras que instalamos possuem visão noturna infravermelha (IR), permitindo gravação mesmo em ambientes totalmente escuros. O alcance varia de 20 a 50 metros dependendo do modelo." }
    ],
    relatedServices: ["eletrica", "redes", "alarmes", "manutencao-predial"],
    keywords: ["instalação câmeras curitiba", "cftv curitiba", "câmeras de segurança", "dvr nvr intelbras", "monitoramento remoto", "câmeras residenciais comerciais"]
  },
  "eletrica": {
    slug: "eletrica",
    title: "Serviços Elétricos",
    metaTitle: "Eletricista Curitiba 24h | Serviços Elétricos Residenciais e Comerciais",
    metaDescription: "Eletricista em Curitiba com NR-10. Instalações elétricas, reparos, tomadas, disjuntores, iluminação, chuveiros. Residencial e comercial. Atendimento 24h. A partir de R$ 99,99.",
    subtitle: "Instalações elétricas seguras e profissionais",
    description: "Serviços elétricos residenciais e comerciais realizados por profissionais habilitados com NR-10. Instalações, reparos, manutenção preventiva e corretiva com segurança e garantia.",
    longDescription: "Conte com eletricistas qualificados e habilitados conforme NR-10 (Segurança em Instalações Elétricas) para todos os serviços elétricos em sua residência ou empresa. Realizamos desde pequenos reparos como troca de tomadas e interruptores até instalações completas, quadros de distribuição, aterramento e projetos elétricos. Trabalhamos com segurança e seguindo todas as normas técnicas da ABNT (NBR 5410). Utilizamos materiais de primeira qualidade de marcas como Pial Legrand, Schneider, Siemens e outras.",
    image: "service-eletrica.jpg",
    icon: "Zap",
    benefits: [
      "Profissionais com NR-10 e NR-35",
      "Materiais de primeira qualidade",
      "Seguimos normas ABNT NBR 5410",
      "Garantia em todos os serviços",
      "Atendimento de emergência disponível",
      "Orçamento gratuito sem compromisso",
      "Emissão de nota fiscal",
      "Projetos elétricos com ART",
      "Laudos e certificações"
    ],
    includedServices: [
      "Instalação de tomadas e interruptores",
      "Troca de disjuntores mono/bi/trifásicos",
      "Instalação de chuveiros elétricos",
      "Instalação de torneiras elétricas",
      "Quadros de distribuição",
      "Aterramento elétrico (SPDA)",
      "Instalação de iluminação LED",
      "Instalação de lustres e pendentes",
      "Troca de fiação antiga",
      "Instalação de ventiladores de teto",
      "Preparação elétrica para ar-condicionado",
      "Instalação de sensores de presença",
      "Instalação de portões elétricos",
      "Manutenção elétrica preventiva",
      "Laudos e projetos elétricos",
      "Aumento de carga junto à Copel"
    ],
    process: [
      { step: 1, title: "Solicitação", description: "Entre em contato descrevendo o serviço elétrico necessário" },
      { step: 2, title: "Avaliação Técnica", description: "Técnico avalia a situação e verifica as necessidades" },
      { step: 3, title: "Orçamento Detalhado", description: "Orçamento completo com materiais e mão de obra discriminados" },
      { step: 4, title: "Aprovação", description: "Você aprova e agendamos a execução" },
      { step: 5, title: "Execução Segura", description: "Serviço executado seguindo normas de segurança NR-10" },
      { step: 6, title: "Teste e Verificação", description: "Testes completos de funcionamento e segurança" },
      { step: 7, title: "Garantia por Escrito", description: "Garantia do serviço e nota fiscal" }
    ],
    pricing: [
      { name: "Visita técnica de inspeção", price: "R$ 99,99", description: "Inspeção da instalação (até 20 min)" },
      { name: "Instalação de Tomada", price: "A partir de R$ 60,00", description: "Tomada + espelho + instalação" },
      { name: "Instalação de Interruptor", price: "A partir de R$ 50,00", description: "Interruptor + instalação" },
      { name: "Instalação Chuveiro Elétrico", price: "A partir de R$ 120,00", description: "Instalação completa + disjuntor" },
      { name: "Troca de Disjuntor", price: "A partir de R$ 80,00", description: "Disjuntor + instalação" },
      { name: "Ponto de Iluminação Novo", price: "A partir de R$ 120,00", description: "Novo ponto de luz completo" },
      { name: "Instalação Ventilador Teto", price: "A partir de R$ 100,00", description: "Instalação completa" },
      { name: "Quadro de Distribuição", price: "A partir de R$ 500,00", description: "Quadro + disjuntores + montagem" },
      { name: "Aterramento (Haste)", price: "A partir de R$ 200,00", description: "Haste + cabo + instalação" }
    ],
    faqs: [
      { question: "Os eletricistas são realmente qualificados?", answer: "Sim! Todos os nossos eletricistas possuem curso NR-10 (Segurança em Instalações Elétricas), NR-35 (Trabalho em Altura) quando necessário, e experiência comprovada. Trabalhamos seguindo todas as normas da ABNT." },
      { question: "Vocês fazem instalação elétrica para ar-condicionado?", answer: "Fazemos toda a parte elétrica: ponto de energia dedicado, disjuntor exclusivo, fiação adequada e aterramento. A instalação do equipamento em si é feita por técnicos de refrigeração parceiros." },
      { question: "Atendem emergências elétricas 24h?", answer: "Sim! Temos atendimento de emergência para situações como falta de energia, curto-circuito, cheiro de queimado e outros problemas urgentes. O agendamento é feito via WhatsApp 24 horas." },
      { question: "Vocês fornecem os materiais elétricos?", answer: "Sim, fornecemos todos os materiais necessários de primeira qualidade (Pial Legrand, Schneider, Siemens). Você também pode fornecer os materiais se preferir, mas garantimos apenas a mão de obra nesse caso." },
      { question: "Fazem projetos elétricos e ART?", answer: "Sim! Elaboramos projetos elétricos para obras novas, reformas e regularização junto à Copel, com emissão de ART (Anotação de Responsabilidade Técnica) quando necessário." },
      { question: "Quanto custa para trocar toda a fiação de uma casa?", answer: "O valor varia conforme o tamanho da casa e quantidade de pontos. Em média, a troca de fiação de uma casa de 2-3 quartos custa entre R$ 2.000 e R$ 5.000. Fazemos orçamento detalhado após visita técnica." },
      { question: "Minha conta de luz está muito alta, vocês identificam o problema?", answer: "Sim! Fazemos análise da instalação elétrica para identificar possíveis problemas como fuga de corrente, equipamentos com defeito, fiação subdimensionada ou outros fatores que aumentam o consumo." }
    ],
    relatedServices: ["ar-condicionado", "cftv", "iluminacao", "manutencao-predial"],
    keywords: ["eletricista curitiba", "serviços elétricos", "instalação elétrica", "manutenção elétrica", "tomadas disjuntores", "eletricista 24h", "nr-10"]
  },
  "redes": {
    slug: "redes",
    title: "Redes e Wi-Fi",
    metaTitle: "Instalação de Redes e Wi-Fi Curitiba | Cabeamento Estruturado | Mesh",
    metaDescription: "Instalação de redes em Curitiba. Cabeamento estruturado Cat5e/Cat6, configuração Wi-Fi Mesh, roteadores profissionais. Residencial e empresarial. Técnico especializado 24h.",
    subtitle: "Conectividade profissional para sua casa ou empresa",
    description: "Instalação e configuração de redes com e sem fio. Cabeamento estruturado, roteadores profissionais, switches gerenciáveis, access points e sistemas Wi-Fi Mesh para cobertura total.",
    longDescription: "Garanta uma conexão de internet estável, rápida e sem quedas em todos os ambientes. Oferecemos soluções completas em infraestrutura de redes para residências e empresas, desde a instalação de um simples roteador Wi-Fi até projetos complexos de cabeamento estruturado com rack e certificação. Trabalhamos com as melhores marcas como TP-Link, Ubiquiti (UniFi), Intelbras, Cisco, MikroTik e outras. Somos especialistas em resolver problemas de Wi-Fi fraco, quedas de conexão, lentidão de internet e áreas sem sinal.",
    image: "service-redes.jpg",
    icon: "Wifi",
    benefits: [
      "Cobertura Wi-Fi em todos os ambientes",
      "Cabeamento organizado e certificado",
      "Velocidade máxima da sua internet",
      "Rede segura contra invasões",
      "Equipamentos de qualidade profissional",
      "Garantia de 1 ano",
      "Suporte técnico incluso",
      "Projeto personalizado",
      "Configuração de rede para trabalho remoto"
    ],
    includedServices: [
      "Instalação de roteadores Wi-Fi",
      "Configuração de Wi-Fi Dual Band (2.4GHz/5GHz)",
      "Sistemas Wi-Fi Mesh (cobertura total)",
      "Cabeamento estruturado Cat5e/Cat6/Cat6a",
      "Instalação de switches gerenciáveis",
      "Access Points profissionais (UniFi, Intelbras)",
      "Configuração de rede empresarial",
      "VPN para trabalho remoto",
      "Firewall e segurança de rede",
      "Repetidores de sinal",
      "Passagem de cabos em canaletas/conduítes",
      "Rack e organização de cabos",
      "Rede para câmeras (PoE)",
      "Configuração de impressoras em rede",
      "Diagnóstico de problemas de conexão"
    ],
    process: [
      { step: 1, title: "Análise do Ambiente", description: "Avaliamos o espaço e identificamos os problemas de conexão" },
      { step: 2, title: "Mapeamento de Sinal", description: "Medimos a intensidade do sinal Wi-Fi em todos os ambientes" },
      { step: 3, title: "Projeto de Rede", description: "Elaboramos projeto ideal para sua necessidade" },
      { step: 4, title: "Orçamento Detalhado", description: "Orçamento com todos os equipamentos e serviços" },
      { step: 5, title: "Instalação Profissional", description: "Instalação organizada e seguindo padrões técnicos" },
      { step: 6, title: "Configuração Completa", description: "Configuração de todos os dispositivos e segurança" },
      { step: 7, title: "Teste de Velocidade", description: "Teste de velocidade e cobertura em todos os pontos" }
    ],
    pricing: [
      { name: "Configuração de Roteador", price: "A partir de R$ 80,00", description: "Instalação + configuração + segurança" },
      { name: "Sistema Wi-Fi Mesh (2 unidades)", price: "A partir de R$ 600,00", description: "Kit mesh + instalação + configuração" },
      { name: "Sistema Wi-Fi Mesh (3 unidades)", price: "A partir de R$ 900,00", description: "Kit mesh + instalação + configuração" },
      { name: "Ponto de Rede Cat5e", price: "A partir de R$ 100,00", description: "Cabo + tomada RJ45 + acabamento" },
      { name: "Ponto de Rede Cat6", price: "A partir de R$ 130,00", description: "Cabo + tomada RJ45 + acabamento" },
      { name: "Rack Pequeno (6U)", price: "A partir de R$ 400,00", description: "Rack + organização + patch panel" },
      { name: "Access Point Profissional", price: "A partir de R$ 400,00", description: "AP + instalação + configuração" },
      { name: "Diagnóstico de Rede", price: "R$ 99,99", description: "Análise completa + relatório" }
    ],
    faqs: [
      { question: "O que é sistema Wi-Fi Mesh e por que é melhor?", answer: "É um sistema com múltiplos roteadores que trabalham juntos para criar uma rede única. Diferente de repetidores, o Mesh mantém a mesma velocidade em toda a casa e troca automaticamente de ponto conforme você se move, sem quedas ou travamentos." },
      { question: "Qual a diferença entre Cat5e, Cat6 e Cat6a?", answer: "Cat5e suporta até 1 Gbps (suficiente para maioria das residências). Cat6 suporta até 10 Gbps em até 55m. Cat6a suporta 10 Gbps em até 100m. Para residências recomendamos Cat5e ou Cat6. Para empresas, Cat6 ou Cat6a." },
      { question: "Vocês configuram a rede para ser segura?", answer: "Sim! Configuramos senhas fortes, criptografia WPA3, rede de visitantes separada, firewall, bloqueio de dispositivos desconhecidos e outras medidas de segurança. Também podemos configurar controle parental." },
      { question: "Atendem empresas com rede grande?", answer: "Sim! Temos experiência em projetos de rede corporativa com switches gerenciáveis, VLANs, VPN, controle de acesso, redes separadas para funcionários e visitantes, e integração com sistemas de TI." },
      { question: "Minha internet está lenta, vocês resolvem?", answer: "Fazemos diagnóstico completo para identificar se o problema é: no provedor (velocidade contratada), no roteador (equipamento antigo/defeituoso), na infraestrutura (fiação, interferência) ou na configuração. A maioria dos casos resolve com ajustes ou troca de equipamento." },
      { question: "Quanto custa para cabear uma casa toda?", answer: "Depende do número de pontos e complexidade da passagem de cabos. Em média, uma casa de 3 quartos com 8-10 pontos de rede custa entre R$ 800 e R$ 1.500 (incluindo cabos, tomadas e mão de obra). Fazemos orçamento após visita." },
      { question: "Vocês instalam roteadores de operadoras?", answer: "Sim, instalamos e configuramos roteadores de qualquer operadora (Vivo Fibra, Claro, Tim, Copel Telecom, etc.). Porém, recomendamos usar roteadores próprios de melhor qualidade para performance superior." },
      { question: "Vocês configuram impressoras em rede?", answer: "Sim, mas apenas como dispositivo de rede: IP fixo ou reserva no roteador, instalação do driver oficial nas estações, compartilhamento, digitalização em pasta de rede e impressão por Wi-Fi. Não fazemos reparo mecânico ou eletrônico da impressora — cabeça de impressão, tracionamento de papel, fusor, placa lógica ou fonte são encaminhados à assistência autorizada da marca." },
      { question: "Minha impressora some da rede toda hora. Isso vocês resolvem?", answer: "Sim. Na maioria dos casos a causa é endereço IP mudando por DHCP, roteador em faixa diferente, banda 5GHz incompatível com o modelo ou driver desatualizado. Corrigimos reservando o IP, ajustando a rede e reinstalando o driver oficial. Se o problema for hardware da impressora, informamos no laudo e não cobramos por reparo que não fazemos." },
      { question: "E outros periféricos, como scanners, NAS, câmeras IP e leitoras?", answer: "Atendemos na camada de rede e de configuração: endereçamento, descoberta na rede, permissões, acesso remoto, portas, PoE e drivers oficiais nas estações. Reparo físico ou eletrônico desses aparelhos está fora do escopo de redes." },
      { question: "O que exatamente está fora do serviço de redes?", answer: "Fora do escopo: reparo mecânico/eletrônico de impressoras e periféricos, recarga de toner e cartucho, suporte a bugs internos de softwares de terceiros, e garantia sobre a estabilidade do link contratado com a operadora. Nesses casos indicamos o caminho correto por escrito na triagem." }
    ],
    relatedServices: ["informatica", "cftv", "servidores", "impressoras"],
    keywords: ["instalação rede curitiba", "wi-fi curitiba", "cabeamento estruturado", "roteador mesh", "técnico em redes", "configuração wi-fi", "rede empresarial"]
  },
  "ar-condicionado": {
    slug: "ar-condicionado",
    title: "Ar-Condicionado",
    metaTitle: "Instalação de Ar-Condicionado Curitiba | Limpeza e Manutenção 24h",
    metaDescription: "Instalação de ar-condicionado em Curitiba. Limpeza, manutenção, recarga de gás. Split, janela, cassete. LG, Samsung, Midea. Técnico refrigerista certificado. A partir de R$ 120,00.",
    subtitle: "Climatização profissional para seu conforto",
    description: "Instalação, manutenção e limpeza de ar-condicionado. Atendemos todas as marcas e modelos. Split, janela, cassete, multi-split, piso-teto. Técnicos refrigeristas certificados.",
    longDescription: "Garanta o conforto térmico da sua casa ou empresa com nossos serviços especializados em ar-condicionado. Contamos com técnicos refrigeristas certificados e habilitados para instalação, manutenção preventiva e corretiva de aparelhos de todas as marcas como LG, Samsung, Midea, Springer, Carrier, Consul, Elgin, Daikin, Fujitsu e outras. Trabalhamos com splits (9.000 a 60.000 BTUs), janela, cassete, piso-teto, multi-split e VRF. Realizamos limpeza profissional com produtos bactericidas, recarga de gás (R-410A, R-22, R-32) e reparos em geral.",
    image: "service-arcondicionado.jpg",
    icon: "Wind",
    benefits: [
      "Técnicos refrigeristas certificados",
      "Atendemos todas as marcas e modelos",
      "Garantia de até 1 ano nos serviços",
      "Materiais e gás de qualidade",
      "Instalação seguindo normas ABNT",
      "Higienização profissional com bactericida",
      "Atendimento em domicílio e empresas",
      "Orçamento gratuito sem compromisso",
      "Desinstalação e reinstalação"
    ],
    includedServices: [
      "Instalação de split (todas as capacidades)",
      "Instalação de ar janela",
      "Instalação de cassete e piso-teto",
      "Instalação de multi-split",
      "Manutenção preventiva completa",
      "Limpeza e higienização profissional",
      "Recarga de gás refrigerante (R-410A, R-22, R-32)",
      "Troca de compressor",
      "Reparo de placa eletrônica",
      "Troca de motor ventilador",
      "Instalação de dutos e tubulação",
      "Desinstalação com recolhimento de gás",
      "Reinstalação em novo local",
      "Infraestrutura elétrica dedicada"
    ],
    process: [
      { step: 1, title: "Contato WhatsApp", description: "Descreva o serviço necessário via WhatsApp" },
      { step: 2, title: "Avaliação Inicial", description: "Técnico avalia o local e o equipamento" },
      { step: 3, title: "Orçamento Completo", description: "Orçamento detalhado com peças, gás e mão de obra" },
      { step: 4, title: "Agendamento", description: "Escolha o melhor dia e horário" },
      { step: 5, title: "Execução Profissional", description: "Serviço realizado por técnico certificado" },
      { step: 6, title: "Teste de Funcionamento", description: "Teste completo de refrigeração e orientações" },
      { step: 7, title: "Garantia", description: "Garantia por escrito e nota fiscal" }
    ],
    pricing: [
      { name: "Limpeza Split 9.000-12.000 BTUs", price: "A partir de R$ 120,00", description: "Limpeza completa + bactericida" },
      { name: "Limpeza Split 18.000-24.000 BTUs", price: "A partir de R$ 150,00", description: "Limpeza completa + bactericida" },
      { name: "Instalação Split 9.000 BTUs", price: "A partir de R$ 400,00", description: "Instalação até 3m de tubulação" },
      { name: "Instalação Split 12.000 BTUs", price: "A partir de R$ 450,00", description: "Instalação até 3m de tubulação" },
      { name: "Instalação Split 18.000 BTUs", price: "A partir de R$ 550,00", description: "Instalação até 4m de tubulação" },
      { name: "Instalação Split 24.000 BTUs", price: "A partir de R$ 650,00", description: "Instalação até 4m de tubulação" },
      { name: "Recarga de Gás R-410A", price: "A partir de R$ 280,00", description: "Gás + mão de obra" },
      { name: "Manutenção Preventiva", price: "A partir de R$ 150,00", description: "Limpeza + verificação completa" },
      { name: "Desinstalação", price: "A partir de R$ 200,00", description: "Retirada com recolhimento de gás" },
      { name: "Metro Adicional de Tubulação", price: "R$ 80,00", description: "Tubulação + instalação" }
    ],
    faqs: [
      { question: "Com que frequência devo limpar o ar-condicionado?", answer: "Recomendamos limpeza a cada 6 meses para uso residencial e a cada 3 meses para uso comercial ou em ambientes com muita poeira, fumantes ou animais de estimação. A limpeza regular aumenta a vida útil do aparelho e reduz o consumo de energia." },
      { question: "Vocês instalam ar-condicionado em apartamento?", answer: "Sim! Fazemos instalações em apartamentos, casas e estabelecimentos comerciais. Em apartamentos, verificamos as regras do condomínio e a viabilidade técnica antes de iniciar. Trabalhamos com discrição e limpeza." },
      { question: "Qual a diferença entre manutenção e limpeza?", answer: "A limpeza foca na higienização dos filtros, serpentina e bandeja (elimina fungos, bactérias e mau cheiro). A manutenção preventiva inclui limpeza + verificação de gás, parte elétrica, motor, compressor e funcionamento geral." },
      { question: "Como sei se meu ar precisa de gás?", answer: "Sinais de falta de gás: ar não gela adequadamente, formação de gelo na tubulação ou evaporadora, aumento do consumo de energia, compressor liga e desliga frequentemente. Fazemos diagnóstico para confirmar." },
      { question: "Vocês trabalham com todas as marcas?", answer: "Sim! Atendemos LG, Samsung, Midea, Springer/Carrier, Consul, Elgin, Fujitsu, Daikin, Hitachi, Komeco, Philco, Gree e todas as outras marcas do mercado brasileiro." },
      { question: "O que está incluído na instalação?", answer: "Instalação padrão inclui: fixação das unidades, tubulação de cobre (até a metragem especificada), cabos elétricos, dreno, vedação, vácuo na linha e teste de funcionamento. Não inclui: infraestrutura elétrica (disjuntor dedicado) e quebra de parede/forro." },
      { question: "Quanto tempo leva uma instalação?", answer: "Uma instalação padrão de split leva de 2 a 4 horas, dependendo da complexidade. Se precisar passar tubulação por longa distância ou fazer infraestrutura elétrica, pode levar um dia inteiro." }
    ],
    relatedServices: ["eletrica", "manutencao-predial", "refrigeracao"],
    keywords: ["instalação ar condicionado curitiba", "limpeza ar condicionado", "manutenção ar condicionado", "split curitiba", "refrigerista curitiba", "recarga gás ar condicionado"]
  },
  "celulares": {
    slug: "celulares",
    title: "Assistência Técnica Celulares",
    metaTitle: "Conserto de Celular Curitiba | Troca de Tela iPhone Samsung Xiaomi 24h",
    metaDescription: "Conserto de celular em Curitiba. Troca de tela, bateria, conector de carga. iPhone, Samsung, Motorola, Xiaomi. Atendimento rápido, peças de qualidade. A partir de R$ 99,99.",
    subtitle: "Reparo profissional para smartphones e tablets",
    description: "Assistência técnica especializada em celulares e tablets de todas as marcas. Troca de tela, bateria, conector de carga, alto-falante, câmera e muito mais. Peças de qualidade com garantia.",
    longDescription: "Oferecemos serviços completos de assistência técnica para smartphones e tablets de todas as marcas: iPhone (todos os modelos), Samsung Galaxy, Motorola, Xiaomi, LG, Asus Zenfone, Realme, Poco e outras. Nossa equipe é especializada em reparos de hardware e software, utilizando peças de qualidade original e compatível com garantia. Realizamos desde trocas simples de película até reparos complexos de placa com micro-soldagem. Atendimento rápido - muitos serviços são feitos no mesmo dia!",
    image: "service-celular.jpg",
    icon: "Smartphone",
    benefits: [
      "Atendimento rápido (muitos serviços no mesmo dia)",
      "Peças de qualidade com garantia",
      "Técnicos especializados em todas as marcas",
      "Diagnóstico em balcão por R$ 99,99, deduzido se aprovar o serviço",
      "Garantia de 90 dias a 1 ano",
      "Backup de dados antes do reparo",
      "Orçamento sem compromisso",
      "Atendimento em domicílio disponível"
    ],
    includedServices: [
      "Troca de tela/display original e compatível",
      "Troca de tela com função touch",
      "Substituição de bateria",
      "Troca de conector de carga",
      "Reparo de alto-falante auricular e viva-voz",
      "Troca de câmera frontal e traseira",
      "Reparo de microfone",
      "Troca de botões (power, volume, home)",
      "Troca de vidro traseiro (iPhone)",
      "Reparo de placa com micro-soldagem",
      "Remoção de vírus e malwares",
      "Recuperação de dados",
      "Atualização de software",
      "Desbloqueio de conta Google/Samsung",
      "Reparo de Face ID e Touch ID"
    ],
    process: [
      { step: 1, title: "Contato", description: "Descreva o problema do seu celular via WhatsApp" },
      { step: 2, title: "Diagnóstico Técnico", description: "Traga para diagnóstico (R$ 99,99, deduzido se aprovar) ou solicite coleta" },
      { step: 3, title: "Orçamento Detalhado", description: "Orçamento com opções de peças e valores" },
      { step: 4, title: "Aprovação", description: "Você aprova e iniciamos o reparo" },
      { step: 5, title: "Reparo Profissional", description: "Conserto realizado com peças de qualidade" },
      { step: 6, title: "Teste Completo", description: "Teste de todas as funções antes da entrega" },
      { step: 7, title: "Entrega com Garantia", description: "Celular entregue funcionando com garantia" }
    ],
    pricing: [
      { name: "Diagnóstico", price: "R$ 99,99", description: "Avaliação do problema em balcão, deduzida se aprovar o serviço" },
      { name: "Troca Tela iPhone 11", price: "A partir de R$ 280,00", description: "Display + instalação + garantia" },
      { name: "Troca Tela iPhone 12", price: "A partir de R$ 350,00", description: "Display + instalação + garantia" },
      { name: "Troca Tela iPhone 13", price: "A partir de R$ 400,00", description: "Display + instalação + garantia" },
      { name: "Troca Tela Samsung A", price: "A partir de R$ 180,00", description: "Display + instalação + garantia" },
      { name: "Troca Tela Samsung S", price: "A partir de R$ 350,00", description: "Display AMOLED + garantia" },
      { name: "Troca de Bateria iPhone", price: "A partir de R$ 120,00", description: "Bateria + instalação" },
      { name: "Troca de Bateria Samsung", price: "A partir de R$ 100,00", description: "Bateria + instalação" },
      { name: "Conector de Carga", price: "A partir de R$ 120,00", description: "Conector + mão de obra" },
      { name: "Troca de Câmera", price: "A partir de R$ 150,00", description: "Câmera + instalação" }
    ],
    faqs: [
      { question: "Quanto tempo leva para trocar a tela do celular?", answer: "A troca de tela geralmente leva de 30 minutos a 2 horas, dependendo do modelo. iPhones e Samsung Galaxy S podem levar mais tempo devido à complexidade. Na maioria dos casos, o serviço é feito no mesmo dia." },
      { question: "As peças são originais?", answer: "Trabalhamos com peças originais (quando disponíveis) e compatíveis de alta qualidade (AAA, Oled, Incell). Sempre informamos qual tipo de peça será utilizada e você escolhe conforme seu orçamento." },
      { question: "Vocês fazem backup dos dados antes do reparo?", answer: "Sim! Sempre que possível, orientamos sobre backup antes de qualquer procedimento. Se o celular ligar, fazemos backup dos dados em mídia externa ou nuvem antes do reparo." },
      { question: "Consertam iPhone?", answer: "Sim! Somos especializados em reparos de iPhone de todas as gerações: iPhone 6, 7, 8, X, XR, XS, 11, 12, 13, 14, 15 e SE. Troca de tela, bateria, conector, câmera, reparo de Face ID e muito mais." },
      { question: "Meu celular caiu na água, tem conserto?", answer: "Depende do dano causado pela água. Quanto antes trouxer, maiores as chances de recuperação. Fazemos limpeza ultrassônica (banho químico) para remover corrosão e tentamos recuperar o aparelho. Taxa de sucesso varia de 60-80%." },
      { question: "Vocês desbloqueiam celular com conta Google?", answer: "Sim, realizamos desbloqueio de conta Google (FRP) em aparelhos Samsung, Motorola, Xiaomi e outros. É necessário apresentar nota fiscal ou documento comprovando a propriedade do aparelho." },
      { question: "Consertam Xiaomi, Poco e Realme?", answer: "Sim! Trabalhamos com todas as marcas chinesas: Xiaomi (Redmi, Mi, Note), Poco, Realme, Oppo, OnePlus e outras. Temos peças em estoque para os modelos mais vendidos." }
    ],
    relatedServices: ["notebooks", "tablets", "games"],
    keywords: ["conserto celular curitiba", "troca tela iphone curitiba", "troca tela samsung", "assistência técnica celular", "reparo smartphone", "bateria celular", "conector carga"]
  },
  "games": {
    slug: "games",
    title: "Conserto de Videogames",
    metaTitle: "Conserto de Videogame Curitiba | PS4 PS5 Xbox Nintendo Switch 24h",
    metaDescription: "Conserto de videogame em Curitiba. PlayStation 4, PS5, Xbox One, Xbox Series, Nintendo Switch. Limpeza, troca HD, reparo HDMI. Técnico especializado. A partir de R$ 99,99.",
    subtitle: "Assistência técnica especializada em consoles",
    description: "Reparo profissional de videogames de todas as gerações: PlayStation 4, PlayStation 5, Xbox One, Xbox Series X/S, Nintendo Switch e consoles retrô. Limpeza, troca de HD/SSD, reparo de HDMI, troca de leitor e muito mais.",
    longDescription: "Somos especialistas em assistência técnica para videogames de todas as gerações. Realizamos reparos em PlayStation 4, PlayStation 5, Xbox One, Xbox Series X e S, Nintendo Switch, Nintendo 3DS e consoles retrô. Nossa equipe possui experiência em diagnóstico e reparo de problemas como superaquecimento, luz azul da morte (BLOD), erro de leitura de disco, porta HDMI danificada, controles com drift e muito mais. Utilizamos pasta térmica de alta performance (Arctic MX-4, Thermal Grizzly) e peças de qualidade com garantia.",
    image: "service-games.jpg",
    icon: "Gamepad2",
    benefits: [
      "Especialistas em todas as marcas e gerações",
      "Peças de reposição de qualidade",
      "Pasta térmica premium (Arctic, Thermal Grizzly)",
      "Diagnóstico detalhado com fotos",
      "Garantia de 90 dias nos reparos",
      "Atendimento rápido (maioria em 3-5 dias)",
      "Técnicos gamers que entendem sua urgência",
      "Orçamento gratuito",
      "Backup de saves quando possível"
    ],
    includedServices: [
      "Limpeza interna completa",
      "Troca de pasta térmica premium",
      "Troca de HD por SSD (PS4, PS5, Xbox)",
      "Reparo de porta HDMI",
      "Troca de leitor de disco (blu-ray)",
      "Reparo de fonte de alimentação",
      "Troca de ventoinhas/coolers",
      "Reparo de controles (drift, botões)",
      "Troca de bateria de controle",
      "Atualização de firmware",
      "Reparo de placa-mãe",
      "Troca de trilho Joy-Con (Switch)",
      "Reparo de slot de cartão (Switch)",
      "Reballing de chipsets",
      "Manutenção preventiva"
    ],
    process: [
      { step: 1, title: "Contato", description: "Descreva o problema do seu console via WhatsApp" },
      { step: 2, title: "Pré-avaliação", description: "Explicamos possíveis causas e estimativa" },
      { step: 3, title: "Coleta", description: "Atendimento exclusivamente com coleta no seu endereço — não temos balcão" },
      { step: 4, title: "Diagnóstico Técnico", description: "Avaliação completa com fotos do problema" },
      { step: 5, title: "Orçamento", description: "Orçamento detalhado via WhatsApp" },
      { step: 6, title: "Aprovação", description: "Você aprova e iniciamos o reparo" },
      { step: 7, title: "Reparo Especializado", description: "Conserto por técnico especializado" },
      { step: 8, title: "Teste Extensivo", description: "Teste de 24-48h antes da entrega" }
    ],
    pricing: [
      { name: "Diagnóstico", price: "R$ 99,99", description: "Taxa oficial de diagnóstico, deduzida se aprovar o serviço" },
      { name: "Limpeza + Pasta Térmica PS4", price: "A partir de R$ 150,00", description: "Limpeza completa + pasta Arctic" },
      { name: "Limpeza + Pasta Térmica PS5", price: "A partir de R$ 180,00", description: "Limpeza completa + pasta Arctic" },
      { name: "Limpeza + Pasta Térmica Xbox", price: "A partir de R$ 150,00", description: "Limpeza completa + pasta Arctic" },
      { name: "Troca HD por SSD 500GB", price: "A partir de R$ 350,00", description: "SSD + instalação + sistema" },
      { name: "Troca HD por SSD 1TB", price: "A partir de R$ 500,00", description: "SSD + instalação + sistema" },
      { name: "Reparo HDMI PS4/PS5", price: "A partir de R$ 200,00", description: "Porta HDMI + mão de obra" },
      { name: "Troca Leitor Blu-ray", price: "A partir de R$ 250,00", description: "Leitor + instalação" },
      { name: "Reparo Controle (Drift)", price: "A partir de R$ 80,00", description: "Analógico + mão de obra" },
      { name: "Reparo Joy-Con Switch", price: "A partir de R$ 100,00", description: "Analógico ou trilho" }
    ],
    faqs: [
      { question: "Meu PS4/PS5 está superaquecendo e desligando, o que pode ser?", answer: "Geralmente é acúmulo de poeira no cooler/dissipador ou pasta térmica ressecada. Recomendamos limpeza e troca de pasta térmica a cada 1-2 anos de uso intenso. Em alguns casos pode ser problema na ventoinha ou fonte." },
      { question: "Vocês consertam Nintendo Switch?", answer: "Sim! Fazemos reparos como troca de analógico dos Joy-Con (drift), reparo de trilho, troca de tela, bateria, conector de carga, reparo de slot de cartão e muito mais. Trabalhamos com Switch original, Lite e OLED." },
      { question: "Quanto tempo leva o reparo de um videogame?", answer: "Depende do problema: limpeza e troca de pasta térmica são feitos em 1-2 dias. Reparo de HDMI ou placa pode levar de 5 a 10 dias. Sempre informamos o prazo estimado no orçamento." },
      { question: "Consertam controles de videogame?", answer: "Sim! Fazemos reparos em controles de PS4 (DualShock 4), PS5 (DualSense), Xbox One, Xbox Series e Joy-Con. Trocamos analógicos, botões, baterias, triggers, bumpers e mais." },
      { question: "Vale a pena trocar o HD do PS4/Xbox por SSD?", answer: "Sim! O SSD reduz drasticamente o tempo de carregamento dos jogos (até 70% mais rápido) e do sistema. É um dos melhores upgrades que você pode fazer. No PS5, você pode adicionar SSD NVMe extra para mais espaço." },
      { question: "Meu console não lê disco, tem conserto?", answer: "Na maioria dos casos sim. Pode ser sujeira na lente (resolvido com limpeza), leitor desregulado (ajuste) ou leitor queimado (troca). Fazemos diagnóstico para identificar a causa exata." },
      { question: "Vocês consertam consoles antigos (PS3, Xbox 360)?", answer: "Sim! Consertamos consoles de gerações anteriores: PS3, Xbox 360, Wii, PS2 e outros. Porém, algumas peças podem ser mais difíceis de encontrar." }
    ],
    relatedServices: ["informatica", "pc-gamer", "celulares", "tvs"],
    keywords: ["conserto videogame curitiba", "reparo ps4 ps5 curitiba", "assistência xbox", "nintendo switch conserto", "troca pasta térmica console", "reparo hdmi videogame"]
  },
  "pc-gamer": {
    slug: "pc-gamer",
    title: "PC Gamer - Montagem e Manutenção",
    metaTitle: "Montagem de PC Gamer em Curitiba | Montagem, Configuração e Testes",
    metaDescription: "Monte seu PC Gamer em Curitiba com montagem, configuração de BIOS/UEFI, drivers oficiais e testes de memória, temperatura e estabilidade. Orçamento por escrito.",
    subtitle: "Montagem, configuração e testes com escopo por escrito",
    description: "Montagem de desktops e PCs para jogos com peças novas do cliente, configuração de BIOS/UEFI, drivers oficiais e checklist final de memória, temperatura, armazenamento e estabilidade.",
    longDescription: "Montamos desktops e PCs para jogos do zero, a partir de peças adquiridas pelo cliente ou fornecidas por ele, e também revisamos e atualizamos máquinas já montadas. O trabalho começa pela conferência de compatibilidade entre placa-mãe, processador, memória, armazenamento, gabinete e capacidade da fonte. Em seguida executamos a montagem física, a instalação do cooler (air cooler ou water cooler selado AIO), a organização dos cabos, a configuração de BIOS/UEFI dentro dos perfis oficiais do fabricante, a instalação do sistema com licença válida apresentada pelo cliente e a instalação de drivers oficiais. Antes da entrega rodamos o checklist de testes de memória, saúde do armazenamento, temperatura e estabilidade, e entregamos o laudo. Não fazemos overclock e não prometemos resultados de desempenho em jogos específicos: o compromisso é com a execução técnica e com os testes documentados em laudo.",
    image: "service-computer.jpg",
    icon: "Monitor",
    benefits: [
      "Montagem de desktop e PC para jogos do zero",
      "Aceitamos peças novas compradas pelo cliente, com comprovante",
      "Conferência de compatibilidade e da capacidade da fonte antes de montar",
      "Instalação de air cooler ou water cooler selado (AIO)",
      "Organização de cabos e fluxo de ar do gabinete",
      "BIOS/UEFI configurada apenas com perfis oficiais do fabricante",
      "Drivers baixados dos sites oficiais dos fabricantes",
      "Checklist final de memória, armazenamento, temperatura e estabilidade",
      "Laudo dos testes entregue junto com o equipamento"
    ],
    includedServices: [
      "Conferência de compatibilidade dos componentes",
      "Termo de recebimento das peças com fotos e número de série",
      "Montagem completa do PC",
      "Organização de cabos",
      "Instalação de air cooler / water cooler selado (AIO)",
      "Aplicação de pasta térmica",
      "Instalação do sistema com licença válida do cliente",
      "Instalação de drivers oficiais",
      "Configuração de BIOS/UEFI com perfis oficiais",
      "Teste de memória",
      "Teste de saúde do armazenamento (S.M.A.R.T.)",
      "Teste de temperatura em repouso e sob carga",
      "Teste de estabilidade sob carga contínua",
      "Upgrade de placa de vídeo",
      "Upgrade de processador",
      "Upgrade de memória RAM",
      "Troca de fonte e de gabinete"
    ],
    process: [
      { step: 1, title: "Levantamento", description: "Entendemos o uso pretendido e a lista de peças já compradas ou a comprar" },
      { step: 2, title: "Compatibilidade", description: "Conferimos soquete, chipset, memória, conectores, espaço do gabinete e capacidade da fonte" },
      { step: 3, title: "Recebimento das peças", description: "Registro em termo com marca, modelo, número de série e fotos do estado aparente" },
      { step: 4, title: "Montagem", description: "Montagem física, cooler, pasta térmica e organização de cabos" },
      { step: 5, title: "Configuração", description: "BIOS/UEFI com perfis oficiais, sistema com licença válida e drivers oficiais" },
      { step: 6, title: "Checklist de testes", description: "Memória, armazenamento, temperatura e estabilidade, com registro em laudo" },
      { step: 7, title: "Entrega", description: "Equipamento entregue com laudo, termo de retirada e garantia delimitada por escrito" }
    ],
    pricing: [
      { name: "Montagem completa", price: "Sob orçamento", description: "Montagem, cabos, configuração e checklist de testes" },
      { name: "Montagem com water cooler selado (AIO)", price: "Sob orçamento", description: "Inclui instalação do AIO" },
      { name: "Upgrade de placa de vídeo", price: "Sob orçamento", description: "Instalação, drivers oficiais e testes" },
      { name: "Upgrade de processador", price: "Sob orçamento", description: "Troca, pasta térmica e testes" },
      { name: "Upgrade de memória RAM", price: "Sob orçamento", description: "Instalação e perfil oficial de memória" },
      { name: "Limpeza e pasta térmica", price: "Sob orçamento", description: "Limpeza interna e reaplicação de pasta" },
      { name: "Organização de cabos", price: "Sob orçamento", description: "Revisão de cabos em PC já montado" }
    ],
    faqs: [
      { question: "Vocês montam desktop e PC Gamer do zero?", answer: "Sim. Montamos do zero com peças novas compradas pelo cliente ou fornecidas por ele, e também revisamos e atualizamos máquinas já montadas." },
      { question: "Posso levar as minhas peças para vocês montarem?", answer: "Pode. Aceitamos peças do cliente com nota ou comprovante de compra em nome dele. Cada item é registrado em termo de recebimento com marca, modelo, número de série e fotos do estado aparente." },
      { question: "E se uma peça minha estiver com defeito?", answer: "Devolvemos o item com o laudo dos testes executados. O acionamento da garantia é feito por você junto ao vendedor ou fabricante — não trocamos peças de terceiros. Enquanto isso, o equipamento aguarda em bancada por até 5 dias úteis." },
      { question: "Qual teste final é executado antes da entrega?", answer: "Teste de memória, leitura de saúde do armazenamento (S.M.A.R.T.), teste de temperatura em repouso e sob carga comparado aos limites do fabricante e teste de estabilidade sob carga contínua, além da conferência de portas, vídeo, rede e áudio. Tudo registrado em laudo." },
      { question: "Vocês fazem overclock?", answer: "Não. Trabalhamos apenas com perfis oficiais previstos pelo fabricante, sem ajuste manual de voltagem. Overclock feito por terceiros exclui a garantia da montagem e da configuração." },
      { question: "A garantia cobre a peça ou o serviço?", answer: "São garantias diferentes. A garantia da montagem cobre o serviço executado (encaixes, fixação, cabos, pasta térmica e cooler) e a da configuração cobre BIOS/UEFI, sistema e drivers instalados por nós, ambas com prazo registrado por escrito no comprovante de entrega. A garantia da peça é sempre do fabricante ou do vendedor." },
      { question: "Vocês atualizam a BIOS?", answer: "Somente com autorização por escrito do cliente e usando arquivo oficial do fabricante da placa-mãe, com o risco do procedimento informado antes." },
      { question: "Fazem manutenção em PC montado por outra loja?", answer: "Sim. Fazemos manutenção, limpeza, upgrade e revisão em qualquer PC, independentemente de onde foi montado." }
    ],
    relatedServices: ["informatica", "games", "notebooks"],
    keywords: ["montagem pc gamer curitiba", "montagem de computador curitiba", "upgrade pc gamer", "placa de vídeo curitiba", "water cooler instalação", "pc gamer personalizado"]
  },

  "impressoras": {
    slug: "impressoras",
    title: "Manutenção de Impressoras",
    metaTitle: "Conserto de Impressora Curitiba | Manutenção HP Epson Brother Canon 24h",
    metaDescription: "Conserto de impressora em Curitiba. HP, Epson, Brother, Canon, Samsung. Limpeza de cabeça, bulk ink, configuração em rede. Jato de tinta e laser. A partir de R$ 80,00.",
    subtitle: "Assistência técnica para impressoras e multifuncionais",
    description: "Manutenção e reparo de impressoras jato de tinta e laser de todas as marcas. Limpeza de cabeças de impressão, instalação de bulk ink, configuração em rede Wi-Fi.",
    longDescription: "Oferecemos serviços completos de manutenção para impressoras e multifuncionais de todas as marcas: HP, Epson, Brother, Canon, Samsung, Lexmark, Xerox e outras. Realizamos desde limpeza de cabeças de impressão entupidas até reparos complexos de mecanismo, instalação de sistemas de tinta contínua (bulk ink) e configuração em rede. Atendemos residências e empresas, com coleta e entrega disponível. O diagnóstico começa pela identificação do defeito real: entupimento de cabeçote e falha de jato em jato de tinta, desgaste de cilindro, fusor ou unidade de imagem em laser, arrasto de papel por roletes ressecados, erros de comunicação USB/Wi-Fi e falhas de driver após atualização do Windows. Fazemos limpeza física e química de cabeçotes, alinhamento e calibração de impressão, substituição de peças de tração, reset de contadores quando o fabricante permite, e instalação ou correção de sistemas de tinta contínua feitos fora de padrão — origem frequente de vazamento e borrão. Em ambiente empresarial configuramos a impressora em rede com IP fixo, compartilhamento por servidor de impressão, digitalização para pasta ou e-mail e controle de cópias por usuário. Antes de qualquer serviço você recebe o orçamento com o valor fechado e a decisão é sua: quando o custo do reparo não se justifica frente ao valor do equipamento, dizemos isso abertamente em vez de empurrar a troca de peça.",
    image: "service-computer.jpg",
    icon: "Printer",
    benefits: [
      "Atendemos todas as marcas e modelos",
      "Jato de tinta e laser",
      "Peças originais e compatíveis",
      "Configuração em rede (Wi-Fi e cabo)",
      "Atendimento em domicílio/empresa",
      "Garantia nos serviços",
      "Orçamento gratuito",
      "Suporte técnico"
    ],
    includedServices: [
      "Limpeza de cabeças de impressão",
      "Desentupimento de bicos",
      "Troca de cartuchos e toners",
      "Instalação de bulk ink (tanque)",
      "Reparo de mecanismo de papel",
      "Troca de rolete de alimentação",
      "Configuração Wi-Fi",
      "Instalação em rede",
      "Compartilhamento de impressora",
      "Troca de fusor (laser)",
      "Reparo de scanner",
      "Atualização de firmware",
      "Manutenção preventiva"
    ],
    process: [
      { step: 1, title: "Contato", description: "Informe marca, modelo e problema" },
      { step: 2, title: "Diagnóstico", description: "Avaliação técnica do equipamento" },
      { step: 3, title: "Orçamento", description: "Orçamento com peças e mão de obra" },
      { step: 4, title: "Aprovação", description: "Você aprova o serviço" },
      { step: 5, title: "Reparo", description: "Manutenção por técnico especializado" },
      { step: 6, title: "Teste", description: "Testes de impressão e digitalização" },
      { step: 7, title: "Entrega", description: "Equipamento funcionando com garantia" }
    ],
    pricing: [
      { name: "Limpeza de Cabeça", price: "A partir de R$ 80,00", description: "Limpeza química completa" },
      { name: "Configuração Wi-Fi", price: "A partir de R$ 60,00", description: "Configuração + teste" },
      { name: "Instalação em Rede", price: "A partir de R$ 80,00", description: "Compartilhamento + configuração" },
      { name: "Bulk Ink Epson", price: "A partir de R$ 250,00", description: "Sistema + instalação + tintas" },
      { name: "Bulk Ink HP", price: "A partir de R$ 200,00", description: "Sistema + instalação + tintas" },
      { name: "Troca de Fusor (Laser)", price: "A partir de R$ 250,00", description: "Fusor + instalação" },
      { name: "Troca de Rolete", price: "A partir de R$ 100,00", description: "Rolete + instalação" },
      { name: "Manutenção Geral", price: "A partir de R$ 150,00", description: "Limpeza + verificação completa" }
    ],
    faqs: [
      { question: "Minha impressora está com listras na impressão, o que pode ser?", answer: "Geralmente é entupimento das cabeças de impressão por falta de uso ou tinta de má qualidade. Uma limpeza profissional resolve na maioria dos casos. Em casos graves, pode ser necessário trocar a cabeça." },
      { question: "Vale a pena consertar impressora antiga?", answer: "Depende do custo do reparo versus valor de uma nova. Fazemos avaliação honesta e indicamos a melhor opção. Se o reparo custar mais de 50% do valor de uma nova, geralmente não recomendamos." },
      { question: "Vocês instalam bulk ink?", answer: "Sim! Instalamos sistemas de tinta contínua (bulk ink/tanque) em impressoras Epson e HP compatíveis. Reduz drasticamente o custo de impressão - ideal para quem imprime muito." },
      { question: "Atendem empresas com várias impressoras?", answer: "Sim! Oferecemos contratos de manutenção para empresas com múltiplas impressoras. Inclui visitas periódicas, limpeza preventiva e atendimento prioritário." },
      { question: "Configuram impressora em rede para vários computadores?", answer: "Sim! Configuramos impressoras para funcionar em rede local (cabo ou Wi-Fi), permitindo impressão de qualquer computador da rede. Também configuramos impressão via celular." }
    ],
    relatedServices: ["informatica", "redes", "servidores"],
    keywords: ["conserto impressora curitiba", "manutenção impressora", "limpeza cabeça impressão", "bulk ink curitiba", "configuração impressora rede", "impressora hp epson brother"]
  },
  "servidores": {
    slug: "servidores",
    title: "Servidores e Infraestrutura TI",
    metaTitle: "Manutenção de Servidores Curitiba | TI Empresarial e Suporte 24h",
    metaDescription: "Manutenção de servidores em Curitiba. Instalação, configuração, backup, virtualização. Windows Server, Linux. Suporte TI empresarial. Contrato mensal disponível.",
    subtitle: "Infraestrutura de TI para empresas",
    description: "Instalação, configuração e manutenção de servidores físicos e virtuais. Windows Server, Linux, Active Directory, virtualização VMware/Hyper-V, backup e disaster recovery.",
    longDescription: "Oferecemos soluções completas em infraestrutura de servidores para empresas de todos os portes. Nossa equipe de especialistas em TI realiza desde a instalação de servidores de arquivos simples até projetos complexos de virtualização, alta disponibilidade e disaster recovery. Trabalhamos com Windows Server (2016, 2019, 2022), Linux (Ubuntu Server, CentOS, Debian), VMware vSphere, Microsoft Hyper-V e soluções em nuvem (Azure, AWS, Google Cloud). Oferecemos contratos de suporte mensal com SLA garantido.",
    image: "service-computer.jpg",
    icon: "Server",
    benefits: [
      "Especialistas certificados Microsoft e Linux",
      "Suporte 24/7 para contratos",
      "Soluções escaláveis",
      "Backup e disaster recovery",
      "Virtualização VMware/Hyper-V",
      "Monitoramento proativo",
      "SLA personalizado",
      "Documentação completa"
    ],
    includedServices: [
      "Instalação de servidores físicos",
      "Configuração Windows Server",
      "Configuração Linux Server",
      "Active Directory e GPOs",
      "Virtualização VMware/Hyper-V",
      "Backup Veeam, Acronis",
      "Firewall pfSense, FortiGate",
      "VPN site-to-site e remota",
      "Servidor de arquivos",
      "Servidor de e-mail",
      "Monitoramento Zabbix, PRTG",
      "Disaster recovery",
      "Migração para nuvem",
      "Suporte remoto e presencial"
    ],
    process: [
      { step: 1, title: "Análise", description: "Levantamento das necessidades da empresa" },
      { step: 2, title: "Projeto", description: "Elaboração de projeto de infraestrutura" },
      { step: 3, title: "Proposta", description: "Proposta técnica e comercial detalhada" },
      { step: 4, title: "Aprovação", description: "Aprovação e cronograma de implementação" },
      { step: 5, title: "Implementação", description: "Instalação e configuração" },
      { step: 6, title: "Testes", description: "Testes de funcionamento e performance" },
      { step: 7, title: "Treinamento", description: "Treinamento da equipe" },
      { step: 8, title: "Suporte", description: "Suporte contínuo e monitoramento" }
    ],
    pricing: [
      { name: "Consultoria/Projeto", price: "A partir de R$ 200,00/h", description: "Análise e planejamento" },
      { name: "Instalação Servidor", price: "A partir de R$ 800,00", description: "Instalação + configuração básica" },
      { name: "Active Directory", price: "A partir de R$ 1.200,00", description: "AD + DNS + DHCP + GPOs" },
      { name: "Servidor de Arquivos", price: "A partir de R$ 600,00", description: "Configuração + permissões" },
      { name: "Backup Empresarial", price: "A partir de R$ 800,00", description: "Solução completa + automação" },
      { name: "Virtualização", price: "Sob consulta", description: "Projeto personalizado" },
      { name: "Suporte Mensal (5h)", price: "A partir de R$ 500,00/mês", description: "Suporte + monitoramento básico" },
      { name: "Suporte Mensal (10h)", price: "A partir de R$ 900,00/mês", description: "Suporte + monitoramento completo" }
    ],
    faqs: [
      { question: "Vocês atendem pequenas empresas?", answer: "Sim! Temos soluções para empresas de todos os portes, desde um servidor de arquivos simples para 5 usuários até infraestruturas complexas para centenas de usuários." },
      { question: "Oferecem suporte 24/7?", answer: "Para clientes com contrato de suporte, oferecemos atendimento de emergência 24 horas, 7 dias por semana. O tempo de resposta e cobertura dependem do plano contratado." },
      { question: "Trabalham com nuvem (Azure, AWS)?", answer: "Sim! Oferecemos migração de servidores para nuvem, configuração de ambientes híbridos, gestão de custos e otimização de recursos em Azure, AWS e Google Cloud." },
      { question: "Fazem backup em nuvem?", answer: "Sim! Implementamos soluções de backup local (NAS, fitas) e em nuvem (Azure Backup, AWS, Backblaze), garantindo a segurança dos dados da empresa com múltiplas cópias." },
      { question: "Qual o tempo de resposta para emergências?", answer: "Para clientes com contrato, o tempo de resposta varia de 30 minutos a 4 horas dependendo da severidade e plano contratado. Para atendimentos avulsos, agendamos conforme disponibilidade." }
    ],
    relatedServices: ["redes", "informatica", "cftv", "backup"],
    keywords: ["servidor curitiba", "windows server", "linux servidor", "ti empresarial", "suporte ti", "virtualização", "backup empresarial"]
  },
  "manutencao-predial": {
    slug: "manutencao-predial",
    title: "Manutenção Predial",
    metaTitle: "Manutenção Predial Curitiba | Serviços para Condomínios e Empresas 24h",
    metaDescription: "Manutenção predial em Curitiba. Elétrica, hidráulica, pintura, reparos gerais. Condomínios e empresas. Contrato mensal ou avulso. Orçamento grátis.",
    subtitle: "Soluções completas para seu condomínio ou empresa",
    description: "Serviços de manutenção predial para condomínios residenciais, comerciais e empresas. Elétrica, hidráulica, pintura, pequenos reparos, limpeza de caixa d'água e muito mais.",
    longDescription: "Oferecemos serviços completos de manutenção predial para condomínios residenciais, comerciais e empresas. Nossa equipe multidisciplinar atua em elétrica, hidráulica, pintura, pequenos reparos, jardinagem, limpeza técnica e outras necessidades do dia a dia de um edifício. Disponibilizamos contratos mensais com atendimento programado, visitas semanais ou quinzenais, além de atendimento de emergências. Ideal para síndicos e administradores que precisam de um parceiro confiável.",
    image: "service-eletrica.jpg",
    icon: "Building",
    benefits: [
      "Equipe multidisciplinar",
      "Contrato mensal flexível",
      "Atendimento programado",
      "Emergências 24h para contratos",
      "Relatórios de manutenção",
      "Preços competitivos",
      "Profissionais uniformizados e identificados",
      "Garantia nos serviços",
      "Suporte ao síndico"
    ],
    includedServices: [
      "Manutenção elétrica predial",
      "Manutenção hidráulica",
      "Pintura e reparos",
      "Manutenção de bombas",
      "Limpeza de caixa d'água",
      "Limpeza de calhas",
      "Manutenção de portões automáticos",
      "Manutenção de interfones",
      "Jardinagem básica",
      "Desentupimento",
      "Pequenos reparos gerais",
      "Limpeza pós-obra",
      "Troca de lâmpadas áreas comuns"
    ],
    process: [
      { step: 1, title: "Visita Técnica", description: "Visita para avaliação do condomínio/empresa" },
      { step: 2, title: "Diagnóstico", description: "Levantamento das necessidades" },
      { step: 3, title: "Proposta", description: "Proposta de contrato ou serviço avulso" },
      { step: 4, title: "Contratação", description: "Assinatura de contrato ou aprovação" },
      { step: 5, title: "Execução", description: "Serviços realizados conforme cronograma" },
      { step: 6, title: "Relatório", description: "Relatório mensal de manutenções" },
      { step: 7, title: "Acompanhamento", description: "Reuniões periódicas com síndico" }
    ],
    pricing: [
      { name: "Contrato Básico", price: "A partir de R$ 800,00/mês", description: "4 visitas/mês + emergências" },
      { name: "Contrato Completo", price: "A partir de R$ 1.500,00/mês", description: "8 visitas/mês + materiais básicos" },
      { name: "Visita Avulsa", price: "A partir de R$ 150,00", description: "Atendimento pontual" },
      { name: "Emergência", price: "A partir de R$ 200,00", description: "Atendimento urgente" },
      { name: "Limpeza Caixa D'água", price: "A partir de R$ 250,00", description: "Até 1000L + certificado" },
      { name: "Desentupimento", price: "A partir de R$ 150,00", description: "Desentupimento simples" },
      { name: "Pintura (m²)", price: "A partir de R$ 25,00/m²", description: "Tinta + mão de obra" }
    ],
    faqs: [
      { question: "Vocês atendem condomínios de qualquer tamanho?", answer: "Sim! Atendemos desde pequenos condomínios (4-10 unidades) até grandes empreendimentos. O valor do contrato é proporcional ao tamanho e demanda do condomínio." },
      { question: "Como funciona o contrato mensal?", answer: "O contrato inclui visitas programadas (semanal, quinzenal ou mensal), atendimento de emergências prioritário e relatórios de serviços. Materiais podem ser incluídos ou cobrados à parte." },
      { question: "Atendem emergências fora do horário?", answer: "Clientes com contrato têm atendimento prioritário para emergências, inclusive fora do horário comercial. Para avulsos, verificamos disponibilidade." },
      { question: "Fazem manutenção de elevadores?", answer: "Não fazemos manutenção de elevadores diretamente, mas temos parceria com empresa especializada e podemos intermediar o serviço." },
      { question: "Emitem relatórios para prestação de contas?", answer: "Sim! Fornecemos relatórios mensais detalhados de todos os serviços realizados, com fotos antes/depois. Ideal para prestação de contas em assembleias." }
    ],
    relatedServices: ["eletrica", "ar-condicionado", "cftv", "redes"],
    keywords: ["manutenção predial curitiba", "manutenção condomínio", "serviços prediais", "zelador", "síndico", "facilities"]
  },
  "servicos-gerais": {
    slug: "servicos-gerais",
    title: "Serviços Gerais - Marido de Aluguel",
    metaTitle: "Marido de Aluguel Curitiba | Serviços Gerais e Pequenos Reparos 24h",
    metaDescription: "Marido de aluguel em Curitiba. Montagem de móveis, pequenos reparos, hidráulica básica, fixação de TV, instalação de prateleiras. A partir de R$ 80,00/hora.",
    subtitle: "Pequenos reparos e serviços para sua casa",
    description: "Serviços gerais e pequenos reparos residenciais. Montagem de móveis, hidráulica básica, fixação de objetos, instalação de acessórios. Marido de aluguel profissional e pontual.",
    longDescription: "Precisa de ajuda com pequenos reparos e serviços domésticos? Nossa equipe de profissionais realiza diversos serviços gerais como montagem de móveis de todas as lojas, instalação de prateleiras e nichos, fixação de TVs na parede, hidráulica básica (torneiras, sifões, flexíveis), troca de fechaduras, instalação de varais, cortinas, e muito mais. Serviço de 'marido de aluguel' com qualidade, pontualidade e preço justo. Atendemos residências em Curitiba e Região Metropolitana.",
    image: "service-eletrica.jpg",
    icon: "Wrench",
    benefits: [
      "Profissionais experientes",
      "Ferramentas próprias completas",
      "Atendimento rápido",
      "Preço justo e transparente",
      "Garantia nos serviços",
      "Pontualidade",
      "Limpeza após o serviço",
      "Orçamento sem compromisso"
    ],
    includedServices: [
      "Montagem de móveis (todas as lojas)",
      "Instalação de prateleiras e nichos",
      "Fixação de TVs na parede",
      "Instalação de suportes",
      "Troca de torneiras e sifões",
      "Instalação de flexíveis",
      "Regulagem de válvula de descarga",
      "Instalação de cortinas e persianas",
      "Troca de fechaduras",
      "Instalação de varais",
      "Fixação de quadros e espelhos",
      "Instalação de acessórios de banheiro",
      "Pequenos reparos em geral",
      "Furação em concreto/alvenaria"
    ],
    process: [
      { step: 1, title: "Contato", description: "Descreva o serviço necessário via WhatsApp" },
      { step: 2, title: "Orçamento", description: "Orçamento rápido por WhatsApp ou telefone" },
      { step: 3, title: "Agendamento", description: "Escolha o melhor dia e horário" },
      { step: 4, title: "Execução", description: "Profissional realiza o serviço" },
      { step: 5, title: "Conferência", description: "Você confere e aprova o trabalho" },
      { step: 6, title: "Pagamento", description: "Pagamento após conclusão" }
    ],
    pricing: [
      { name: "Hora Técnica", price: "A partir de R$ 80,00/h", description: "Serviços diversos (mín. 1h)" },
      { name: "Montagem Móvel Simples", price: "A partir de R$ 60,00", description: "Criado-mudo, estante pequena" },
      { name: "Montagem Guarda-Roupa", price: "A partir de R$ 150,00", description: "Guarda-roupa 4-6 portas" },
      { name: "Montagem Cama Box", price: "A partir de R$ 60,00", description: "Cama box casal/solteiro" },
      { name: "Fixação de TV até 55", price: "A partir de R$ 100,00", description: "Suporte + instalação" },
      { name: "Fixação de TV 56+", price: "A partir de R$ 150,00", description: "Suporte + instalação" },
      { name: "Troca de Torneira", price: "A partir de R$ 60,00", description: "Mão de obra" },
      { name: "Instalação Prateleiras (3un)", price: "A partir de R$ 100,00", description: "Furação + instalação" },
      { name: "Instalação Cortina/Persiana", price: "A partir de R$ 80,00", description: "Suporte + instalação" }
    ],
    faqs: [
      { question: "Vocês trazem as ferramentas necessárias?", answer: "Sim! Nossos profissionais vão equipados com todas as ferramentas necessárias: furadeira, parafusadeira, nível, trena, chaves, brocas para concreto e madeira, etc." },
      { question: "Fornecem os materiais (parafusos, buchas)?", answer: "Fornecemos materiais básicos como parafusos, buchas e fitas. Materiais específicos como torneiras, fechaduras, suportes de TV devem ser providenciados pelo cliente ou compramos com acréscimo." },
      { question: "Montam móveis de qualquer loja?", answer: "Sim! Montamos móveis de todas as lojas: IKEA, Tok&Stok, Madesa, Mpozenato, Casas Bahia, Magazine Luiza, Leroy Merlin, e qualquer outra." },
      { question: "Qual o tempo mínimo de serviço?", answer: "O tempo mínimo é de 1 hora. Serviços rápidos (menos de 1 hora) são cobrados pela hora mínima. Isso porque há o deslocamento até o local." },
      { question: "Atendem aos finais de semana?", answer: "Sim! Atendemos de segunda a sábado em horário comercial. Domingos e feriados sob consulta, com acréscimo de 50% no valor." },
      { question: "O que vocês NÃO fazem?", answer: "Não fazemos serviços que exigem habilitação específica como elétrica complexa (quadros, fiação), hidráulica pesada (encanamento), obras civis, pintura de grande porte. Para esses serviços, indicamos profissionais parceiros." }
    ],
    relatedServices: ["eletrica", "manutencao-predial", "ar-condicionado"],
    keywords: ["marido de aluguel curitiba", "serviços gerais", "montagem móveis", "pequenos reparos", "instalação prateleiras", "fixação tv parede", "faz tudo"]
  },
  "tvs": {
    slug: "tvs",
    title: "Conserto de TVs e Eletrônicos",
    metaTitle: "Conserto de TV Curitiba | Smart TV LED LCD Samsung LG Sony 24h",
    metaDescription: "Conserto de TV em Curitiba. Smart TV, LED, LCD, OLED. Samsung, LG, Sony, Philips, TCL. Reparo de imagem, som, placa. Técnico especializado. A partir de R$ 99,99.",
    subtitle: "Assistência técnica especializada em televisores",
    description: "Reparo de TVs de todas as marcas e tecnologias. Smart TV, LED, LCD, OLED, QLED. Problemas de imagem, som, placa-mãe, fonte. Samsung, LG, Sony, Philips, TCL, AOC.",
    longDescription: "Consertamos televisores de todas as marcas e tamanhos: Samsung, LG, Sony, Philips, Panasonic, TCL, AOC, Philco, Semp, Hisense e outras. Trabalhamos com todas as tecnologias: Smart TV, LED, LCD, OLED, QLED, 4K, 8K. Realizamos reparos de imagem (listras, manchas, sem imagem), som (sem áudio, chiado), placa-mãe, placa de fonte, backlight, T-Con e muito mais. Atendimento em domicílio ou coleta/entrega. A avaliação separa o que é sintoma do que é causa: tela acesa sem imagem geralmente aponta para T-Con ou cabo de LVDS; imagem escura que aparece só com lanterna indica backlight com LEDs abertos; desligamento sozinho e clique repetido costumam vir da placa de fonte com capacitores estufados; travamento em logo, aplicativos que não abrem e perda de Wi-Fi pedem atualização de firmware ou reparo da placa principal. Testamos alimentação, tensões da fonte, barras de LED e sinal antes de indicar qualquer peça, e informamos o custo antes de executar. Também resolvemos problemas de uso que não exigem reparo: sintonia e canais digitais, HDMI/ARC com receiver e soundbar, controle universal, espelhamento de celular, contas de streaming e fixação segura em parede com suporte compatível com o peso e o padrão VESA do aparelho. Painel trincado ou com mancha interna não tem reparo viável: nesses casos apresentamos o diagnóstico por escrito e não cobramos por um serviço que não resolveria.",
    image: "service-computer.jpg",
    icon: "Tv",
    benefits: [
      "Técnicos especializados em TVs",
      "Atendemos todas as marcas",
      "Reparo em domicílio disponível",
      "Diagnóstico detalhado",
      "Peças originais e compatíveis",
      "Garantia de 90 dias",
      "Orçamento sem compromisso",
      "Coleta e entrega disponível"
    ],
    includedServices: [
      "Reparo de imagem (listras, manchas)",
      "Conserto de backlight/LED",
      "Reparo de placa-mãe",
      "Troca de placa de fonte",
      "Reparo de placa T-Con",
      "Conserto de áudio",
      "Atualização de firmware",
      "Configuração de Smart TV",
      "Instalação de apps",
      "Configuração de internet Wi-Fi",
      "Reparo de conector HDMI",
      "Troca de tela (quando viável)"
    ],
    process: [
      { step: 1, title: "Contato", description: "Informe marca, modelo e sintoma do problema" },
      { step: 2, title: "Pré-diagnóstico", description: "Avaliação inicial do problema" },
      { step: 3, title: "Coleta/Visita", description: "Coletamos a TV ou vamos até você" },
      { step: 4, title: "Diagnóstico", description: "Diagnóstico completo em bancada" },
      { step: 5, title: "Orçamento", description: "Orçamento detalhado" },
      { step: 6, title: "Aprovação", description: "Você aprova o serviço" },
      { step: 7, title: "Reparo", description: "Conserto por técnico especializado" },
      { step: 8, title: "Entrega", description: "TV entregue funcionando" }
    ],
    pricing: [
      { name: "Diagnóstico", price: "R$ 99,99", description: "Avaliação completa" },
      { name: "Reparo de Fonte", price: "A partir de R$ 200,00", description: "Componentes + mão de obra" },
      { name: "Reparo Backlight", price: "A partir de R$ 250,00", description: "LEDs + mão de obra" },
      { name: "Reparo Placa-Mãe", price: "A partir de R$ 300,00", description: "Componentes + mão de obra" },
      { name: "Troca T-Con", price: "A partir de R$ 250,00", description: "Placa + instalação" },
      { name: "Atualização Smart TV", price: "A partir de R$ 80,00", description: "Firmware + apps" },
      { name: "Coleta e entrega personalizada", price: "A partir de R$ 299,99", description: "Conforme distância, equipamento e complexidade" }
    ],
    faqs: [
      { question: "Minha TV não liga, tem conserto?", answer: "Na maioria dos casos sim. Pode ser problema na fonte (mais comum), placa-mãe ou capacitores. Fazemos diagnóstico para identificar a causa exata." },
      { question: "TV com listras ou manchas na tela tem conserto?", answer: "Depende da causa. Se for problema na placa T-Con ou conexões, sim. Se for defeito no painel (tela), geralmente o custo de troca não compensa." },
      { question: "Vocês consertam TV com tela quebrada?", answer: "Tecnicamente sim, mas o custo da tela geralmente não compensa. Uma tela de 50 polegadas pode custar mais que uma TV nova. Avaliamos cada caso." },
      { question: "Fazem conserto em domicílio?", answer: "Sim, para diagnóstico e reparos simples. Reparos complexos que exigem desmontagem completa são feitos em bancada (coletamos e entregamos)." },
      { question: "Consertam TV de tubo antiga?", answer: "Infelizmente não trabalhamos mais com TVs de tubo (CRT). Apenas TVs de tela plana (LED, LCD, OLED, QLED)." }
    ],
    relatedServices: ["games", "informatica", "eletrica"],
    keywords: ["conserto tv curitiba", "reparo smart tv", "assistência técnica tv", "tv não liga", "tv sem imagem", "conserto samsung lg sony"]
  },
  "recuperacao-dados": {
    slug: "recuperacao-dados",
    title: "Recuperação de Dados",
    metaTitle: "Recuperação de Dados Curitiba | HD SSD Pen Drive Cartão de Memória 24h",
    metaDescription: "Recuperação de dados em Curitiba. HD danificado, SSD, pen drive, cartão de memória. Fotos, documentos, vídeos. Diagnóstico por R$ 99,99. Sigilo total.",
    subtitle: "Seus arquivos importantes de volta",
    description: "Recuperamos dados de HDs, SSDs, pen drives, cartões de memória e celulares. Fotos, vídeos, documentos, bancos de dados. Diagnóstico por R$ 99,99 (deduzido se aprovar) e sigilo total.",
    longDescription: "Perdeu arquivos importantes? Oferecemos serviços especializados de recuperação de dados para diversos dispositivos de armazenamento: HDs externos e internos, SSDs, pen drives, cartões de memória (SD, microSD, CF), celulares e tablets. Recuperamos fotos, vídeos, documentos, planilhas, bancos de dados e outros arquivos perdidos por exclusão acidental, formatação, vírus, falha mecânica ou corrupção. Trabalhamos com total sigilo e discrição. Em muitos casos conseguimos recuperar até 100% dos dados.",
    image: "service-computer.jpg",
    icon: "HardDrive",
    benefits: [
      "Diagnóstico por R$ 99,99, deduzido se aprovar o serviço",
      "Alta taxa de sucesso (80-95%)",
      "Sigilo total garantido",
      "Só cobra se recuperar",
      "Todos os tipos de mídia",
      "Laboratório especializado",
      "Orçamento transparente",
      "Entrega em mídia nova"
    ],
    includedServices: [
      "Recuperação de HD interno/externo",
      "Recuperação de SSD",
      "Recuperação de pen drive",
      "Recuperação de cartão SD/microSD",
      "Recuperação de RAID",
      "Recuperação de servidor",
      "Recuperação após formatação",
      "Recuperação de arquivos deletados",
      "Recuperação após vírus/ransomware",
      "Recuperação de fotos e vídeos",
      "Recuperação de banco de dados",
      "Clonagem de disco"
    ],
    process: [
      { step: 1, title: "Contato", description: "Descreva o problema e tipo de mídia" },
      { step: 2, title: "Entrega", description: "Traga ou envie a mídia para análise" },
      { step: 3, title: "Diagnóstico Técnico", description: "Avaliamos a mídia e a possibilidade de recuperação (R$ 99,99, deduzido se aprovar)" },
      { step: 4, title: "Orçamento", description: "Orçamento baseado na complexidade" },
      { step: 5, title: "Aprovação", description: "Você aprova apenas se quiser prosseguir" },
      { step: 6, title: "Recuperação", description: "Processo de recuperação dos dados" },
      { step: 7, title: "Validação", description: "Você valida os arquivos recuperados" },
      { step: 8, title: "Entrega", description: "Dados entregues em mídia nova" }
    ],
    pricing: [
      { name: "Diagnóstico", price: "R$ 99,99", description: "Avaliação da mídia, deduzido se aprovar o serviço" },
      { name: "Recuperação Lógica Simples", price: "A partir de R$ 200,00", description: "Arquivos deletados/formatação rápida" },
      { name: "Recuperação Lógica Complexa", price: "A partir de R$ 400,00", description: "Formatação completa/corrupção" },
      { name: "Recuperação HD com Falha", price: "A partir de R$ 600,00", description: "HD com bad blocks/cliques" },
      { name: "Recuperação SSD", price: "A partir de R$ 500,00", description: "SSD com falha" },
      { name: "Recuperação Pen Drive", price: "A partir de R$ 150,00", description: "Pen drive danificado" },
      { name: "Recuperação Cartão SD", price: "A partir de R$ 150,00", description: "Cartão corrompido" }
    ],
    faqs: [
      { question: "Vocês cobram se não conseguirem recuperar?", answer: "Na maioria dos casos, não. Cobramos apenas se conseguirmos recuperar uma quantidade significativa dos dados desejados. Casos que exigem peças ou procedimentos especiais podem ter taxa de tentativa." },
      { question: "Qual a taxa de sucesso na recuperação?", answer: "Nossa taxa de sucesso varia de 80% a 95% dependendo do tipo de problema. Problemas lógicos (formatação, exclusão) têm taxa maior. Problemas físicos graves (cabeça de leitura queimada) têm taxa menor." },
      { question: "Vocês abrem o HD em sala limpa?", answer: "Temos parceria com laboratório especializado para casos que exigem abertura do HD em ambiente controlado (sala limpa). Esses casos têm custo mais elevado." },
      { question: "Recuperam dados de celular?", answer: "Sim, em alguns casos. Se o celular liga e conseguimos acessar a memória, é possível recuperar fotos, contatos e outros dados. Celulares que não ligam têm possibilidade limitada." },
      { question: "Os dados ficam sigilosos?", answer: "Absoluto sigilo! Não acessamos, copiamos ou divulgamos nenhum conteúdo dos arquivos recuperados. Após a entrega, deletamos todas as cópias de nossos sistemas." }
    ],
    relatedServices: ["informatica", "notebooks", "servidores"],
    keywords: ["recuperação de dados curitiba", "recuperar hd", "recuperar arquivos deletados", "recuperar pen drive", "recuperação ssd", "dados perdidos"]
  },
  "macbook": {
    slug: "macbook",
    title: "Assistência Técnica MacBook e Apple",
    metaTitle: "Conserto de MacBook Curitiba | Assistência Apple Especializada 24h",
    metaDescription: "Conserto de MacBook em Curitiba. MacBook Air, Pro, iMac. Reparo de placa lógica, troca de tela, bateria, teclado. Reballing BGA. Técnicos especializados Apple.",
    subtitle: "Especialistas em produtos Apple",
    description: "Assistência técnica especializada em MacBook Air, MacBook Pro, iMac e Mac Mini. Reparo de placa lógica com reballing BGA, troca de tela Retina, bateria, teclado, SSD. Economize até 70% comparado à Apple.",
    longDescription: "Somos especialistas em reparo de produtos Apple. Nossa equipe possui conhecimento avançado em diagnóstico e reparo de MacBook Air, MacBook Pro (todas as gerações), iMac, Mac Mini e Mac Pro. Realizamos reparos de alta complexidade como reparo de placa lógica com reballing BGA, micro-soldagem de chips, recuperação de equipamentos com dano líquido (desoxidação), além de serviços como troca de tela Retina, bateria, teclado (incluindo problema de teclas colando), SSD e muito mais. Economize até 70% comparado aos valores da Apple Store.",
    image: "service-notebook.jpg",
    icon: "Laptop",
    benefits: [
      "Especialistas em produtos Apple",
      "Reballing BGA certificado",
      "Micro-soldagem de precisão",
      "Economia de até 70%",
      "Peças originais e OEM",
      "Diagnóstico detalhado",
      "Garantia de até 6 meses",
      "Preservação de dados"
    ],
    includedServices: [
      "Reparo de placa lógica (Logic Board)",
      "Reballing BGA de chipsets",
      "Recuperação de chip T2",
      "Desoxidação (dano líquido)",
      "Troca de tela Retina",
      "Reparo Flexgate (iluminação)",
      "Troca de teclado butterfly/magic",
      "Troca de topcase",
      "Troca de bateria",
      "Upgrade/troca de SSD",
      "Reparo de trackpad",
      "Reparo de Touch Bar",
      "Recuperação de dados"
    ],
    process: [
      { step: 1, title: "Contato", description: "Descreva o problema do seu Mac" },
      { step: 2, title: "Avaliação Inicial", description: "Avaliamos remotamente a gravidade" },
      { step: 3, title: "Entrega", description: "Traga ou enviamos coleta" },
      { step: 4, title: "Diagnóstico Avançado", description: "Análise com equipamentos especializados" },
      { step: 5, title: "Orçamento", description: "Orçamento detalhado com fotos" },
      { step: 6, title: "Aprovação", description: "Você aprova o reparo" },
      { step: 7, title: "Reparo Especializado", description: "Reparo por técnico Apple" },
      { step: 8, title: "Teste 24-48h", description: "Teste extensivo antes da entrega" }
    ],
    pricing: [
      { name: "Diagnóstico", price: "A partir de R$ 99,99", description: "Análise completa com microscópio" },
      { name: "Reparo Placa Lógica", price: "A partir de R$ 500,00", description: "Reballing/micro-soldagem" },
      { name: "Desoxidação Completa", price: "A partir de R$ 400,00", description: "Banho ultrassônico + reparo" },
      { name: "Troca de Tela Retina", price: "A partir de R$ 1.200,00", description: "Tela original/OEM + instalação" },
      { name: "Troca de Bateria", price: "A partir de R$ 400,00", description: "Bateria + instalação" },
      { name: "Troca de Teclado", price: "A partir de R$ 600,00", description: "Teclado/topcase + instalação" },
      { name: "Upgrade SSD", price: "A partir de R$ 500,00", description: "SSD NVMe + instalação" }
    ],
    faqs: [
      { question: "Por que vocês são mais baratos que a Apple?", answer: "A Apple geralmente substitui componentes inteiros (placa lógica completa, topcase). Nós reparamos os componentes específicos com defeito, o que reduz drasticamente o custo." },
      { question: "O reparo mantém a garantia da Apple?", answer: "Se o Mac ainda estiver na garantia Apple, recomendamos usar a garantia oficial. Nossos serviços são ideais para Macs fora de garantia ou quando a Apple não oferece reparo (apenas substituição cara)." },
      { question: "Vocês fazem reballing BGA?", answer: "Sim! Temos equipamento profissional para reballing BGA de chipsets de vídeo, processadores e outros componentes. É um processo avançado que recupera soldas defeituosas." },
      { question: "Meu MacBook caiu líquido, tem conserto?", answer: "Na maioria dos casos sim, se agir rápido. Realizamos desoxidação com banho ultrassônico para remover corrosão. Quanto antes trouxer (idealmente em até 48h), maior a chance de sucesso." },
      { question: "Consertam problema de teclas colando (butterfly)?", answer: "Sim! Trocamos o teclado butterfly completo ou fazemos limpeza profunda. Para modelos mais novos com Magic Keyboard, também atendemos." }
    ],
    relatedServices: ["notebooks", "celulares", "recuperacao-dados"],
    keywords: ["conserto macbook curitiba", "assistência apple", "reparo placa lógica", "reballing bga", "macbook air pro", "imac conserto"]
  }
};

export const getServiceBySlug = (slug: string): ServiceData | null => {
  return servicesData[slug] || null;
};

export const getAllServices = (): ServiceData[] => {
  return Object.values(servicesData);
};

export const getServiceCategories = () => {
  return [
    {
      title: "Informática e Computadores",
      services: ["informatica", "notebooks", "pc-gamer", "macbook", "servidores"]
    },
    {
      title: "Celulares e Eletrônicos",
      services: ["celulares", "games", "tvs"]
    },
    {
      title: "Redes e Conectividade",
      services: ["redes", "cftv", "impressoras"]
    },
    {
      title: "Instalações e Manutenção",
      services: ["eletrica", "ar-condicionado", "manutencao-predial", "servicos-gerais"]
    },
    {
      title: "Serviços Especializados",
      services: ["recuperacao-dados"]
    }
  ];
};
