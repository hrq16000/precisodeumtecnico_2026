import { StrictMode, Suspense, useEffect } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { HelmetProvider } from "@/lib/helmet-compat";

import appCss from "../styles.css?url";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ScrollToTop } from "@/components/ScrollToTop";
import { GlobalReveal } from "@/components/GlobalReveal";
import { GlobalTriageLauncher } from "@/components/triage/GlobalTriageLauncher";
import { E2ETriageBridge } from "@/components/triage/E2ETriageBridge";
import { SmartLocationPrompt } from "@/components/layout/SmartLocationPrompt";
import { GlobalErrorBoundary } from "@/components/system/GlobalErrorBoundary";
import { useRoutePageview } from "@/hooks/useRoutePageview";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import NotFound from "@/pages/NotFound";

// ported from main.tsx — browser-only init (Sentry, Web Vitals, global error
// listeners, WhatsApp CTA click delegation). Guarded so SSR never executes it.
import { initWebVitals } from "@/lib/webVitals";
import { trackWhatsAppClick } from "@/lib/analytics";
import { initSentry, captureHandledError } from "@/lib/sentry";

if (typeof window !== "undefined") {
  initSentry();

  window.addEventListener("error", (event) => {
    captureHandledError(event.error ?? new Error(event.message), {
      source: "window.error",
      filename: event.filename,
    });
  });
  window.addEventListener("unhandledrejection", (event) => {
    captureHandledError(event.reason ?? new Error("unhandledrejection"), {
      source: "window.unhandledrejection",
    });
  });

  initWebVitals();

  // Global delegation: qualquer <a>/<button> com data-wa-source dispara:
  //  (1) evento legado `whatsapp_click` no dataLayer/gtag (Google Ads).
  //  (2) evento local isolado `whatsapp_click` na fila interna (sem PII).
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as Element | null;
      const el = target?.closest?.("[data-wa-source]") as HTMLElement | null;
      if (!el) return;
      const source = el.dataset["waSource"] || "unknown";
      const service = el.dataset["service"];
      const city = el.dataset["city"];
      const neighborhood = el.dataset["neighborhood"];
      const cta_id = el.dataset["ctaId"] || el.dataset["waSource"] || "wa_cta";
      const isWhatsAnchor =
        el.tagName.toLowerCase() === "a" &&
        (el.getAttribute("href") || "").includes("wa.me");
      try {
        const surface = el.dataset["waSurface"];
        trackWhatsAppClick({
          source,
          ...(service !== undefined && { service }),
          ...(city !== undefined && { city }),
          ...(neighborhood !== undefined && { bairro: neighborhood }),
          source_component: el.tagName.toLowerCase(),
          cta_id,
          ...(surface !== undefined && { surface }),
          ...(isWhatsAnchor && { destination: "whatsapp" }),
        });
      } catch {
        /* analytics nunca quebra fluxo */
      }
    },
    { capture: true },
  );
}

const LOCAL_BUSINESS_JSONLD = `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://precisodeumtecnico.com/#localbusiness",
  "name": "Preciso de Um Técnico",
  "legalName": "Preciso de Um Técnico",
  "foundingDate": "1998",
  "email": "contato@precisodeumtecnico.com",
  "currenciesAccepted": "BRL",
  "knowsLanguage": ["pt-BR"],
  "parentOrganization": { "@id": "https://precisodeumtecnico.com/#organization" },
  "description": "Assistência técnica especializada em Curitiba e Região Metropolitana. Informática, elétrica, CFTV, notebooks, ar-condicionado, celulares.",
  "url": "https://precisodeumtecnico.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Curitiba",
    "addressRegion": "PR",
    "addressCountry": "BR"
  },
  "geo": { "@type": "GeoCoordinates", "latitude": -25.4284, "longitude": -49.2733 },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "08:00",
      "closes": "22:00"
    }
  ],
  "priceRange": "$$",
  "image": "https://precisodeumtecnico.com/og-image.jpg",
  "sameAs": [
    "https://www.facebook.com/precisodeumtecnico/",
    "https://www.instagram.com/PrecisoDeUmTecnico"
  ],
  "areaServed": [
    { "@type": "City", "name": "Curitiba" },
    { "@type": "City", "name": "São José dos Pinhais" },
    { "@type": "City", "name": "Pinhais" },
    { "@type": "City", "name": "Colombo" },
    { "@type": "City", "name": "Araucária" }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Serviços de Assistência Técnica",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Assistência Técnica em Informática", "description": "Manutenção, formatação, limpeza e upgrade de computadores" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Conserto de Notebooks", "description": "Troca de tela, teclado, bateria e upgrade" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Instalação de Câmeras CFTV", "description": "Instalação e manutenção de sistemas de segurança" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Serviços Elétricos", "description": "Instalações elétricas residenciais e comerciais" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Ar-Condicionado", "description": "Instalação, limpeza e manutenção" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Conserto de Celulares", "description": "Troca de tela, bateria e reparos em smartphones" } }
    ]
  }
}`;

