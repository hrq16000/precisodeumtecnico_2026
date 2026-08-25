import { useEffect, useState } from "react";
import { useLocation } from "@/lib/router-compat";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { TriageWizardV2 } from "@/components/triage/v2/TriageWizardV2";
import { TriageErrorBoundary } from "@/components/triage/v2/TriageErrorBoundary";
import { isTriageEnabled } from "@/lib/triageFlag";
import type { Category } from "@/components/triage/triageMachine";
import { logWaEvent } from "@/lib/waAudit";
import { pushLocalAnalyticsEvent } from "@/lib/localAnalytics";
import { persistTriageEvent, flushTriageEventBuffer } from "@/lib/triageEventBuffer";
import {
  resolveDeepLinkContext,
  readDeepLinkContext,
  saveDeepLinkContext,
  applyContextToDraft,
} from "@/lib/triage/deepLinkContext";



/**
 * Global TriageWizard launcher.
 *
 * IMPORTANTE: cada abertura força REMOUNT do <TriageWizard> via `key={openCount}`
 * — resolve o bug em que o quiz reabria no passo final (state stale) e garante
 * que todo CTA principal sempre inicia do passo 1.
 *
 * No mobile o Dialog vira full-screen (100dvh) para foco total e sem overflow.
 */
export function GlobalTriageLauncher() {
  const [open, setOpen] = useState(false);
  const [openCount, setOpenCount] = useState(0);
  const [detail, setDetail] = useState<{
    source?: string;
    category?: Category;
    symptomSlug?: string;
    city?: string;
    neighborhood?: string;
  }>({});
  const location = useLocation();
  const enabled = isTriageEnabled();

  const openFresh = (
    d: {
      source?: string;
      category?: Category;
      symptomSlug?: string;
      city?: string;
      neighborhood?: string;
    },
    href?: string,
    kind: "whatsapp" | "tel" = "whatsapp",
    surfaceOverride?: string,
  ) => {
    setDetail(d ?? {});
    setOpenCount((n) => n + 1); // força remount → estado zerado
    setOpen(true);
    logWaEvent({ source: d?.source, href: href ?? null, kind, category: d?.category ?? null, bypass: false });
    pushLocalAnalyticsEvent({
      event: "triage_open",
      source: d?.source,
      surface: surfaceOverride ?? (kind === "tel" ? "cta_tel" : "cta_whatsapp"),
      page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      service: d?.category,
      city: d?.city,
      neighborhood: d?.neighborhood,
    });
  };



  useEffect(() => {
    if (!enabled) return;
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<{
        source?: string;
        category?: Category;
        symptomSlug?: string;
        city?: string;
        neighborhood?: string;
      }>;
      openFresh(ce.detail ?? {});
    };
    window.addEventListener("triage:open", onOpen);
    return () => window.removeEventListener("triage:open", onOpen);
  }, [enabled]);


  // Interceptor global (kill-switch p/ CTAs WhatsApp/telefone).
  useEffect(() => {
    if (!enabled) return;
    // Guarda anti-duplo-clique: bloqueia cliques em < 400ms.
    let lastClick = 0;
    const handler = (e: MouseEvent) => {
      const rawTarget = e.target as HTMLElement | null;
      const anchor = rawTarget?.closest?.("a") as HTMLAnchorElement | null;
      // Fallback: qualquer elemento marcado com data-triage-source dispara o
      // wizard mesmo sem ser um <a href="wa.me/...">. Corrige CTAs de portal
      // (botões/spans) que antes não eram capturados pelo interceptor.
      const triageTrigger = rawTarget?.closest?.("[data-triage-source]") as HTMLElement | null;
      const href = anchor?.getAttribute("href") || "";
      const isWhats = href.includes("wa.me") || href.includes("api.whatsapp.com") || href.startsWith("whatsapp:");
      const isTel = href.startsWith("tel:");

      if (!anchor && !triageTrigger) return;
      if (anchor && !isWhats && !isTel && !triageTrigger) return;

      const el = (anchor ?? triageTrigger)!;
      const source = el.dataset.waSource || el.dataset.triageSource || "cta-intercept";
      const category = (el.dataset.triageCategory as Category | undefined) ?? undefined;
      const symptomSlug = el.dataset.triageSymptom || undefined;
      const city = el.dataset.triageCity || undefined;
      const neighborhood = el.dataset.triageNeighborhood || undefined;
      const kind: "whatsapp" | "tel" = isTel ? "tel" : "whatsapp";

      // data-wa-keep marca fluxos que já coletaram o contexto (rodapé,
      // abertura de O.S.) e devem seguir direto para o WhatsApp.
      if (anchor?.dataset.waKeep) {
        logWaEvent({ source: source || "footer-keep", href, kind, bypass: true });
        return;
      }

      // Telemetria: registra CADA clique interceptado antes de qualquer
      // early-return por dedupe — facilita diagnosticar botões "sem efeito".
      pushLocalAnalyticsEvent({
        event: "triage_cta_intercept",
        source,
        surface: kind === "tel" ? "cta_tel" : "cta_whatsapp",
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
        city,
        neighborhood,
      });
      // Persistência em localStorage — útil quando o usuário navega/sai
      // antes do flush em memória.
      persistTriageEvent({
        event: "triage_cta_intercept",
        source,
        surface: kind === "tel" ? "cta_tel" : "cta_whatsapp",
        page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
      });

      e.preventDefault();
      e.stopPropagation();
      const now = Date.now();
      if (now - lastClick < 400) {
        pushLocalAnalyticsEvent({
          event: "triage_cta_dedupe_skip",
          source,
          page_path: typeof window !== "undefined" ? window.location.pathname : undefined,
        });
        return;
      }
      lastClick = now;
      openFresh({ source, category, symptomSlug, city, neighborhood }, href, kind);
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [enabled]);

  // Fecha o modal ao navegar entre rotas.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Deep-link de agendamento: qualquer URL com #agendamento / #triagem /
  // #triage abre a triagem direto (usado nos links de agendamento do Google
  // Business Profile e em campanhas). O hash é limpo após abrir para que o
  // botão "voltar" não reabra o modal em loop.
  //
  // Rodada 4J: o contexto (equipamento/sintoma/cidade/bairro) é resolvido a
  // partir da querystring E da rota do cluster, pré-selecionado no rascunho
  // do wizard e persistido em sessionStorage — assim um reload restaura o
  // MESMO contexto, sem nunca inventar cidade/bairro.
  useEffect(() => {
    if (!enabled) return;
    const HASHES = ["#agendamento", "#triagem", "#triage"];
    const tryOpen = (fromRestore = false) => {
      const hash = window.location.hash.toLowerCase();
      if (!fromRestore && !HASHES.includes(hash)) return;
      const params = new URLSearchParams(window.location.search);
      const context = resolveDeepLinkContext({
        params,
        pathname: window.location.pathname,
        fallback: readDeepLinkContext() ?? undefined,
      });
      saveDeepLinkContext(context);
      applyContextToDraft(context);
      openFresh(
        {
          source: context.source,
          category: context.equipment as Category | undefined,
          symptomSlug: context.symptom,
          city: context.city,
          neighborhood: context.neighborhood,
        },
        undefined,
        "whatsapp",
        "deeplink_hash",
      );
      if (!fromRestore) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
    };
    const onHashChange = () => tryOpen(false);
    const id = window.setTimeout(onHashChange, 0);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("hashchange", onHashChange);
    };

  }, [enabled, location.pathname, location.hash]);



  // Ao fechar o wizard, drena o buffer persistente — expõe eventos
  // acumulados (BACK / auto-advance / intercept) em
  // window.__PDT_TRIAGE_BUFFER_FLUSHED__ para diagnóstico.
  useEffect(() => {
    if (open) return;
    flushTriageEventBuffer();
  }, [open]);


  // Marca <body> quando o modal está aberto — usado por CSS para esconder
  // botões flutuantes de WhatsApp e bloquear interação com o rodapé.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) document.body.setAttribute("data-triage-open", "true");
    else document.body.removeAttribute("data-triage-open");
    return () => document.body.removeAttribute("data-triage-open");
  }, [open]);

  if (!enabled) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="
          p-0 gap-0 border-0 bg-transparent shadow-none
          w-screen max-w-full h-[100dvh] rounded-none
          translate-x-0 translate-y-0 left-0 top-0
          sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]
          sm:w-full sm:max-w-[640px] sm:h-auto sm:rounded-lg
          overflow-hidden
          [&>button.absolute]:hidden
        "
      >
        <VisuallyHidden>
          <DialogTitle>Triagem técnica</DialogTitle>
          <DialogDescription>
            Assistente guiado para triagem obrigatória do seu equipamento em 7 etapas.
          </DialogDescription>
        </VisuallyHidden>
        <TriageErrorBoundary onReset={() => { setOpen(false); setTimeout(() => setOpenCount((n) => n + 1), 50); setTimeout(() => setOpen(true), 100); }}>
          <TriageWizardV2
            key={openCount}
            source={detail.source || "global-launcher"}
            onClose={() => setOpen(false)}
          />
        </TriageErrorBoundary>
      </DialogContent>
    </Dialog>
  );
}
