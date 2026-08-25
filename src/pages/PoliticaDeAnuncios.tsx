import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Megaphone, ArrowRight, ShieldCheck } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/politica-de-anuncios";

const SECTIONS = [
  {
    id: "como-nos-sustentamos",
    title: "Como este site se sustenta",
    items: [
      "A principal receita vem do serviço técnico: orçamentos aprovados, reparos de bancada, visitas e coleta e entrega.",
      "Além disso, o site pode exibir anúncios de redes de publicidade de terceiros e espaços de patrocínio contratados diretamente.",
      "Publicidade nunca altera o diagnóstico técnico, a faixa de preço publicada nem a ordem de recomendação dos nossos serviços.",
    ],
  },
  {
    id: "identificacao",
    title: "Como identificamos publicidade",
    items: [
      "Todo espaço pago é rotulado como \"Publicidade\" ou \"Patrocinado\" e fica visualmente separado do conteúdo editorial.",
      "Não usamos formatos que imitem botões do site, avisos de sistema, resultado de diagnóstico ou o botão de WhatsApp.",
      "Não colocamos anúncio dentro do funil de triagem, do agendador nem da consulta de ordem de serviço — essas telas são de atendimento e ficam livres de anúncio.",
      "Não incentivamos cliques em anúncio, não usamos setas ou textos apontando para o bloco e não posicionamos anúncio em local que provoque clique acidental.",
    ],
  },
  {
    id: "conteudo",
    title: "Padrão de conteúdo das páginas",
    items: [
      "Cada página publicada tem propósito próprio, conteúdo original e informação útil para quem busca aquele reparo naquela localidade.",
      "Não publicamos página só para preencher palavra-chave: se não houver capacidade operacional real para o serviço, a rota não é criada (regra fail-closed do projeto).",
      "Prazos, faixas de valor e escopo vêm de uma fonte única no repositório e são validados no build; qualquer divergência quebra a publicação.",
      "Fotos de terceiros aparecem com crédito e licença conferidos automaticamente antes do deploy.",
      "Avaliações de clientes só entram no site com autorização expressa e conferência manual — nunca são geradas ou reescritas.",
    ],
  },
  {
    id: "cookies-terceiros",
    title: "Cookies e dados usados por anunciantes",
    items: [
      "Redes de anúncios de terceiros, incluindo o Google, podem usar cookies e identificadores para exibir anúncios com base em visitas anteriores a este ou a outros sites.",
      "O Google usa o cookie DoubleClick para veicular anúncios com base na visita do usuário a este e a outros sites na internet.",
      "Você pode desativar a publicidade personalizada do Google nas Configurações de anúncios do Google e as de outras redes em www.aboutads.info/choices.",
      "No banner de consentimento você escolhe se aceita a telemetria e os cookies de publicidade. Quando você nega, nenhum evento de medição é gravado e a publicidade fica não personalizada.",
    ],
  },
  {
    id: "nao-aceitamos",
    title: "O que não aceitamos anunciar",
    items: [
      "Serviços que prometam conserto sem diagnóstico, garantia irreal ou valor abaixo do custo técnico.",
      "Conteúdo adulto, apostas, empréstimo predatório, produtos de saúde sem registro e qualquer oferta enganosa.",
      "Anúncio que se confunda com nosso atendimento ou que peça dado pessoal do visitante fora dos nossos canais.",
    ],
  },
  {
    id: "patrocinio-direto",
    title: "Patrocínio direto e ads.txt",
    items: [
      "Patrocínios diretos são fechados por contrato, com prazo definido e rótulo permanente de patrocínio.",
      "Publicamos um arquivo ads.txt na raiz do domínio listando apenas os vendedores autorizados a comercializar nosso inventário.",
      "Qualquer oferta de inventário deste site fora dos vendedores listados no ads.txt não é autorizada.",
    ],
  },
];

const FAQ = [
  {
    question: "Os anúncios influenciam o diagnóstico ou o preço do serviço?",
    answer:
      "Não. Faixas de valor, prazos e escopo vêm de uma fonte única do projeto, validada no build. Publicidade é receita separada e não altera nenhuma recomendação técnica.",
  },
  {
    question: "Aparece anúncio durante a triagem ou o agendamento?",
    answer:
      "Não. O funil de triagem, o agendador e a consulta de ordem de serviço são telas de atendimento e ficam sem anúncio, para não gerar clique acidental nem confusão com o botão de WhatsApp.",
  },
  {
    question: "Como desativo os anúncios personalizados?",
    answer:
      "Você pode negar a publicidade personalizada no banner de consentimento do site, desativar nas Configurações de anúncios do Google e usar www.aboutads.info/choices para as demais redes.",
  },
  {
    question: "Para que serve o arquivo ads.txt?",
    answer:
      "Ele lista publicamente quais empresas estão autorizadas a vender espaço publicitário deste domínio. Serve para bloquear revenda não autorizada do nosso inventário.",
  },
];

const PoliticaDeAnuncios = () => (
  <Layout>
    <SEOHead
      title="Política de Anúncios e Patrocínio | Preciso de um Técnico"
      description="Como identificamos publicidade, onde os anúncios não aparecem, cookies de terceiros e Google, o que não aceitamos anunciar e para que serve o arquivo ads.txt do domínio."
      canonical={CANONICAL}
      breadcrumbs={[
        { name: "Início", url: "https://precisodeumtecnico.com/" },
        { name: "Política de Anúncios e Patrocínio", url: CANONICAL },
      ]}
      faq={FAQ}
    />

    <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Megaphone className="h-4 w-4" aria-hidden="true" />
            Transparência comercial
          </span>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Política de Anúncios e Patrocínio</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Este site vive principalmente do serviço técnico prestado. Quando exibe publicidade, ela é
            identificada, fica fora das telas de atendimento e não interfere em diagnóstico, prazo ou preço.
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
            <h2 className="mb-4 text-xl font-bold">Perguntas frequentes sobre publicidade</h2>
            <div className="space-y-4">
              {FAQ.map((f) => (
                <div key={f.question} className="rounded-lg border border-border bg-muted/20 p-4">
                  <h3 className="font-semibold">{f.question}</h3>
                  <p className="mt-2 text-muted-foreground">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <h2 className="mb-2 flex items-center gap-2 text-xl font-bold">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
              Documentos relacionados
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              <li>
                <Link to="/politica-privacidade" className="text-primary underline underline-offset-4">
                  Política de Privacidade e LGPD
                </Link>
              </li>
              <li>
                <Link to="/termos-uso" className="text-primary underline underline-offset-4">
                  Termos de Uso do site
                </Link>
              </li>
              <li>
                <Link to="/creditos-de-imagens" className="text-primary underline underline-offset-4">
                  Créditos e licenças das imagens
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-primary underline underline-offset-4">
                  Falar sobre patrocínio
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default PoliticaDeAnuncios;
