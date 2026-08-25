/**
 * Registro único das origens de clique (data-wa-source) dos CTAs de WhatsApp.
 *
 * Regras:
 * - Sempre kebab-case (nada de snake_case ou camelCase), para que os relatórios
 *   de conversão agrupem cliques de forma consistente.
 * - Toda nova origem precisa ser registrada aqui; o gate `check:cta-attrs`
 *   falha o build quando encontra um `data-wa-source` fora desta lista.
 */
export const WA_SOURCES = [
  // Globais / layout
  "header",
  "footer",
  "float",
  "hero",
  "cta-section",
  "faq-section",
  "social-proof",
  "not-found",
  "triage",
  "terms",
  "contact",
  "contact-form",
  "about",
  "blog-post",
  // Preços e orçamentos
  "pricing",
  "pricing-quick-estimate",
  "pc-quote-wizard",
  "pc-como-funciona-hero",
  // Políticas
  "parts-policy",
  "parts-policy-footer",
  "privacy-policy",
  "garantia-hero",
  "processo-hero",
  "precos-politicas-hero",
  "garantia-final",
  // Guias editoriais
  "guia-informatica",
  "guia-informatica-cta",
  "guia-escolha",
  "guia-escolha-cta",
  "solucao-guia",
  "solucoes-hub",
  // Serviços e localidades
  "service-detail",
  "service-city",
  "neighborhood-detail",
  "national-service",
  "national-city",
  "matrix-nacional-hero",
  "bairro-nacional-hero",
  "bairro-nacional-fallback",
  "landing-curitiba",
  "landing-brasil",
  "curitiba-lp-service-card",
  "brasil-lp-service-card",
  // Páginas de descoberta e utilitários
  "busca",
  "regioes",
  "servicos",
  "mensagens-prontas",
  "atendimento-urgente",
  "quiz-result",
  "reviews-band",
  "triage-wa-fallback",
  "admin-lead",
  // Ordem de serviço
  "status-os-share",
  "status-os-fallback",
  "abrir-os-confirm",
] as const;

export type WaSource = (typeof WA_SOURCES)[number];

export function isWaSource(value: string): value is WaSource {
  return (WA_SOURCES as readonly string[]).includes(value);
}
