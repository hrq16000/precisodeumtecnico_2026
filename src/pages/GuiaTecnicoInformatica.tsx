import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickServicePhotos } from "@/data/publicPhotos";
import { RelatedServiceLinks } from "@/components/seo/RelatedServiceLinks";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { trackWhatsAppClick } from "@/lib/analytics";
import { MessageCircle, ArrowRight, ChevronRight } from "lucide-react";

const PAGE_URL = "https://precisodeumtecnico.com/guia-tecnico-informatica";

const SUMMARY = [
  { id: "diagnostico", label: "Como diagnosticar antes de gastar" },
  { id: "lentidao", label: "Lentidão: disco, memória e temperatura" },
  { id: "nao-liga", label: "Não liga, não dá vídeo e desliga sozinho" },
  { id: "upgrades", label: "Upgrades que valem a pena em 2026" },
  { id: "manutencao", label: "Manutenção preventiva por tipo de uso" },
  { id: "redes", label: "Rede e Wi-Fi: o que é do computador e o que é do roteador" },
  { id: "dados", label: "Backup e proteção de dados" },
  { id: "trocar", label: "Quando consertar e quando trocar" },
  { id: "faq", label: "Perguntas frequentes" },
];

const SECTIONS: { id: string; title: string; paragraphs: string[]; list?: string[] }[] = [
  {
    id: "diagnostico",
    title: "Como diagnosticar antes de gastar",
    paragraphs: [
      "Todo atendimento de informática bem feito começa por medir, não por trocar peça. A maioria dos prejuízos que vemos vem da ordem invertida: o equipamento recebe um componente novo antes de alguém confirmar onde está o gargalo — e o sintoma continua.",
      "O roteiro básico cabe em poucos minutos e usa apenas ferramentas nativas do Windows. Abra o Gerenciador de Tarefas (Ctrl + Shift + Esc) na aba Desempenho e observe o comportamento durante o momento de lentidão ou de falha. O recurso que satura primeiro é o candidato principal.",
      "Anote também o histórico: quando começou, o que mudou antes (atualização, queda de energia, mudança de local, instalação de programa) e se o problema é constante ou intermitente. Esse contexto encurta o diagnóstico mais do que qualquer software de teste.",
    ],
    list: [
      "Disco em 100% com fila alta e boot demorado: armazenamento.",
      "Memória acima de 85% com poucos programas abertos: RAM insuficiente.",
      "CPU alta em repouso, ventoinha acelerada: infecção, processo travado ou superaquecimento.",
      "Falha só depois de meia hora ligado: quase sempre térmico.",
      "Falha aleatória com tela azul: memória, driver ou armazenamento com setores defeituosos.",
    ],
  },
  {
    id: "lentidao",
    title: "Lentidão: disco, memória e temperatura",
    paragraphs: [
      "Lentidão é o motivo mais comum de chamado em informática, e raramente significa que o equipamento ficou fraco. Em máquinas de quatro anos ou mais, o disco mecânico costuma responder pela maior parte do problema: o Windows 11 depende de leitura aleatória constante, exatamente o ponto fraco desse tipo de disco.",
      "O segundo fator é memória. Quando a RAM se esgota, o sistema passa a usar o disco como extensão e a lentidão aparece até com SSD instalado. Vale conferir o valor de memória comprometida antes de decidir a compra do módulo.",
      "O terceiro fator é térmico. Processadores reduzem o próprio desempenho para se proteger acima de determinada temperatura. O sinal típico é a máquina rápida logo após ligar e lenta depois de algum tempo de uso, com ventoinha em rotação alta. Limpeza interna e troca da pasta térmica resolvem grande parte desses casos.",
      "Só depois desses três é que entram software e sistema: programas na inicialização, extensões de navegador, malware e componentes corrompidos do Windows.",
    ],
  },
  {
    id: "nao-liga",
    title: "Não liga, não dá vídeo e desliga sozinho",
    paragraphs: [
      "Esses três sintomas são frequentemente confundidos, mas apontam para causas diferentes. Equipamento sem nenhuma reação (nenhum LED, nenhuma ventoinha) indica alimentação: fonte, carregador, conector ou circuito de carga. Equipamento que liga mas não mostra imagem indica memória, vídeo ou o conjunto de tela.",
      "Desligamento espontâneo depois de alguns minutos aponta para proteção térmica ou fonte incapaz de sustentar a carga. Já a parada na tela do fabricante costuma ser disco ou sistema operacional — em geral, a situação mais barata de resolver.",
      "Em notebooks, dois testes simples separam boa parte dos casos antes de qualquer abertura: a descarga de energia residual (30 segundos com o botão de ligar pressionado, sem carregador e sem bateria removível) e o teste com monitor externo por HDMI.",
    ],
  },
  {
    id: "upgrades",
    title: "Upgrades que valem a pena em 2026",
    paragraphs: [
      "A ordem de retorno por real investido continua clara: SSD primeiro, memória depois, e só então placa de vídeo ou processador — este último quase sempre exigindo troca de plataforma inteira.",
      "Antes de comprar qualquer peça, confira compatibilidade: tipo e frequência da memória, slots livres, interface disponível para o SSD (SATA ou NVMe), capacidade da fonte e espaço físico no gabinete. Peça incompatível é o desperdício mais comum em upgrades feitos por conta própria.",
      "Em equipamentos que já receberam SSD e memória e continuam limitados, o upgrade seguinte raramente compensa: o custo se aproxima do valor de uma plataforma nova, sem o ganho equivalente.",
    ],
    list: [
      "SSD: maior ganho percebido em boot, abertura de programas e resposta geral.",
      "Memória: elimina o uso de disco como memória virtual e melhora o multitarefa.",
      "Limpeza e pasta térmica: recupera o desempenho perdido por proteção térmica.",
      "Fonte de qualidade: pré-requisito para qualquer upgrade de placa de vídeo.",
    ],
  },
  {
    id: "manutencao",
    title: "Manutenção preventiva por tipo de uso",
    paragraphs: [
      "A frequência ideal de manutenção depende muito mais do ambiente do que do tempo de uso. Máquinas em ambiente com poeira, pelo de animal ou posicionadas no chão acumulam sujeira no dissipador em poucos meses; equipamentos em escritório limpo suportam intervalos maiores.",
      "Para uso doméstico comum, uma revisão anual de limpeza interna e verificação de temperaturas costuma bastar. Para uso intenso, ambientes empresariais ou máquinas que ficam ligadas o dia inteiro, o intervalo semestral é mais adequado.",
      "Manutenção preventiva não é só limpeza: inclui verificação da saúde do disco (S.M.A.R.T.), conferência de atualizações críticas do sistema, revisão de backup e teste real de restauração.",
    ],
  },
  {
    id: "redes",
    title: "Rede e Wi-Fi: o que é do computador e o que é do roteador",
    paragraphs: [
      "Boa parte dos chamados de \"internet lenta\" não tem relação com a operadora nem com o computador — está no posicionamento do roteador, na faixa de frequência usada ou na quantidade de dispositivos concorrendo pelo mesmo canal.",
      "Um teste simples separa os casos: se apenas um equipamento sofre, o problema tende a ser do adaptador, do driver ou da configuração desse equipamento. Se todos sofrem no mesmo cômodo, é cobertura. Se todos sofrem em toda a casa e no cabo também, é do link ou do roteador.",
      "A faixa de 5 GHz entrega mais velocidade e menos interferência, mas atravessa menos paredes que a de 2,4 GHz. Em imóveis grandes ou com laje, cobrir com um único ponto raramente funciona bem.",
    ],
  },
  {
    id: "dados",
    title: "Backup e proteção de dados",
    paragraphs: [
      "Nenhum reparo devolve arquivo que nunca foi copiado. A regra de referência continua sendo três cópias, em dois tipos de mídia diferentes, com uma delas fora do local — e, hoje, com pelo menos uma cópia offline como defesa contra ransomware.",
      "Backup que nunca foi testado não é backup. Restaurar um arquivo aleatório a cada trimestre é o teste mínimo para confirmar que o processo funciona.",
      "Antes de entregar qualquer equipamento para manutenção, informe se há dados importantes no disco. Isso muda o procedimento: o técnico prioriza a preservação e a cópia antes de qualquer intervenção que envolva o armazenamento.",
    ],
  },
  {
    id: "trocar",
    title: "Quando consertar e quando trocar",
    paragraphs: [
      "A conta prática compara o custo total do reparo com o valor de um equipamento equivalente. Reparo que fica abaixo de um terço desse valor, em uma máquina que ainda atende ao uso pretendido, normalmente compensa.",
      "Pesa contra o reparo: plataforma sem suporte a SSD ou a memória adicional, placa-mãe com histórico de reparo anterior, indisponibilidade de peça específica do modelo e equipamentos cujo defeito envolve o circuito de placa em modelos muito antigos.",
      "Pesa a favor do reparo: defeito localizado (bateria, carregador, tela, disco), equipamento com boa plataforma e necessidade de preservar o ambiente de trabalho já configurado.",
    ],
  },
];

