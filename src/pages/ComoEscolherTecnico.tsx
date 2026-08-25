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

const PAGE_URL = "https://precisodeumtecnico.com/como-escolher-tecnico-preco-prazo";

const SUMMARY = [
  { id: "criterios", label: "Os cinco critérios que realmente pesam" },
  { id: "preco", label: "Como comparar preço sem cair em armadilha" },
  { id: "prazo", label: "Prazo: o que muda entre visita, bancada e peça" },
  { id: "comparativo", label: "Comparativo por tipo de atendimento" },
  { id: "sinais", label: "Sinais de alerta antes de fechar" },
  { id: "checklist", label: "Checklist para pedir orçamento" },
  { id: "faq", label: "Perguntas frequentes" },
];

const SECTIONS: { id: string; title: string; paragraphs: string[]; list?: string[] }[] = [
  {
    id: "criterios",
    title: "Os cinco critérios que realmente pesam",
    paragraphs: [
      "Escolher um técnico é uma decisão de risco: o equipamento sai do seu controle e, em muitos casos, carrega dados que não têm backup. Preço é apenas um dos critérios, e sozinho é o pior deles — o orçamento mais baixo costuma ser o que omite etapas.",
      "Na prática, cinco pontos separam um atendimento previsível de um problema maior. Eles podem ser verificados antes de fechar, em poucas mensagens, sem conhecimento técnico.",
    ],
    list: [
      "Escopo escrito: o que será feito, o que não está incluído e o que depende de peça.",
      "Diagnóstico antes do valor final: quem dá preço fechado sem ver o equipamento está chutando.",
      "Aprovação prévia: nenhuma execução deve começar sem o seu aceite do valor.",
      "Garantia declarada: prazo e cobertura precisam estar ditos antes, não depois.",
      "Tratamento dos dados: o que acontece com o disco durante o serviço.",
    ],
  },
  {
    id: "preco",
    title: "Como comparar preço sem cair em armadilha",
    paragraphs: [
      "Dois orçamentos só são comparáveis quando descrevem o mesmo escopo. É comum receber um valor menor que exclui deslocamento, backup, limpeza interna ou reinstalação de programas — itens que reaparecem no fim como cobrança adicional.",
      "Antes de comparar números, iguale o escopo. Pergunte se o valor cobre diagnóstico, mão de obra, deslocamento e teste final; se a peça está inclusa ou é orçada à parte; e se há custo de retorno caso o sintoma volte dentro da garantia.",
      "Outra distorção comum é comparar visita com bancada. Uma visita técnica resolve o que pode ser feito no local; uma análise em bancada envolve retirada, testes com instrumentos e recolocação. São serviços diferentes e naturalmente têm valores diferentes.",
      "No nosso atendimento, a visita técnica com diagnóstico parte de R$ 99,99 e o valor do serviço é sempre apresentado e aprovado antes de qualquer execução. Quando o caso exige análise em bancada com retirada do equipamento, a coleta parte de R$ 299,99.",
    ],
  },
  {
    id: "prazo",
    title: "Prazo: o que muda entre visita, bancada e peça",
    paragraphs: [
      "Prazo depende muito mais do tipo de defeito do que da agenda do técnico. Serviços de software — formatação, remoção de vírus, configuração de rede — costumam terminar no mesmo atendimento. Substituições diretas, como SSD, memória, carregador ou bateria, também se resolvem no local quando a peça está disponível.",
      "Casos que exigem bancada mudam a conta: retirada, fila de testes, tempo de observação e recolocação. E qualquer serviço que dependa de peça específica de modelo passa a depender do fornecedor, não do técnico.",
      "Desconfie de prazo cravado antes do diagnóstico. O prazo honesto vem em duas partes: um tempo estimado para o diagnóstico e um tempo para a execução, confirmado só depois que a causa está identificada.",
    ],
  },
  {
    id: "comparativo",
    title: "Comparativo por tipo de atendimento",
    paragraphs: [
      "A tabela abaixo resume o que esperar de cada formato. Use como referência para entender o que está sendo cobrado e por quê.",
    ],
  },
  {
    id: "sinais",
    title: "Sinais de alerta antes de fechar",
    paragraphs: [
      "Alguns comportamentos aparecem antes do prejuízo e permitem recuar a tempo. O mais comum é o preço fechado dado por telefone para um sintoma genérico: sem ver o equipamento, esse número só se sustenta se houver margem para cobrir o pior cenário — e você paga por ela.",
      "Outro alerta é a recusa em detalhar o escopo por escrito, mesmo que em uma mensagem simples. Se não pode ser descrito antes, dificilmente será cumprido depois.",
    ],
    list: [
      "Valor fechado sem diagnóstico para sintoma genérico.",
      "Troca de peça sugerida antes de qualquer medição.",
      "Garantia mencionada apenas verbalmente, sem prazo definido.",
      "Nenhuma pergunta sobre dados importantes no disco.",
      "Pressa para retirar o equipamento antes de combinar o escopo.",
    ],
  },
  {
    id: "checklist",
    title: "Checklist para pedir orçamento",
    paragraphs: [
      "Quanto melhor a descrição do sintoma, mais preciso é o orçamento — e menor a chance de revisão de valor depois. Envie essas informações já na primeira mensagem.",
    ],
    list: [
      "Tipo de equipamento, marca e modelo aproximado.",
      "Sintoma exato e quando começou.",
      "O que mudou antes do problema (queda de energia, atualização, instalação).",
      "Se há dados importantes sem backup no disco.",
      "Cidade e bairro, para estimar o deslocamento.",
      "Se prefere atendimento no local ou retirada para bancada.",
    ],
  },
];

