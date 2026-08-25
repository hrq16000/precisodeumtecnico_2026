/**
 * Rodada 3S — hero próprio das páginas empresariais (B2B).
 *
 * Diferente do hero residencial: banda corporativa densa, hierarquia de CTA
 * explícita (ação primária = triagem qualificada; secundária = WhatsApp) e
 * chips de escopo operacional acima da dobra. Sem promessa de prazo,
 * sem número de clientes e sem instrução invasiva ao usuário.
 */
import { ArrowRight, Building2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackWhatsAppClick } from "@/lib/analytics";

interface Props {
  kicker: string;
  title: string;
  intro: string;
  /** Chips curtos de escopo — apenas fatos operacionais já publicados. */
  chips: string[];
  waUrl: string;
  waSource: string;
  waService: string;
  triage?: { source: string; category?: string; city?: string };
  /**
   * Rodada 3S — hub e serviço compartilham a linguagem, não o layout:
   * "hub" usa bloco de ação lateral (amplitude), "service" usa faixa de
   * ação em largura total logo abaixo do resumo (execução).
   */
  variant?: "hub" | "service";
  /** Rótulo do CTA primário (contexto empresarial da página). */
  ctaLabel?: string;
  /** Título do bloco de ação. */
  actionTitle?: string;
  /**
   * Rodada 3U — páginas institucionais limitam a densidade de conversão:
   * o hero mantém apenas o CTA de triagem.
   */
  showWhatsApp?: boolean;
}

export function B2BHero({
  kicker,
  title,
  intro,
  chips,
  waUrl,
  waSource,
  waService,
  triage,
  variant = "hub",
  ctaLabel = "Iniciar triagem empresarial",
  actionTitle = "Avaliação do cenário da empresa",
  showWhatsApp = true,
}: Props) {
  const isService = variant === "service";
  return (
    <section
      data-b2b-hero
      data-b2b-variant={variant}
      className={`relative border-b border-border py-8 md:py-14 ${isService ? "bg-card" : "bg-secondary/40"}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:56px_56px]"
        aria-hidden="true"
      />
      <div className="container relative mx-auto max-w-5xl px-4">
        <p className="mb-3 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Building2 className="h-4 w-4 text-primary" aria-hidden="true" />
          {kicker}
        </p>

        <div className={isService ? "grid gap-5" : "grid gap-6 md:grid-cols-[1.35fr_1fr] md:items-start"}>
          <div>
            <h1 className="mb-3 text-2xl font-bold leading-tight text-foreground md:text-4xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {intro}
            </p>
          </div>

          {/* Bloco de ação B2B: lateral no hub, faixa em largura total no serviço. */}
          <div
            className={`rounded-xl border border-border p-4 shadow-xs ${isService ? "bg-background" : "bg-card"}`}
          >
            <p className="mb-3 text-sm font-semibold text-card-foreground">{actionTitle}</p>
            <div className={isService ? "flex flex-col gap-2 sm:flex-row sm:items-center" : "flex flex-col gap-2"}>
              {triage && (
                <Button
                  size="lg"
                  className={`min-h-11 w-full justify-center whitespace-normal text-center leading-snug ${isService ? "sm:w-auto" : ""}`}
                  data-triage-cta
                  data-triage-source={triage.source}
                  data-triage-category={triage.category}
                  data-triage-city={triage.city}
                >
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              )}
              {showWhatsApp && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-wa-source={waSource}
                  data-service={waService}
                  aria-label="Falar no WhatsApp com a equipe empresarial"
                  data-wa-tracked="b2b_hero"
                  onClick={() =>
                    trackWhatsAppClick({
                      source: waSource,
                      service: waService,
                      city: triage?.city,
                      source_component: `b2b_hero_${variant}`,
                      cta_label: "Descrever o cenário no WhatsApp",
                    })
                  }
                  
                  className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted ${isService ? "sm:w-auto" : ""}`}
                >
                  <MessageCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                  Descrever o cenário no WhatsApp
                </a>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              O escopo e o valor são informados antes de qualquer execução.
            </p>
          </div>
        </div>

        {chips.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Escopo do atendimento empresarial">
            {chips.map((c) => (
              <li
                key={c}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
