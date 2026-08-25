import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { FileText, ArrowRight } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/termos-uso";

const SECTIONS = [
  {
    id: "quem-somos",
    title: "1. Quem opera este site",
    items: [
      "Este site é operado pela assistência técnica Preciso de um Técnico, com atendimento em Curitiba e região metropolitana e cobertura nacional na modalidade de coleta e entrega.",
      "O canal oficial de contato é o WhatsApp exibido nas páginas e o formulário de triagem. Não temos representantes autorizados fora destes canais.",
      "Dúvidas sobre estes termos podem ser enviadas pela página de contato.",
    ],
  },
  {
    id: "uso-do-site",
    title: "2. Uso permitido do conteúdo",
    items: [
      "Você pode ler, imprimir e compartilhar os links dos guias técnicos e das páginas de serviço para uso pessoal ou informativo.",
      "É proibido copiar o conteúdo em massa, reproduzir páginas inteiras em outro domínio ou usar raspagem automatizada para recriar o catálogo de serviços, bairros e cidades.",
      "Textos, tabelas de prazo, políticas de preço e checklists técnicos são material próprio; a reprodução parcial exige citação da fonte e link para a página original.",
      "As fotos de terceiros exibidas no site seguem as licenças informadas na página de créditos de imagens e não podem ser reutilizadas sem checar a licença original.",
    ],
  },
  {
    id: "conteudo-informativo",
    title: "3. Natureza informativa dos guias",
    items: [
      "Os guias explicam sintomas, causas prováveis e faixas de prazo com base no atendimento real da bancada. São material informativo, não substituem o diagnóstico presencial.",
      "Faixas de valor publicadas são estimativas iniciais. O valor final só é confirmado após diagnóstico e aprovação sua, conforme os Termos de Orçamento.",
      "Procedimentos descritos nos guias que envolvem abertura de equipamento, fonte chaveada ou alta tensão são de responsabilidade de quem executa. Não nos responsabilizamos por danos causados por tentativa própria de reparo.",
    ],
  },
  {
    id: "orcamento-servico",
    title: "4. Orçamento, prazos e garantia",
    items: [
      "As condições comerciais completas (taxa mínima, prazo de diagnóstico, aprovação e garantia) estão nos Termos de Orçamento e na Política de Peças do Cliente, que fazem parte destes termos.",
      "Prazos publicados são estimativas úteis de bancada e podem variar conforme disponibilidade de peça e complexidade do defeito. Qualquer alteração é comunicada antes de continuar o serviço.",
      "O agendamento pelo funil de triagem é uma solicitação; a confirmação de data e horário acontece no WhatsApp com um atendente.",
    ],
  },
  {
    id: "avaliacoes",
    title: "5. Avaliações enviadas por clientes",
    items: [
      "Avaliações são publicadas apenas com autorização expressa do autor e após conferência manual.",
      "Não publicamos avaliação com dado pessoal de terceiro, linguagem ofensiva, acusação sem contexto verificável ou conteúdo comercial de outra empresa.",
      "O autor pode pedir a retirada da avaliação a qualquer momento pela página de exclusão de dados.",
    ],
  },
  {
    id: "publicidade",
    title: "6. Publicidade e patrocínio",
    items: [
      "Algumas páginas podem exibir anúncios de terceiros e espaços de patrocínio, sempre identificados como publicidade e separados do conteúdo editorial.",
      "Não temos controle editorial sobre os anúncios exibidos por redes de terceiros e a exibição não representa recomendação de produto ou serviço anunciado.",
      "As regras completas estão na Política de Anúncios e Patrocínio.",
    ],
  },
  {
    id: "limitacao",
    title: "7. Limitação de responsabilidade",
    items: [
      "Trabalhamos para manter o conteúdo correto e atualizado, mas não garantimos ausência total de erro tipográfico ou de desatualização pontual de faixa de preço.",
      "Não respondemos por indisponibilidade temporária do site, do WhatsApp ou de serviços de terceiros usados na navegação.",
      "Nada nestes termos limita direitos garantidos ao consumidor pelo Código de Defesa do Consumidor.",
    ],
  },
  {
    id: "alteracoes",
    title: "8. Alterações destes termos",
    items: [
      "Estes termos podem ser atualizados para refletir mudanças de operação, de legislação ou de política de anúncios.",
      "A versão vigente é sempre a publicada nesta página. Alterações relevantes em condições comerciais são sinalizadas nos Termos de Orçamento.",
      "O foro para questões não resolvidas amigavelmente é o da comarca de Curitiba/PR, salvo foro do domicílio do consumidor quando aplicável.",
    ],
  },
];

