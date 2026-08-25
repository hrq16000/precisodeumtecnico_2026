import { useEffect, useRef } from "react";
import { useLocation, matchPath } from "@/lib/router-compat";
import { pushLocalAnalyticsEvent, type RouteType } from "@/lib/localAnalytics";

/**
 * useRoutePageview — Rodada 25.1 Bloco B.
 *
 * Emite exatamente um `virtual_page_view` por pathname (refresh inicial +
 * cada navegação SPA). Não emite em rotas internas. Query/hash não geram
 * novo evento. Título capturado após microtask para pegar Helmet atualizado.
 *
 * StrictMode-safe: dedupe do próprio dataLayer + guarda `lastPathRef`.
 */

const INTERNAL_ROUTES = new Set(["/admin", "/auth", "/diagnostics", "/diagnostico", "/triagem-preview"]);

interface Resolved {
  route_type: RouteType;
  service?: string;
  city?: string;
  neighborhood?: string;
}

/**
 * Resolver leve — reconhece formato do pathname sem importar datasets
 * pesados. Para matrizes válidas vs. fallback, a página em si é a fonte
 * de verdade; aqui marcamos `matrix_nacional` pelo formato e a validação
 * real fica na página (que pode disparar noindex/canonical).
 */
export function resolveRouteContext(pathname: string): Resolved {
  if (pathname === "/") return { route_type: "home" };
  if (pathname === "/404" || pathname === "*") return { route_type: "not_found" };

  const institutional = new Set([
    "/sobre",
    "/contato",
    "/faq",
    "/dados-da-empresa",
    "/termos-orcamento",
    "/termos-orcamento-pre-aprovado",
    "/precos",
    "/blog",
    "/servicos",
    "/regioes",
    "/assistencia-tecnica",
    "/assistencia-tecnica-curitiba",
    "/atendimento-nacional",
  ]);
  if (institutional.has(pathname)) return { route_type: "institutional" };

  // Blog posts / categorias.
  if (pathname.startsWith("/blog/")) return { route_type: "institutional" };

  const match = <T extends string>(pattern: string) =>
    matchPath<T, string>({ path: pattern, end: true }, pathname);

  const mServico = match<"slug">("/servicos/:slug");
  if (mServico) return { route_type: "service", service: mServico.params.slug };

  const mServCity = match<"city" | "service">("/servico-em/:city/:service");
  if (mServCity) {
    return { route_type: "service_city", city: mServCity.params.city, service: mServCity.params.service };
  }

  const mMatrix = match<"city" | "bairro" | "service">("/servico-em-nacional/:city/:bairro/:service");
  if (mMatrix) {
    return {
      route_type: "matrix_nacional",
      city: mMatrix.params.city,
      neighborhood: mMatrix.params.bairro,
      service: mMatrix.params.service,
    };
  }

  const mNatNb = match<"city" | "bairro">("/atendimento-nacional/:city/:bairro");
  if (mNatNb) {
    return { route_type: "national_neighborhood", city: mNatNb.params.city, neighborhood: mNatNb.params.bairro };
  }
  const mNatCity = match<"slug">("/atendimento-nacional/:slug");
  if (mNatCity) return { route_type: "national_city", city: mNatCity.params.slug };

  const mRegNb = match<"city" | "neighborhood">("/regioes/:city/:neighborhood");
  if (mRegNb) {
    return { route_type: "region", city: mRegNb.params.city, neighborhood: mRegNb.params.neighborhood };
  }
  const mReg = match<"city">("/regioes/:city");
  if (mReg) return { route_type: "region", city: mReg.params.city };

  return { route_type: "not_found" };
}

export function useRoutePageview(): void {
  const location = useLocation();
  const lastPathRef = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (INTERNAL_ROUTES.has(path)) {
      lastPathRef.current = path;
      return;
    }
    if (lastPathRef.current === path) return;
    lastPathRef.current = path;

    const ctx = resolveRouteContext(path);
    // Aguarda um frame para capturar título atualizado por Helmet.
    // StrictMode: NÃO cancelamos o rAF no cleanup — o remount sintético
    // cancelaria o único disparo (guarda `lastPathRef` impede o segundo).
    // O dedupe semântico da fila local absorve qualquer duplicidade.
    window.requestAnimationFrame(() => {
      pushLocalAnalyticsEvent({
        event: "virtual_page_view",
        page_path: path,
        page_title: typeof document !== "undefined" ? document.title : undefined,
        route_type: ctx.route_type,
        service: ctx.service,
        city: ctx.city,
        neighborhood: ctx.neighborhood,
      });
    });

  }, [location.pathname]);
}
