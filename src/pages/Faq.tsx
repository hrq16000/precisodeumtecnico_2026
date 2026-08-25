import { Helmet } from "@/lib/helmet-compat";
import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PageTableOfContents, type TocItem } from "@/components/layout/PageTableOfContents";
import { PRICING, SLA, COMMERCIAL } from "@/data/pricingPolicy";
import { COMPANY } from "@/data/companyInfo";
import { PublicPhotoBand } from "@/components/media/PublicPhotoBand";
import { pickServicePhotos } from "@/data/publicPhotos";

interface FaqEntry {
  q: string;
  a: string;
}

interface FaqGroup {
  id: string;
  title: string;
  intro: string;
  items: FaqEntry[];
}

/**
 * Rodada 36 — FAQ reorganizada por intenção de busca (atendimento, notebook/PC,
 * vírus e backup, empresas). Sem promessa de recuperação garantida e sem
 * qualquer rating/agregado. As respostas continuam vindo das fontes únicas
 * (pricingPolicy / companyInfo), então nada de claim solto.
 */
const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "faq-atendimento",
    title: "Atendimento, prazos e valores",
    intro: "Como começa o atendimento, quanto custa a visita e em quanto tempo o serviço anda.",
    items: [
      { q: "Como funciona o atendimento?", a: `Você preenche a triagem online (fotos e vídeos obrigatórios). Nossa equipe avalia, retorna com escopo, prazo e valor pré-aprovado. ${COMMERCIAL.triageRequirement}` },
      { q: "Qual o valor mínimo da visita técnica?", a: `${PRICING.technicalVisit.priceLabel} por bloco de até 30 minutos, limitado a 2 horas. Valor abatido em caso de fechamento.` },
      { q: "E o diagnóstico em bancada?", a: `${PRICING.benchDiagnosis.priceLabel} — ${PRICING.benchDiagnosis.description}` },
      { q: "Como funciona a coleta e entrega?", a: PRICING.pickupDelivery.description },
      { q: "Qual o prazo do atendimento?", a: `Mínimo de ${SLA.minLabel}, podendo chegar a ${SLA.maxLabel} conforme complexidade, peças e logística. ${SLA.disclaimer}` },
      { q: "Vocês parcelam?", a: COMMERCIAL.installments + ", quando aplicável. Consulte no fechamento do orçamento." },
      { q: "Posso remarcar ou cancelar?", a: "Sim, sem custo até 4h antes do agendamento. Após esse prazo, a taxa de visita R$ 99,99 é cobrada." },
      { q: "O valor pode mudar depois?", a: "Só com sua aprovação. Trabalhamos com orçamento pré-aprovado; nada é executado sem confirmação." },
      { q: "Como agendar pelo WhatsApp?", a: "Clique em qualquer botão 'Falar com técnico'. O sistema abre a triagem — ao final você é encaminhado ao WhatsApp com sua região preenchida." },
      { q: "Como enviar fotos e vídeos?", a: "Direto no formulário de triagem. Sem cadastro com mídia prévia não iniciamos atendimento (padrão de qualidade e segurança)." },
    ],
  },
  {
    id: "faq-notebook-pc",
    title: "Notebook e PC em Curitiba",
    intro: "Os casos que mais chegam da triagem: notebook lento, superaquecimento, tela e montagem de desktop.",
    items: [
      { q: "Meu notebook está muito lento em Curitiba: vale consertar ou trocar?", a: "Na triagem pedimos modelo, idade e sintomas. Se o custo estimado do reparo passa de um terço do valor de mercado do equipamento, dizemos isso por escrito antes de qualquer serviço — você decide com o número na mão." },
      { q: "Notebook esquentando e desligando sozinho, o que é feito?", a: "Avaliamos ventilação, pasta térmica e histórico de quedas de energia. O escopo (limpeza interna, troca de pasta ou substituição de componente) vai no orçamento pré-aprovado, com o que está e o que não está incluso." },
      { q: "Vocês trocam tela de notebook?", a: "Sim, mediante triagem com foto da tela ligada e do modelo/etiqueta. A peça é orçada antes; nada é comprado ou aberto sem sua aprovação." },
      { q: "Fazem montagem e upgrade de PC?", a: "Sim. Montagem, upgrade de memória e armazenamento seguem a política de peças do cliente. Detalhes em /politica-de-pecas-do-cliente e no fluxo de orçamento de PC." },
      { q: "O atendimento é na minha casa ou em bancada?", a: "Depende do sintoma. A própria triagem calcula a modalidade: alguns casos resolvem em visita, outros exigem bancada ou coleta e entrega — e o valor correspondente aparece antes de você confirmar." },
    ],
  },
  {
    id: "faq-virus-backup",
    title: "Vírus, backup e dados",
    intro: "O que fazemos (e o que não prometemos) quando o problema envolve dados.",
    items: [
      { q: "Meu computador pegou vírus. Vocês limpam?", a: "Sim. Fazemos remoção de malware, revisão de inicialização e orientação de prevenção. Se o sistema estiver comprometido a ponto de exigir reinstalação, isso é informado no orçamento antes da execução." },
      { q: "Vocês fazem backup antes de mexer no equipamento?", a: "Backup é um item de escopo: quando aplicável, entra no orçamento com prazo e espaço necessário. Se o dispositivo já chega sem leitura, avisamos que o backup pode não ser possível — não trabalhamos com promessa." },
      { q: "Fazem recuperação de dados?", a: "Sim, mediante triagem específica e orçamento pré-aprovado. Não garantimos recuperação: o resultado depende do estado físico e lógico da mídia, e isso fica explícito antes de qualquer intervenção." },
      { q: "Meus arquivos ficam protegidos durante o serviço?", a: `Tratamos dados conforme a LGPD. Você pode consultar a política em /seguranca-dos-dados e solicitar exclusão em /exclusao-de-dados. ${COMMERCIAL.triageRequirement}` },
      { q: "Existe garantia?", a: "Sim, garantia sobre o serviço executado. O prazo consta no orçamento final aprovado." },
    ],
  },
  {
    id: "faq-empresas",
    title: "Suporte para empresas (B2B)",
    intro: "Contratos, nota fiscal e atendimento recorrente para escritórios, clínicas e comércios.",
    items: [
      { q: "Atendem empresas?", a: "Sim. Emitimos nota fiscal e temos condições comerciais específicas para PJ, incluindo atendimento avulso e recorrente." },
      { q: "Qual a diferença entre chamado avulso e contrato recorrente?", a: "No avulso você paga por atendimento, com a mesma triagem do cliente final. No recorrente há previsibilidade de custo, prioridade de fila e histórico consolidado dos equipamentos — comparação completa em /servicos/suporte-tecnico-empresarial." },
      { q: "Cuidam de rede, Wi-Fi e CFTV da empresa?", a: "Sim: redes cabeadas e Wi-Fi, câmeras (CFTV) e infraestrutura leve. Cada frente é orçada com escopo próprio, sem pacote genérico." },
      { q: "Atendem quais equipamentos?", a: "Notebooks, PCs, TVs, celulares, consoles, som, câmeras (CFTV), redes Wi-Fi, ar-condicionado e manutenção predial leve." },
      { q: "Vocês atendem em todo o Brasil?", a: `${COMPANY.areaServed}. ${COMMERCIAL.partnersDisclaimer}` },
    ],
  },
];

