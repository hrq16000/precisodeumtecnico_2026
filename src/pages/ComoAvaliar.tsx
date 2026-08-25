import { Link } from "@/lib/router-compat";
import { Star, QrCode as QrIcon, MessageCircle, ShieldCheck, Printer } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { QrCode } from "@/components/QrCode";
import { buildReviewLink, SITE_ORIGIN } from "@/lib/reviews";
import { trackEvent } from "@/lib/analytics";

/**
 * Página de ajuda "Como avaliar": instruções passo a passo + link/QR rastreável
 * para entregar ao cliente depois do checklist ou da Ordem de Serviço.
 */

const reviewLink = buildReviewLink({ source: "pagina_como_avaliar" });

const steps = [
  {
    title: "1. Abra o link de avaliação",
    text: "Você recebe o link no WhatsApp assim que a Ordem de Serviço é finalizada. Também pode escanear o QR code desta página, impresso no checklist ou na OS.",
  },
  {
    title: "2. Dê a nota em estrelas",
    text: "São 5 estrelas: 1 para insatisfeito e 5 para totalmente satisfeito. A nota é obrigatória e leva menos de 10 segundos.",
  },
  {
    title: "3. Escreva o que achou (opcional)",
    text: "Um comentário curto sobre prazo, atendimento e resultado ajuda outros clientes da sua região a escolherem com segurança.",
  },
  {
    title: "4. Autorize (ou não) a publicação",
    text: "Sua avaliação só aparece no site se você marcar a autorização de publicação. Sem esse aceite, ela fica apenas no nosso controle interno de qualidade.",
  },
];

const faq = [
  {
    question: "Preciso me cadastrar para avaliar?",
    answer:
      "Não. A avaliação é feita direto na página /avaliar, sem login e sem cadastro. Basta informar seu nome, a nota em estrelas e, se quiser, um comentário.",
  },
  {
    question: "Minha avaliação aparece na hora no site?",
    answer:
      "Não. Toda avaliação entra como pendente e passa por moderação. Ela só é publicada se estiver aprovada e se você tiver autorizado expressamente a publicação.",
  },
  {
    question: "Posso avaliar sem autorizar a publicação?",
    answer:
      "Pode. Basta não marcar a caixa de autorização. Nesse caso, sua nota é usada apenas internamente para controle de qualidade do atendimento.",
  },
  {
    question: "Como peço a exclusão da minha avaliação depois?",
    answer:
      "Solicite pelo mesmo WhatsApp do atendimento informando o número da OS. A avaliação é despublicada e os dados são tratados conforme a Política de Privacidade e LGPD.",
  },
  {
    question: "Onde encontro o número da minha Ordem de Serviço?",
    answer:
      "O número da OS (protocolo) está no topo da Ordem de Serviço enviada no WhatsApp e no checklist entregue ao final do atendimento.",
  },
];

export default function ComoAvaliar() {
  return (
    <Layout>
      <SEOHead
        title="Como Avaliar o Atendimento | Preciso de Um Técnico"
        description="Passo a passo para avaliar o atendimento técnico com estrelas, autorizar (ou não) a publicação no site e usar o link ou QR code de avaliação enviado após a Ordem de Serviço."
        canonical={`${SITE_ORIGIN}/como-avaliar`}
        breadcrumbs={[
          { name: "Início", url: `${SITE_ORIGIN}/` },
          { name: "Como avaliar", url: `${SITE_ORIGIN}/como-avaliar` },
        ]}
        faq={faq}
      />

      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-3 block">
            Pós-atendimento
          </span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            Como avaliar o atendimento em menos de 1 minuto
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Depois que a Ordem de Serviço é finalizada, você recebe um link rastreável de avaliação
            no WhatsApp. Nele você dá a nota em estrelas, escreve um comentário opcional e decide se
            autoriza a publicação do depoimento no site. Nada é publicado sem esse aceite.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {steps.map((s) => (
              <div key={s.title} className="bg-card border border-border rounded-2xl p-6 card-shadow">
                <h2 className="font-semibold text-lg text-card-foreground mb-2">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-card border border-primary/30 rounded-2xl p-6 md:p-8 card-shadow flex flex-col md:flex-row items-center gap-8 mb-12">
            <QrCode
              value={reviewLink}
              alt="QR code para abrir a página de avaliação do atendimento"
              size={176}
              className="rounded-xl bg-white p-2"
            />
            <div className="flex-1 text-center md:text-left">
              <h2 className="font-display text-2xl font-bold text-foreground mb-3 flex items-center gap-2 justify-center md:justify-start">
                <QrIcon className="w-6 h-6 text-primary" aria-hidden="true" />
                QR code de avaliação
              </h2>
              <p className="text-muted-foreground mb-5">
                Escaneie com a câmera do celular ou toque no botão abaixo. O link já vem com os
                parâmetros de origem (UTM) preservados, então conseguimos identificar de qual
                atendimento veio cada avaliação.
              </p>
              <Link
                to="/avaliar"
                data-cta="review_page"
                onClick={() =>
                  trackEvent("review_link_click", {
                    surface: "como_avaliar",
                    cta_id: "review_page",
                    utm_source: "whatsapp",
                    utm_medium: "review_request",
                    utm_campaign: "pagina_como_avaliar",
                  })
                }
                className="inline-flex items-center gap-2 min-h-[48px] px-6 rounded-xl bg-primary text-primary-foreground font-semibold"
              >
                <Star className="w-5 h-5" aria-hidden="true" />
                Avaliar meu atendimento
              </Link>
              <p className="text-xs text-muted-foreground mt-4 break-all">{reviewLink}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="p-5 rounded-xl border border-border">
              <ShieldCheck className="w-5 h-5 text-primary mb-2" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                Publicação só com autorização expressa. Sem consentimento, nada vai ao ar.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border">
              <MessageCircle className="w-5 h-5 text-primary mb-2" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                O link chega pelo mesmo WhatsApp do atendimento, logo após a OS ser finalizada.
              </p>
            </div>
            <div className="p-5 rounded-xl border border-border">
              <Printer className="w-5 h-5 text-primary mb-2" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                O QR code também é impresso no checklist final e na Ordem de Serviço.
              </p>
            </div>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            Perguntas frequentes sobre avaliação
          </h2>
          <div className="space-y-4 mb-10">
            {faq.map((item) => (
              <div key={item.question} className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-card-foreground mb-2">{item.question}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            Tratamos os dados da avaliação conforme a{" "}
            <Link to="/politica-privacidade" className="text-primary underline">
              Política de Privacidade e LGPD
            </Link>
            . Você pode pedir a exclusão a qualquer momento informando o número da OS.
          </p>
        </div>
      </section>
    </Layout>
  );
}
