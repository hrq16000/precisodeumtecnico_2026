import { useEffect, useMemo, useState } from "react";
import {
  buildWhatsAppUrl,
  currentSourcePage,
  readStoredLocation,
  type WhatsAppContext,
} from "@/lib/whatsapp";

/**
 * URL de WhatsApp segura para SSR/hidratação.
 *
 * O primeiro render (servidor e hidratação) usa apenas o contexto
 * determinístico recebido por props; localStorage e window.location só
 * entram após a hidratação — evitando mismatch de atributos no href.
 */
export function useWhatsAppLink(ctx: WhatsAppContext = {}): string {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const ctxKey = JSON.stringify(ctx);
  return useMemo(() => {
    const base = JSON.parse(ctxKey) as WhatsAppContext;
    if (!hydrated) return buildWhatsAppUrl(base);
    const stored = readStoredLocation();
    return buildWhatsAppUrl({
      ...stored,
      ...base,
      sourcePage: base.sourcePage ?? currentSourcePage(),
    });
  }, [hydrated, ctxKey]);
}
