import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Megaphone, LayoutPanelTop, MapPin, ShieldCheck, Mail, ArrowRight, FileDown } from "lucide-react";
import { COMPANY } from "@/data/companyInfo";
import { nationalCities } from "@/data/nationalCities";
import { getAllServices } from "@/data/services";
import { MediaProposalForm } from "@/components/anuncie/MediaProposalForm";
import { trackCtaClick } from "@/lib/analytics";
import { MEDIA_KIT_PDF } from "@/data/mediaKit";

const CANONICAL = "https://precisodeumtecnico.com/anuncie";

const TERRITORIES = [
  { area: "Curitiba (por bairro)", formats: "Leaderboard · bloco no conteúdo · patrocínio de bairro", status: "Sob consulta" },
  { area: "São José dos Pinhais", formats: "Leaderboard · patrocínio de cidade", status: "Sob consulta" },
  { area: "Pinhais", formats: "Leaderboard · patrocínio de cidade", status: "Sob consulta" },
  { area: "Colombo", formats: "Leaderboard · patrocínio de cidade", status: "Sob consulta" },
  { area: "Araucária e demais cidades da RMC", formats: "Leaderboard · bloco no conteúdo", status: "Sob consulta" },
  { area: "Cobertura nacional (páginas de cidade)", formats: "Bloco no conteúdo · conteúdo patrocinado", status: "Sob consulta" },
];


/**
 * Mídia kit e página comercial de patrocínio.
 *
 * Regra fail-closed: nenhum número de tráfego, alcance ou audiência é
 * publicado aqui — não existe fonte auditável no repositório. Métricas
 * (Search Console / analytics) são enviadas sob solicitação ao anunciante.
 */

const FORMATS = [
  {
    icon: LayoutPanelTop,
    title: "Banner de topo (leaderboard)",
    detail:
      "Acima da primeira dobra em páginas de serviço e de localidade. Formato responsivo, entregue via Google AdSense ou inserção direta.",
  },
  {
    icon: Megaphone,
    title: "Bloco no meio do conteúdo",
    detail:
      "Inserido entre as seções técnicas dos artigos e guias, onde o leitor já está comparando soluções. Alta atenção, baixa concorrência visual.",
  },
  {
    icon: MapPin,
    title: "Patrocínio de localidade",
    detail:
      "Destaque fixo em páginas de cidade e bairro específicos — indicado para negócios locais que querem aparecer só na sua área de cobertura.",
  },
  {
    icon: ShieldCheck,
    title: "Conteúdo patrocinado identificado",
    detail:
      "Publieditorial marcado como publicidade, seguindo a Política de Anúncios do portal. Sem link dofollow e sem promessa de posicionamento orgânico.",
  },
];

const AUDIENCE = [
  "Quem busca conserto e manutenção de equipamentos (computadores, notebooks, TVs, redes, CFTV, elétrica e ar-condicionado).",
  "Público majoritariamente de Curitiba e Região Metropolitana, com cobertura editorial em capitais e grandes cidades do Brasil.",
  "Intenção comercial alta: as páginas são construídas em torno de sintoma, preço e orçamento — não de curiosidade genérica.",
  "Tráfego predominantemente mobile, vindo de busca orgânica.",
];

const RULES = [
  "Não aceitamos anúncios de conteúdo adulto, jogos de azar, produtos ilegais, esquemas financeiros ou pirataria.",
  "Anúncios de concorrentes diretos de assistência técnica são avaliados caso a caso, para não confundir o visitante.",
  "Todo espaço publicitário respeita o Consent Mode v2: sem consentimento, nada de personalização ou cookies de publicidade.",
  "Publicidade nunca se disfarça de conteúdo editorial — todo bloco pago é rotulado.",
];

const FAQ = [
  {
    question: "Como recebo os dados de audiência do portal?",
    answer:
      "Enviamos por e-mail um extrato do Google Search Console e do analytics do portal referente ao período solicitado. Não publicamos números na página para evitar dados desatualizados ou estimativas sem lastro.",
  },
  {
    question: "Consigo anunciar só em uma cidade ou bairro?",
    answer:
      "Sim. O portal tem páginas dedicadas por cidade e por bairro, e o patrocínio pode ser limitado a esse recorte geográfico.",
  },
  {
    question: "O anúncio interfere no conteúdo técnico das páginas?",
    answer:
      "Não. As posições publicitárias são fixas e separadas do conteúdo. Recomendações técnicas, políticas de preço e prazos não são vendidas.",
  },
  {
    question: "Qual o formato de contratação?",
    answer:
      "Por período (mensal ou trimestral) ou por conjunto de páginas. O escopo, as posições e as regras de veiculação são acordados por escrito antes da publicação.",
  },
  {
    question: "Quais formatos de arquivo são aceitos e qual o prazo de subida?",
    answer:
      "Imagens estáticas em JPG, PNG ou WebP (peso máximo de 150 KB) e HTML5 responsivo sem áudio automático. Depois do material aprovado, a veiculação começa em até 2 dias úteis.",
  },
  {
    question: "Como funciona a aprovação do anúncio?",
    answer:
      "Revisamos criativo, página de destino e conformidade com a Política de Anúncios antes de publicar. Peças com promessa enganosa, claim sem comprovação ou destino quebrado são recusadas, com retorno por escrito para ajuste.",
  },
  {
    question: "Como confirmo datas e posicionamentos?",
    answer:
      "Envie o pedido pelo formulário desta página informando cidade/bairro e formato. Respondemos com as posições livres para o território, a data de início possível e a proposta; o agendamento só é considerado fechado após confirmação por escrito.",
  },
];