const COMPARISON: { tipo: string; indicado: string; prazo: string; observacao: string }[] = [
  {
    tipo: "Visita técnica no local",
    indicado: "Lentidão, vírus, formatação, rede, upgrade de SSD e memória",
    prazo: "Resolução no mesmo atendimento na maioria dos casos",
    observacao: "Parte de R$ 99,99 com diagnóstico incluído e valor aprovado antes da execução",
  },
  {
    tipo: "Análise em bancada",
    indicado: "Não liga, sem vídeo, desligamento espontâneo, falha intermitente",
    prazo: "Diagnóstico após retirada; execução confirmada depois da causa identificada",
    observacao: "Coleta parte de R$ 299,99; exige observação e testes que não cabem no local",
  },
  {
    tipo: "Serviço com peça específica",
    indicado: "Tela, bateria, carregador, componentes de modelo",
    prazo: "Depende da disponibilidade da peça para o modelo",
    observacao: "Prazo informado só após confirmação de disponibilidade com o fornecedor",
  },
];

const FAQS = [
  {
    question: "Como saber se o orçamento está caro?",
    answer:
      "Compare escopos, não números. Confirme se o valor inclui diagnóstico, mão de obra, deslocamento e teste final, e se a peça entra à parte. Dois orçamentos com escopos diferentes não são comparáveis.",
  },
  {
    question: "Posso receber um preço fechado antes do diagnóstico?",
    answer:
      "Para serviços de escopo previsível, como formatação ou upgrade de SSD, sim. Para falhas de hardware, não: qualquer valor fechado antes de ver o equipamento embute margem para o pior cenário.",
  },
  {
    question: "Vale mais a pena atendimento no local ou levar para bancada?",
    answer:
      "Depende do sintoma. Software, rede e substituições diretas resolvem no local. Falhas de inicialização, ausência de vídeo e problemas intermitentes precisam de bancada, porque exigem testes e tempo de observação.",
  },
  {
    question: "O que deve constar na garantia do serviço?",
    answer:
      "Prazo, o que está coberto (mão de obra, peça ou ambos) e como solicitar o retorno. Garantia sem prazo declarado antes do serviço não é garantia.",
  },
  {
    question: "Quanto custa a visita técnica com diagnóstico?",
    answer:
      "A visita técnica com diagnóstico parte de R$ 99,99. O valor do serviço é apresentado depois do diagnóstico e só é executado após a sua aprovação.",
  },
  {
    question: "E se o equipamento precisar ser retirado?",
    answer:
      "Quando o caso exige análise em bancada, a coleta parte de R$ 299,99. A retirada só acontece depois que o escopo e as condições estão combinados com você.",
  },
  {
    question: "Como proteger meus dados durante o serviço?",
    answer:
      "Avise antes se há arquivos importantes sem backup. Isso muda o procedimento: a cópia dos dados passa a ser feita antes de qualquer intervenção que envolva o armazenamento.",
  },
  {
    question: "Prazo curto demais é sinal de problema?",
    answer:
      "Pode ser. Prazo prometido antes do diagnóstico costuma ignorar etapas de teste. O prazo confiável vem em duas partes: tempo para diagnosticar e tempo para executar, este confirmado após a causa identificada.",
  },
];