const FAQ = [
  {
    question: "Posso republicar os guias técnicos deste site no meu blog?",
    answer:
      "Não em texto integral. Você pode citar um trecho curto com crédito e link para a página original. Cópia integral ou raspagem automatizada do catálogo de serviços, bairros e cidades não é autorizada.",
  },
  {
    question: "As faixas de preço publicadas são o valor final?",
    answer:
      "Não. São estimativas iniciais. O valor final é definido após o diagnóstico e só segue com a sua aprovação, conforme os Termos de Orçamento.",
  },
  {
    question: "O site exibe anúncios de terceiros?",
    answer:
      "Pode exibir. Quando houver, o espaço é identificado como publicidade e fica separado do conteúdo editorial. Não temos controle sobre o que a rede de anúncios entrega e a exibição não é recomendação nossa.",
  },
  {
    question: "Fazer o agendamento pelo funil já confirma a visita?",
    answer:
      "Não. O funil registra a solicitação com data e horário preferidos. A confirmação acontece no WhatsApp com um atendente, que valida agenda e modalidade (bancada, visita ou coleta).",
  },
];

const RELATED = [
  { to: "/termos-orcamento-pre-aprovado", label: "Termos de Orçamento e garantia" },
  { to: "/politica-de-anuncios", label: "Política de Anúncios e Patrocínio" },
  { to: "/politica-privacidade", label: "Política de Privacidade e LGPD" },
  { to: "/politica-de-pecas-do-cliente", label: "Política de Peças do Cliente" },
  { to: "/creditos-de-imagens", label: "Créditos e licenças das imagens" },
  { to: "/exclusao-de-dados", label: "Exclusão de dados (LGPD)" },
];

const TermosDeUso = () => (
  <Layout>
    <SEOHead
      title="Termos de Uso do site | Preciso de um Técnico"
      description="Regras de uso do conteúdo, natureza informativa dos guias, condições de orçamento, avaliações de clientes, publicidade de terceiros e limitação de responsabilidade."
      canonical={CANONICAL}
      breadcrumbs={[
        { name: "Início", url: "https://precisodeumtecnico.com/" },
        { name: "Termos de Uso", url: CANONICAL },
      ]}
      faq={FAQ}
    />

    <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Documento oficial
          </span>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Termos de Uso do site</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Estas são as regras para usar o conteúdo publicado aqui, o que os guias técnicos representam e
            como tratamos avaliações, publicidade e responsabilidade. Condições comerciais de serviço ficam
            nos Termos de Orçamento.
          </p>
        </div>
      </div>
    </section>

    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id}>
              <h2 className="mb-3 text-xl font-bold">{section.title}</h2>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 text-muted-foreground">
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="mb-4 text-xl font-bold">Perguntas frequentes sobre os termos</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.question} className="rounded-lg border border-border bg-muted/20 p-4">
                  <h3 className="font-semibold">{f.question}</h3>
                  <p className="mt-2 text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold">Documentos relacionados</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {RELATED.map((r) => (
                <li key={r.to}>
                  <Link to={r.to} className="text-primary underline underline-offset-4">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default TermosDeUso;