const ALL_FAQ: FaqEntry[] = FAQ_GROUPS.flatMap((g) => g.items);

const tocItems: TocItem[] = FAQ_GROUPS.map((g) => ({ id: g.id, label: g.title }));

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ALL_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
    { "@type": "ListItem", position: 2, name: "FAQ", item: "https://precisodeumtecnico.com/faq" },
  ],
};

export default function Faq() {
  return (
    <Layout>
      <Helmet>
        <title>Perguntas Frequentes — Preciso de um Técnico</title>
        <meta name="description" content="FAQ: valores mínimos, prazos, garantia, notebook e PC, vírus e backup, suporte empresarial e como funciona a triagem técnica em Curitiba." />
        <link rel="canonical" href="https://precisodeumtecnico.com/faq" />
        <meta property="og:title" content="Perguntas Frequentes — Preciso de um Técnico" />
        <meta property="og:url" content="https://precisodeumtecnico.com/faq" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>
      <section className="container-custom section-padding">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Perguntas Frequentes</h1>
          <p className="text-muted-foreground">
            Respostas objetivas sobre valores mínimos, prazos, garantia, notebook e PC, vírus e backup,
            suporte para empresas e como funciona a triagem técnica.
          </p>
        </header>

        <PageTableOfContents className="mb-10 max-w-3xl" items={tocItems} />

        {FAQ_GROUPS.map((group) => (
          <div key={group.id} className="max-w-3xl">
            <h2
              id={group.id}
              data-toc-anchor
              className="font-display text-2xl md:text-3xl font-bold mt-12 mb-2 scroll-mt-24"
            >
              {group.title}
            </h2>
            <p className="text-muted-foreground mb-4">{group.intro}</p>
            <Accordion type="single" collapsible>
              {group.items.map((f, i) => (
                <AccordionItem data-faq-item key={`${group.id}-${i}`} value={`${group.id}-${i}`}>
                  <AccordionTrigger data-faq-question data-testid="faq-question" className="text-left">{f.q}</AccordionTrigger>
                  <AccordionContent data-faq-answer>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        <nav aria-label="Páginas relacionadas" className="mt-12 max-w-3xl rounded-xl border border-border bg-card p-5">
          <p className="font-semibold text-card-foreground">Continue por aqui</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
            <li><Link className="text-primary hover:underline" to="/precos">Preços e políticas</Link></li>
            <li><Link className="text-primary hover:underline" to="/areas-atendidas">Áreas atendidas</Link></li>
            <li><Link className="text-primary hover:underline" to="/servicos/suporte-tecnico-empresarial">Suporte técnico empresarial</Link></li>
            <li><Link className="text-primary hover:underline" to="/seguranca-dos-dados">Segurança dos dados</Link></li>
          </ul>
        </nav>
      </section>
      <PublicPhotoBand
        title="Referências visuais"
        intro="Fotos reais de domínio público / Creative Commons ilustrando os equipamentos citados nas respostas."
        photos={pickServicePhotos("faq-geral", 2)}
      />
    </Layout>
  );
}