export default function ComoEscolherTecnico() {
  const photos = pickServicePhotos("guia-tecnico-informatica", 3);
  const whatsappLink = buildWhatsAppUrl({
    service: "orçamento de assistência técnica",
    city: "Curitiba",
    sourcePage: "/como-escolher-tecnico-preco-prazo",
  });

  const breadcrumbs = [
    { name: "Início", url: "https://precisodeumtecnico.com/" },
    { name: "Serviços", url: "https://precisodeumtecnico.com/servicos" },
    { name: "Como escolher o profissional pelo preço e prazo", url: PAGE_URL },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Como escolher o profissional pelo preço e pelo prazo",
    description:
      "Guia comparativo para avaliar orçamentos de assistência técnica: como igualar escopos, entender prazos por tipo de atendimento e identificar sinais de alerta antes de fechar.",
    inLanguage: "pt-BR",
    datePublished: "2026-08-11",
    dateModified: "2026-08-11",
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
        title="Como Escolher o Técnico pelo Preço e pelo Prazo"
        description="Guia comparativo para avaliar orçamentos de assistência técnica: igualar escopos, entender prazos por tipo de atendimento e reconhecer sinais de alerta antes de fechar."
        canonical={PAGE_URL}
        type="article"
        keywords="como escolher técnico de informática, orçamento assistência técnica curitiba, preço conserto de computador, prazo de conserto de notebook"
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
            <span className="text-foreground">Como escolher pelo preço e prazo</span>
          </nav>

          <h1 className="mt-4 font-display text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            Como escolher o profissional pelo preço e pelo prazo
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Comparar orçamentos de assistência técnica só funciona quando os escopos são iguais.
            Este guia mostra o que perguntar antes de fechar, como interpretar prazos por tipo
            de atendimento e quais sinais indicam que o valor baixo vai custar caro depois.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="whatsapp" size="lg" asChild>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackWhatsAppClick({
                    source: "guia_escolha_hero",
                    service: "orçamento de assistência técnica",
                    city: "Curitiba",
                  })
                }
                data-wa-source="guia-escolha"
                data-service="orçamento de assistência técnica"
                aria-label="Pedir orçamento pelo WhatsApp"
              >
                <MessageCircle className="w-5 h-5" /> Pedir orçamento
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/precos">
                Ver faixas de valor <ArrowRight className="w-4 h-4" />
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
              {section.id === "comparativo" && (
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <caption className="sr-only">
                      Comparativo de tipos de atendimento por indicação, prazo e condição comercial
                    </caption>
                    <thead className="bg-secondary/50">
                      <tr>
                        <th scope="col" className="text-left p-3 font-semibold">Tipo</th>
                        <th scope="col" className="text-left p-3 font-semibold">Indicado para</th>
                        <th scope="col" className="text-left p-3 font-semibold">Prazo típico</th>
                        <th scope="col" className="text-left p-3 font-semibold">Condição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARISON.map((row) => (
                        <tr key={row.tipo} className="border-t border-border align-top">
                          <th scope="row" className="text-left p-3 font-medium">{row.tipo}</th>
                          <td className="p-3 text-muted-foreground">{row.indicado}</td>
                          <td className="p-3 text-muted-foreground">{row.prazo}</td>
                          <td className="p-3 text-muted-foreground">{row.observacao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          <Card className="p-6 mt-12 bg-primary/5 border-primary/20">
            <h2 className="font-display text-xl font-bold mb-2">Quer comparar com um orçamento real?</h2>
            <p className="text-muted-foreground mb-4">
              Descreva o sintoma pelo WhatsApp com as informações do checklist. O diagnóstico é
              informado antes da execução e o valor só é cobrado após a sua aprovação.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="whatsapp" asChild>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackWhatsAppClick({
                      source: "guia_escolha_cta",
                      service: "orçamento de assistência técnica",
                      city: "Curitiba",
                    })
                  }
                  data-wa-source="guia-escolha-cta"
                  data-service="orçamento de assistência técnica"
                  aria-label="Pedir orçamento pelo WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" /> Pedir meu orçamento
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/guia-tecnico-informatica">
                  Ler o guia técnico <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
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
        title="Referências visuais de diagnóstico e bancada"
        intro="Imagens sob licença livre que ilustram as etapas descritas no comparativo."
        photos={photos}
      />

      <div className="container-custom max-w-4xl pb-16">
        <RelatedServiceLinks slug="guia-tecnico-informatica" title="Continue pelo serviço certo" />
      </div>
    </Layout>
  );
}