const FAQS = [
  {
    question: "Por onde começar quando o computador está lento?",
    answer:
      "Pelo Gerenciador de Tarefas, aba Desempenho, durante o momento de lentidão. O componente que satura (disco, memória ou CPU) indica onde investir. Trocar peça antes dessa leitura é o erro mais caro.",
  },
  {
    question: "Trocar o HD por SSD realmente faz diferença?",
    answer:
      "Sim, e é o upgrade com maior ganho percebido em máquinas que ainda usam disco mecânico. A diferença aparece já no tempo de inicialização e na abertura de programas.",
  },
  {
    question: "Notebook que não liga tem conserto?",
    answer:
      "Depende da causa. Carregador, bateria e conector de energia são substituições diretas. Falhas no circuito de carga da placa exigem análise em bancada, e a viabilidade é avaliada caso a caso conforme o modelo e a disponibilidade de peça.",
  },
  {
    question: "É melhor formatar ou limpar o sistema?",
    answer:
      "Limpeza resolve a maioria das infecções e o excesso de programas na inicialização. A formatação é indicada quando há componentes do sistema corrompidos, instabilidade persistente ou infecção que não é removida com segurança.",
  },
  {
    question: "Com que frequência devo fazer manutenção preventiva?",
    answer:
      "Uso doméstico comum: uma revisão por ano. Ambientes com poeira, animais, uso intenso ou equipamentos ligados o dia inteiro: a cada seis meses.",
  },
  {
    question: "O atendimento cobre notebooks e desktops de qualquer marca?",
    answer:
      "O diagnóstico é feito em desktops e notebooks de uso geral. A viabilidade do reparo depende do defeito encontrado e da disponibilidade de peça para o modelo, e isso é informado antes de qualquer execução.",
  },
  {
    question: "Como é cobrado o diagnóstico?",
    answer:
      "A visita técnica com diagnóstico parte de R$ 99,99, e o valor do serviço é apresentado e aprovado por você antes de qualquer execução. Nada é feito sem aprovação prévia.",
  },
  {
    question: "Vocês atendem empresas?",
    answer:
      "Sim, com atendimento presencial no posto de trabalho e suporte remoto assistido. O escopo é definido antes conforme o parque de máquinas e a rotina da equipe.",
  },
];