export default function Anuncie() {
  const cityCount = nationalCities.length;
  const serviceCount = getAllServices().length;

  return (
    <Layout>
      <SEOHead
        title="Anuncie no portal · Patrocínio e mídia kit"
        description="Formatos de anúncio, posições disponíveis, perfil de audiência e regras de veiculação para patrocinadores do portal de assistência técnica. Fale com o comercial."
        canonical={CANONICAL}
        faq={FAQ}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Anuncie", url: CANONICAL },
        ]}
      />

      <section className="bg-muted/30 py-10">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <Megaphone className="h-4 w-4" aria-hidden="true" /> Mídia kit
          </p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Anuncie para quem já está procurando um técnico
          </h1>
          <p className="mt-3 text-muted-foreground">
            O portal reúne conteúdo técnico de {serviceCount} categorias de serviço, páginas por
            bairro em Curitiba e Região Metropolitana e cobertura editorial em {cityCount} cidades
            do Brasil. Quem chega aqui está com um equipamento parado e decidindo onde resolver.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild className="min-h-11">
              <a
                href="#proposta"
                onClick={() =>
                  trackCtaClick({
                    surface: "advertising",
                    cta_id: "media_proposal_anchor",
                    label: "Solicitar proposta",
                    destination: "/anuncie#proposta",
                  })
                }
              >
                <Megaphone className="mr-2 h-4 w-4" aria-hidden="true" />
                Solicitar proposta
              </a>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <a
                href={MEDIA_KIT_PDF}
                download
                data-testid="media-kit-download"
                onClick={() =>
                  trackCtaClick({
                    surface: "advertising",
                    cta_id: "media_kit_pdf_page",
                    label: "Baixar mídia kit (PDF)",
                    destination: MEDIA_KIT_PDF,
                  })
                }
              >
                <FileDown className="mr-2 h-4 w-4" aria-hidden="true" />
                Baixar mídia kit (PDF)
              </a>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <a
                href="#proposta"
                onClick={() =>
                  trackCtaClick({
                    surface: "advertising",
                    cta_id: "media_proposal_hero",
                    label: "Falar com o comercial",
                    destination: "/anuncie#proposta",
                  })
                }
              >
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                Falar com o comercial
              </a>
            </Button>
            <Button asChild variant="ghost" className="min-h-11">
              <Link to="/politica-de-anuncios">Ver Política de Anúncios</Link>
            </Button>
          </div>

        </div>
      </section>

      <article className="container mx-auto max-w-3xl px-4 py-10">
        <section id="formatos" className="mb-10">
          <h2 className="text-xl font-semibold md:text-2xl">Formatos e posições disponíveis</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {FORMATS.map((f) => (
              <div key={f.title} className="rounded-lg border border-border p-4">
                <f.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mt-2 text-base font-medium">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="audiencia" className="mb-10">
          <h2 className="text-xl font-semibold md:text-2xl">Perfil de audiência</h2>
          <ul className="mt-3 space-y-2">
            {AUDIENCE.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            Números de sessões, impressões e cliques são enviados sob solicitação, direto do Search
            Console e do analytics do portal — não publicamos estimativas nesta página.
          </p>
        </section>

        <section id="regras" className="mb-10">
          <h2 className="text-xl font-semibold md:text-2xl">Regras de veiculação</h2>
          <ul className="mt-3 space-y-2">
            {RULES.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="disponibilidade" className="mb-10">
          <h2 className="text-xl font-semibold md:text-2xl">Disponibilidade por cidade e bairro</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Cada território tem um número limitado de posições para não poluir a página. O status
            abaixo é sempre confirmado no momento da proposta — não reservamos espaço sem acordo por
            escrito.
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <caption className="sr-only">Disponibilidade de posições publicitárias por território</caption>
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="py-2 pr-3 font-semibold">Território</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Formatos</th>
                  <th scope="col" className="py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {TERRITORIES.map((t) => (
                  <tr key={t.area} className="border-b border-border/60">
                    <th scope="row" className="py-2 pr-3 text-left font-medium">{t.area}</th>
                    <td className="py-2 pr-3 text-muted-foreground">{t.formats}</td>
                    <td className="py-2 text-muted-foreground">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            <strong className="font-medium text-foreground">Como confirmar datas e posicionamentos:</strong>{" "}
            envie o formulário abaixo com cidade/bairro, formato e período. Respondemos com as
            posições livres e a data de início possível; a reserva vale a partir do aceite por
            escrito da proposta.
          </p>
        </section>

        <section className="mb-10">
          <MediaProposalForm />
        </section>



        <section id="faq" className="mb-10">
          <h2 className="text-xl font-semibold md:text-2xl">Perguntas frequentes de anunciantes</h2>
          <dl className="mt-3 space-y-4">
            {FAQ.map((item) => (
              <div key={item.question} className="rounded-lg border border-border p-4">
                <dt className="font-medium">{item.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <h2 className="text-base font-semibold">Documentos relacionados</h2>
          <ul className="mt-2 space-y-1">
            <li><Link to="/politica-de-anuncios" className="text-primary underline">Política de Anúncios</Link></li>
            <li><Link to="/politica-de-cookies" className="text-primary underline">Política de Cookies</Link></li>
            <li><Link to="/politica-privacidade" className="text-primary underline">Política de Privacidade</Link></li>
            <li><Link to="/dados-da-empresa" className="text-primary underline">Dados da Empresa</Link></li>
            <li><Link to="/contato" className="text-primary underline">Contato</Link></li>
          </ul>
        </section>
      </article>
    </Layout>
  );
}
