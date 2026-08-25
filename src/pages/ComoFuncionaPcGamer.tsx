import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { PcQuoteWizard } from "@/components/marketing/PcQuoteWizard";
import { PC_ASSEMBLY_PROCESS } from "@/data/pcAssemblyProcess";
import { PC_ASSEMBLY_POLICY } from "@/data/pcAssemblyPolicy";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowRight, Clock, MessageCircle, Route } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/servicos/pc-gamer/como-funciona";

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Como funciona a montagem de PC gamer em Curitiba",
  description:
    "Etapas do atendimento de montagem e configuração de desktops e PCs gamer, com prazos estimados por etapa e entregáveis de cada fase.",
  totalTime: "P5D",
  step: PC_ASSEMBLY_PROCESS.steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title.replace(/^\d+\.\s*/, ""),
    text: s.description,
    url: `${CANONICAL}#${s.id}`,
  })),
};

const ComoFuncionaPcGamer = () => {
  const waUrl = buildWhatsAppUrl({
    service: "montagem de PC gamer",
    sourcePage: "/servicos/pc-gamer/como-funciona",
  });

  return (
    <Layout>
      <SEOHead
        title="Como Funciona a Montagem de PC Gamer | Etapas e Prazos"
        description="Veja passo a passo como funciona a montagem de PC gamer: conferência de peças, orçamento por escrito, montagem, BIOS e drivers, checklist de testes e entrega com laudo."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Início", url: "https://precisodeumtecnico.com/" },
          { name: "Serviços", url: "https://precisodeumtecnico.com/servicos" },
          { name: "Montagem de PC Gamer", url: "https://precisodeumtecnico.com/servicos/pc-gamer" },
          { name: "Como funciona", url: CANONICAL },
        ]}
        service={{
          name: "Montagem e configuração de PC Gamer",
          description: PC_ASSEMBLY_POLICY.scope.summary,
          areaServed: "Curitiba e Região Metropolitana",
        }}
        faq={PC_ASSEMBLY_PROCESS.faq.map((f) => ({ ...f }))}
        structuredData={[howToSchema]}
      />

      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <Route className="h-4 w-4" aria-hidden="true" />
            Etapas e prazos estimados
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Como funciona a montagem de PC gamer
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Do envio da lista de peças à entrega com laudo: cada etapa do atendimento, o que sai de
            cada fase e a estimativa de prazo antes da confirmação por escrito.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-wa-source="pc-como-funciona-hero"
              data-service="montagem de PC gamer"
              aria-label="Falar no WhatsApp sobre montagem de PC gamer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Enviar minha configuração
            </a>
            <Link
              to="/servicos/pc-gamer"
              className="inline-flex items-center gap-2 border border-border bg-card text-card-foreground font-semibold px-6 py-3 rounded-xl hover:bg-accent/40 transition-colors"
            >
              Ver o serviço completo
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl space-y-14">
          <section aria-labelledby="etapas-montagem">
            <h2
              id="etapas-montagem"
              className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3"
            >
              Etapas do atendimento
            </h2>
            <p className="text-sm text-muted-foreground mb-6">{PC_ASSEMBLY_PROCESS.disclaimer}</p>
            <ol className="space-y-4">
              {PC_ASSEMBLY_PROCESS.steps.map((step) => (
                <li key={step.id} id={step.id} className="p-5 rounded-xl bg-card border border-border/50">
                  <h3 className="font-bold text-card-foreground mb-1">{step.title}</h3>
                  <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {step.estimate}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  <p className="text-sm text-card-foreground mt-2">
                    <span className="font-semibold">Você recebe:</span> {step.output}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <PcQuoteWizard sourcePage="/servicos/pc-gamer/como-funciona" />

          <section aria-labelledby="faq-como-funciona">
            <h2
              id="faq-como-funciona"
              className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6"
            >
              Perguntas frequentes sobre o processo
            </h2>
            <div className="space-y-4">
              {PC_ASSEMBLY_PROCESS.faq.map((item) => (
                <article key={item.question} data-faq-item className="p-5 rounded-xl bg-card border border-border/50">
                  <h3 className="font-bold text-card-foreground mb-2" data-faq-question data-testid="faq-question">{item.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed" data-faq-answer>{item.answer}</p>
                </article>

              ))}
            </div>
          </section>

          <nav aria-label="Páginas relacionadas" className="p-5 rounded-xl bg-muted/40 border border-border/50">
            <h2 className="font-bold text-foreground mb-3">Leia também</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/politica-de-pecas-do-cliente" className="text-primary hover:underline">
                  Política de peças do cliente
                </Link>
              </li>
              <li>
                <Link to="/servicos/pc-gamer" className="text-primary hover:underline">
                  Montagem e configuração de PC Gamer
                </Link>
              </li>
              <li>
                <Link to="/termos-orcamento-pre-aprovado" className="text-primary hover:underline">
                  Termos do orçamento pré-aprovado
                </Link>
              </li>
              <li>
                <Link to="/precos" className="text-primary hover:underline">
                  Preços e modalidades de atendimento
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </Layout>
  );
};

export default ComoFuncionaPcGamer;