export default function GuiaTecnicoInformatica() {
  const photos = pickServicePhotos("guia-tecnico-informatica", 3);
  const whatsappLink = buildWhatsAppUrl({
    service: "assistência técnica em informática",
    city: "Curitiba",
    sourcePage: "/guia-tecnico-informatica",
  });

  const breadcrumbs = [
    { name: "Início", url: "https://precisodeumtecnico.com/" },
    { name: "Serviços", url: "https://precisodeumtecnico.com/servicos" },
    { name: "Guia técnico de informática", url: PAGE_URL },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Guia técnico de informática: diagnóstico, manutenção e upgrades",
    description:
      "Guia de referência para diagnosticar lentidão, falhas de inicialização, problemas de rede e decidir entre reparo e troca de computadores e notebooks.",
    inLanguage: "pt-BR",
    datePublished: "2026-08-08",
    dateModified: "2026-08-08",
    author: { "@type": "Organization", name: "Preciso de Um Técnico" },
    publisher: {
      "@type": "Organization",
      name: "Preciso de Um Técnico",
      logo: { "@type": "ImageObject", url: "https://precisodeumtecnico.com/icon-512.png" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
    articleSection: "Informática",
  };

  return (
    <Layout>
      <SEOHead
        title="Guia Técnico de Informática: Diagnóstico, Manutenção e Upgrades"
        description="Guia completo para diagnosticar lentidão, falhas de inicialização e problemas de rede em PCs e notebooks — e decidir entre reparo e troca com critério."
        canonical={PAGE_URL}
        type="article"
        keywords="guia técnico informática, computador lento, notebook não liga, upgrade de ssd, manutenção preventiva de computador"
        breadcrumbs={breadcrumbs}
        faq={FAQS}
        structuredData={[articleSchema]}
      />

      <section className="bg-secondary/30 border-b border-border">
        <div className="container-custom py-10 md:py-14 max-w-4xl">
          <nav aria-label="Trilha de navegação" className="text-xs sm:text-sm text-muted-foreground flex flex-wrap items-center gap-1">
            <Link to="/" className="hover:text-primary">Início</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <Link to="/servicos" className="hover:text-primary">Serviços</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-foreground">Guia técnico de informática</span>
          </nav>

          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Guia técnico de informática: diagnóstico, manutenção e upgrades
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Um material de referência para entender o que está acontecendo com o seu computador
            antes de gastar com peça ou serviço. Cada seção segue a mesma ordem usada no
            atendimento: medir, isolar a causa e só então agir.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="whatsapp" size="lg" asChild>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source: "guia_informatica_hero",
                    service: "assistência técnica em informática",
                    city: "Curitiba",
                  })
                }
                data-wa-source="guia-informatica"
                data-service="assistência técnica em informática"
                aria-label="Falar com um técnico pelo WhatsApp"
              >
                <MessageCircle className="w-5 h-5" /> Falar com um técnico
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/assistencia-tecnica-curitiba">
                Ver atendimento em Curitiba <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <nav aria-label="Sumário do guia" className="rounded-lg border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold">Neste guia</h2>
            <ol className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
              {SUMMARY.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary inline-flex items-center gap-2">
                    <span className="text-primary font-semibold">{i + 1}.</span> {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="font-display text-2xl md:text-3xl font-bold mt-12 mb-4">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-4">{p}</p>
              ))}
              {section.list && (
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <Card className="p-6 mt-12 bg-primary/5 border-primary/20">
            <h2 className="font-display text-xl font-bold mb-2">Prefere que um técnico avalie?</h2>
            <p className="text-muted-foreground mb-4">
              Descreva o sintoma pelo WhatsApp: o diagnóstico é informado antes da execução e a
              visita técnica parte de R$ 99,99, com aprovação prévia do valor.
            </p>
            <Button variant="whatsapp" asChild>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source: "guia_informatica_cta",
                    service: "assistência técnica em informática",
                    city: "Curitiba",
                  })
                }
                data-wa-source="guia-informatica-cta"
                data-service="assistência técnica em informática"
                aria-label="Descrever o problema pelo WhatsApp"
              >
                <MessageCircle className="w-4 h-4" /> Descrever meu problema
              </a>
            </Button>
          </Card>

          <div id="faq" className="scroll-mt-24">
            <h2 className="font-display text-2xl md:text-3xl font-bold mt-12 mb-4">Perguntas frequentes</h2>
            <Accordion type="single" collapsible>
              {FAQS.map((f, i) => (
                <AccordionItem data-faq-item key={f.question} value={`faq-${i}`}>
                  <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">
                    {f.question}
                  </AccordionTrigger>
                  <AccordionContent data-faq-answer>{f.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <PublicPhotoBand
        title="Referências visuais de bancada e hardware"
        intro="Imagens sob licença livre que ilustram os componentes e procedimentos citados no guia."
        photos={photos}
      />

      <div className="container-custom max-w-4xl pb-16">
        <RelatedServiceLinks slug="guia-tecnico-informatica" title="Continue pelo serviço certo" />
      </div>
    </Layout>
  );
}
