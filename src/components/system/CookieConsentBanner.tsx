import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import { Cookie, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  getConsentPrefs,
  setConsentPrefs,
  initConsent,
  CONSENT_CHANGE_EVENT,
} from "@/lib/consent";
import { trackEvent } from "@/lib/analytics";

/**
 * Banner de consentimento (LGPD + Consent Mode v2). Enquanto não houver
 * decisão, nenhuma tag do Google (medição ou AdSense) é carregada — apenas a
 * telemetria local, sem PII.
 *
 * Rodada 35 — consentimento granular:
 *  - "Medição" (analytics) e "Publicidade" (ads) são escolhas separadas;
 *  - a decisão é armazenada com carimbo de data/hora (prova de captura);
 *  - o banner pode ser reaberto por qualquer link via `openConsentPreferences()`.
 */
export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [ads, setAds] = useState(true);

  useEffect(() => {
    initConsent();
    setVisible(getConsentPrefs() === null);
  }, []);

  useEffect(() => {
    function reopen() {
      const prefs = getConsentPrefs();
      setAnalytics(prefs?.analytics ?? true);
      setAds(prefs?.ads ?? true);
      setShowPrefs(true);
      setVisible(true);
    }
    window.addEventListener(CONSENT_CHANGE_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (visible) document.body.setAttribute("data-cookie-banner", "open");
    else document.body.removeAttribute("data-cookie-banner");
    return () => document.body.removeAttribute("data-cookie-banner");
  }, [visible]);

  if (!visible) return null;

  function decide(next: { analytics: boolean; ads: boolean }) {
    setConsentPrefs(next);
    setVisible(false);
    setShowPrefs(false);
    trackEvent("cookie_consent", {
      consent: next.analytics || next.ads ? "granted" : "denied",
      analytics: next.analytics ? "1" : "0",
      ads: next.ads ? "1" : "0",
    });
  }

  return (
    <div data-cookie-banner-root
      // Banner não-modal: `region` evita colidir com o contrato de dialog
      // único da triagem e é a semântica correta para aviso persistente.
      role="region"
      aria-label="Consentimento de cookies"
      data-cookie-consent

      className="fixed bottom-0 left-0 right-0 z-[60] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:right-auto sm:max-w-sm"
    >
      <div className="rounded-xl border border-border bg-card card-shadow p-3">
        <p className="flex items-start gap-2 text-xs leading-snug text-card-foreground">
          <Cookie className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            Usamos cookies de medição e de publicidade. As tags do Google (incluindo AdSense)
            só são ativadas após o seu aceite.{" "}
            <Link to="/politica-de-cookies" className="font-medium text-primary underline">
              Política de Cookies
            </Link>
            {" · "}
            <Link to="/politica-privacidade" className="font-medium text-primary underline">
              Privacidade
            </Link>
            .
          </span>
        </p>

        {showPrefs && (
          <div className="mt-3 space-y-2 rounded-lg border border-border bg-muted/40 p-2">
            <label className="flex items-center justify-between gap-3 text-xs">
              <span>
                <span className="block font-medium text-card-foreground">Medição (analytics)</span>
                <span className="text-muted-foreground">Quais páginas geram atendimento.</span>
              </span>
              <Switch
                checked={analytics}
                onCheckedChange={setAnalytics}
                aria-label="Permitir cookies de medição"
              />
            </label>
            <label className="flex items-center justify-between gap-3 text-xs">
              <span>
                <span className="block font-medium text-card-foreground">Publicidade (anúncios)</span>
                <span className="text-muted-foreground">Anúncios personalizados de terceiros.</span>
              </span>
              <Switch
                checked={ads}
                onCheckedChange={setAds}
                aria-label="Permitir cookies de publicidade"
              />
            </label>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-h-11 flex-1"
            onClick={() => decide({ analytics: false, ads: false })}
          >
            Recusar
          </Button>
          {showPrefs ? (
            <Button
              size="sm"
              className="min-h-11 flex-1"
              onClick={() => decide({ analytics, ads })}
            >
              Salvar preferências
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="min-h-11 flex-1"
                onClick={() => setShowPrefs(true)}
              >
                <SlidersHorizontal className="mr-1 h-4 w-4" aria-hidden="true" />
                Preferências
              </Button>
              <Button
                size="sm"
                className="min-h-11 flex-1"
                onClick={() => decide({ analytics: true, ads: true })}
              >
                Aceitar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
