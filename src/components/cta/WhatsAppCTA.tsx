import { forwardRef, useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WaSource } from "@/lib/waSources";
import { buildWhatsAppUrl, readStoredLocation, currentSourcePage, type WhatsAppContext } from "@/lib/whatsapp";

type Variant = "primary" | "outline" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 transition-opacity",
  outline:
    "border border-border text-foreground hover:bg-muted transition-colors",
  ghost: "text-foreground hover:bg-muted transition-colors",
};

export interface WhatsAppCTAProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "aria-label"> {
  /** Origem do clique — precisa estar registrada em `src/lib/waSources.ts`. */
  source: WaSource;
  /** Serviço em linguagem natural: vira data-service e entra na mensagem. */
  service: string;
  /** Texto do aria-label; por padrão derivado do serviço. */
  ariaLabel?: string;
  /** Contexto extra da mensagem (cidade, bairro, endereço, página). */
  context?: WhatsAppContext;
  /** URL pronta (fluxos que já montam a mensagem, ex.: triagem). */
  href?: string;
  /** Usa a localização salva no browser quando disponível. Padrão: true. */
  useStoredLocation?: boolean;
  variant?: Variant;
  /** Ícone do WhatsApp antes do texto. Padrão: true. */
  withIcon?: boolean;
  children: React.ReactNode;
}

/**
 * CTA padrão de WhatsApp.
 *
 * Garante por construção os atributos exigidos pelo gate `check:cta-attrs`
 * e pelos contratos E2E: data-wa-source (valor do registro único),
 * data-service e aria-label — além de mensagem com contexto real.
 */
export const WhatsAppCTA = forwardRef<HTMLAnchorElement, WhatsAppCTAProps>(function WhatsAppCTA(
  {
    source,
    service,
    ariaLabel,
    context,
    href,
    useStoredLocation = true,
    variant = "primary",
    withIcon = true,
    className,
    children,
    ...rest
  },
  ref,
) {
  // SSR-safe: o primeiro render (servidor e hidratação) usa apenas o contexto
  // determinístico das props; localStorage/window entram só após a hidratação,
  // evitando mismatch de atributos no href.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const stored = hydrated && useStoredLocation ? readStoredLocation() : {};
  const merged: WhatsAppContext = {
    service,
    city: context?.city ?? stored.city,
    neighborhood: context?.neighborhood ?? stored.neighborhood,
    address: context?.address ?? stored.address,
    sourcePage: context?.sourcePage ?? (hydrated ? currentSourcePage() : ""),
  };
  const url = href ?? buildWhatsAppUrl(merged);

  return (
    <a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-wa-source={source}
      data-service={service}
      aria-label={ariaLabel ?? `Falar no WhatsApp sobre ${service}`}
      {...(merged.city ? { "data-city": merged.city } : {})}
      {...(merged.neighborhood ? { "data-neighborhood": merged.neighborhood } : {})}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold",
        VARIANTS[variant],
        className,
      )}
      {...rest}
    >
      {withIcon && <MessageCircle className="h-4 w-4" aria-hidden="true" />}
      {children}
    </a>
  );
});