const ORGANIZATION_JSONLD = `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://precisodeumtecnico.com/#organization",
  "name": "Preciso de Um Técnico",
  "legalName": "Preciso de Um Técnico",
  "foundingDate": "1998",
  "email": "contato@precisodeumtecnico.com",
  "url": "https://precisodeumtecnico.com",
  "logo": "https://precisodeumtecnico.com/logo.png",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Curitiba",
    "addressRegion": "PR",
    "addressCountry": "BR"
  },
  "areaServed": "Curitiba e Região Metropolitana + prestadores parceiros no Brasil",
  "knowsLanguage": ["pt-BR"],
  "sameAs": [
    "https://www.facebook.com/precisodeumtecnico/",
    "https://www.instagram.com/PrecisoDeUmTecnico"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "areaServed": "BR",
    "email": "contato@precisodeumtecnico.com",
    "availableLanguage": "Portuguese"
  }
}`;

const WEBSITE_JSONLD = `{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Preciso de Um Técnico",
  "url": "https://precisodeumtecnico.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://precisodeumtecnico.com/servicos?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Preciso de Um Técnico | Assistência Técnica Curitiba 24h" },
      // meta description/robots/twitter:card/og dinâmicos são fonte única em SEOHead.tsx (Helmet).
      { name: "author", content: "Preciso de Um Técnico" },
      { name: "googlebot", content: "index, follow" },
      { name: "geo.region", content: "BR-PR" },
      { name: "geo.placename", content: "Curitiba" },
      { name: "geo.position", content: "-25.4284;-49.2733" },
      { name: "ICBM", content: "-25.4284, -49.2733" },
      { name: "keywords", content: "assistência técnica curitiba, técnico em informática, conserto notebook, instalação câmeras, eletricista curitiba, ar condicionado curitiba, conserto celular, manutenção computadores, técnico 24 horas, visita técnica domiciliar" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:site_name", content: "Preciso de Um Técnico" },
      { name: "google-site-verification", content: "" },
      { name: "google-adsense-account", content: "ca-pub-3762170279587706" },
      { name: "theme-color", content: "#0F172A" },
      { name: "apple-mobile-web-app-title", content: "PT Técnico" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "msapplication-TileColor", content: "#0F172A" },
      { name: "msapplication-TileImage", content: "/icon-144.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
      },
      { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      { rel: "dns-prefetch", href: "https://www.google-analytics.com" },
      { rel: "alternate", type: "application/atom+xml", title: "Blog — Preciso de Um Técnico", href: "https://precisodeumtecnico.com/atom.xml" },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/icon-16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/icon-32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/icon-48.png" },
      { rel: "icon", type: "image/png", sizes: "192x192", href: "/icon-192.png" },
      { rel: "icon", type: "image/png", sizes: "512x512", href: "/icon-512.png" },
      { rel: "apple-touch-icon", sizes: "152x152", href: "/apple-touch-icon-152.png" },
      { rel: "apple-touch-icon", sizes: "167x167", href: "/apple-touch-icon-167.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
    ],
    scripts: [
      { type: "application/ld+json", children: LOCAL_BUSINESS_JSONLD },
      { type: "application/ld+json", children: ORGANIZATION_JSONLD },
      { type: "application/ld+json", children: WEBSITE_JSONLD },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RoutePageviewTracker() {
  useRoutePageview();
  return null;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <StrictMode>
      <GlobalErrorBoundary>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <ScrollToTop />
              <GlobalReveal />
              <GlobalTriageLauncher />
              <E2ETriageBridge />
              <SmartLocationPrompt />
              <RoutePageviewTracker />
              <Suspense fallback={null}>
                <Outlet />
              </Suspense>
            </TooltipProvider>
          </AuthProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </GlobalErrorBoundary>
    </StrictMode>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-bold">Esta página não carregou</h1>
        <p className="text-muted-foreground">
          Algo deu errado do nosso lado. Você pode tentar novamente ou voltar para a página inicial.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground font-semibold"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="px-4 py-2 rounded-md border border-border bg-card text-card-foreground font-semibold"
          >
            Voltar ao início
          </a>
        </div>
      </div>
    </div>
  );
}
