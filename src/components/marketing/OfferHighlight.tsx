import { Zap } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { cn } from "@/lib/utils";

interface OfferHighlightProps {
  /** Slug do serviço para pré-popular o TriageWizard (Fase B). */
  serviceSlug?: string;
  /** Cidade/região exibida discretamente acima do preço (opcional). */
  region?: string;
  /** Variante visual: full = bloco hero; inline = faixa compacta. */
  variant?: "full" | "inline";
  className?: string;
  /** Handler opcional do CTA. Quando ausente, faz scroll para #triagem. */
  onStartTriage?: () => void;
}

/**
 * Faixa amarela de destaque da oferta âncora.
 *
 * Hierarquia visual obrigatória (memória do projeto):
 *   1. Preço R$ 99,99 / 30 min  (foreground máximo)
 *   2. Link "Termos e Condições" ancorado em /termos-orcamento#visita-99
 *      diretamente abaixo do preço.
 *
 * Cores e tokens semânticos: usa primary (amarelo/dourado da marca) +
 * primary-foreground. NUNCA hardcodar #FFD600 — manter design system.
 */
export function OfferHighlight({
  serviceSlug,
  region,
  variant = "full",
  className,
  onStartTriage,
}: OfferHighlightProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onStartTriage) {
      e.preventDefault();
      onStartTriage();
      return;
    }
    // Fallback enquanto o TriageWizard (Fase B) não está plugado:
    // rola para a âncora #triagem se existir, ou abre o form atual.
    const el = document.getElementById("triagem") || document.getElementById("contato");
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const termosHref = "/termos-orcamento#visita-99";

  return (
    <aside
      data-component="offer-highlight"
      data-service={serviceSlug}
      aria-label="Oferta visita técnica R$ 99,99"
      className={cn(
        "relative overflow-hidden rounded-2xl border border-primary/60 bg-primary text-primary-foreground shadow-lg",
        variant === "full" ? "p-6 sm:p-8" : "p-4",
        className,
      )}
    >
      {/* Brilho decorativo sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-foreground/10 blur-2xl"
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/15 ring-1 ring-primary-foreground/30">
            <Zap className="h-6 w-6" aria-hidden />
          </div>

          <div className="space-y-1.5">
            {region && (
              <p className="text-xs font-medium uppercase tracking-wider opacity-80">
                {region}
              </p>
            )}

            {/* (1) PREÇO — hierarquia máxima */}
            <p className="flex items-baseline gap-2 font-display">
              <span className="text-3xl font-extrabold leading-none sm:text-4xl">
                R$&nbsp;99,99
              </span>
              <span className="text-sm font-semibold opacity-90 sm:text-base">
                / visita técnica de 30 min
              </span>
            </p>

            {/* (2) TERMOS — imediatamente abaixo do preço */}
            <p className="text-xs sm:text-sm">
              <Link
                to={termosHref}
                className="font-medium underline decoration-primary-foreground/60 underline-offset-4 hover:decoration-primary-foreground"
              >
                Ver Termos e Condições da visita
              </Link>
              <span className="opacity-80">
                {" "}— valor abatido em caso de fechamento.
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleClick}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold uppercase tracking-wide transition",
            "bg-primary-foreground text-primary shadow-md hover:shadow-xl hover:scale-[1.02]",
            "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
            variant === "full" ? "sm:text-base" : "",
          )}
          aria-label="Iniciar triagem técnica"
        >
          <Zap className="h-4 w-4" aria-hidden />
          Iniciar triagem
        </button>
      </div>
    </aside>
  );
}

export default OfferHighlight;
