/**
 * Guarda contra duplicação de metatags SEO entre fontes.
 * Pós-migração TanStack Start: a fonte "estática" agora é o head() de
 * src/routes/__root.tsx (substitui o antigo index.html). Checa __root.tsx ×
 * SEOHead.tsx (dinâmico) para meta tags que devem ter exatamente 1 instância
 * por rota (crawlers ficam ambíguos).
 * Sai com código 1 (falha o build) quando encontra duplicidade previsível.
 *
 * Rodado via `postbuild` script — não corrige, apenas denuncia.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

type Rule = { property: string; label: string };
const CRITICAL: Rule[] = [
  { property: 'property: "og:image"|property="og:image"', label: "og:image" },
  { property: 'property="og:title"|property: "og:title"', label: "og:title" },
  { property: 'property="og:description"|property: "og:description"', label: "og:description" },
  { property: 'property="og:url"|property: "og:url"', label: "og:url" },
  { property: 'name="twitter:image"|name: "twitter:image"', label: "twitter:image" },
  { property: 'name="twitter:title"|name: "twitter:title"', label: "twitter:title" },
  { property: 'name="twitter:description"|name: "twitter:description"', label: "twitter:description" },
  { property: 'name="twitter:card"|name: "twitter:card"', label: "twitter:card" },
  { property: 'rel="canonical"|rel: "canonical"', label: "canonical" },
];

const indexHtml = readFileSync(resolve("src/routes/__root.tsx"), "utf-8");
const seoHead = readFileSync(resolve("src/components/seo/SEOHead.tsx"), "utf-8");

const errors: string[] = [];
const warnings: string[] = [];

for (const rule of CRITICAL) {
  const inStatic = (indexHtml.match(new RegExp(rule.property, "g")) || []).length;
  const inHelmet = (seoHead.match(new RegExp(rule.property, "g")) || []).length;

  // ambas as fontes tentando setar a MESMA tag → duplicação em runtime
  if (inStatic > 0 && inHelmet > 0) {
    errors.push(
      `Duplicidade: ${rule.label} definida em __root.tsx (${inStatic}x) E em SEOHead.tsx (${inHelmet}x). ` +
      `react-helmet-async não deduplica contra tags estáticas → 2 tags no DOM.`,
    );
  }
  if (inStatic > 1) {
    warnings.push(`index.html tem ${inStatic}x ${rule.label} — deveria ser 1.`);
  }
}

// Regra dedicada Rodada 24.3: meta robots é fonte única no SEOHead (Helmet).
// __root.tsx head() NÃO pode conter <meta name="robots"> — evita colisão index/noindex.
const staticRobots = (indexHtml.match(/(?:<meta[^>]+name=["']robots["']|name: "robots")/gi) || []).length;
const helmetRobots = (seoHead.match(/name="robots"/g) || []).length;
if (staticRobots > 0) {
  errors.push(
    `meta robots estática em __root.tsx (${staticRobots}x) — remover. ` +
    `Fonte única é SEOHead.tsx (Helmet), que emite index,follow ou noindex,nofollow por rota.`,
  );
}
if (helmetRobots < 1) {
  errors.push(
    `SEOHead.tsx não emite <meta name="robots"> — deveria ser a fonte única (Rodada 24.3).`,
  );
}

// Regra dedicada Rodada 24.4: twitter:card é fonte única no SEOHead (Helmet).
// __root.tsx head() NÃO pode conter <meta name="twitter:card"> — evita duplicidade
// contra o Helmet (react-helmet-async não deduplica contra tags estáticas).
const staticTwCard = (indexHtml.match(/(?:<meta[^>]+name=["']twitter:card["']|name: "twitter:card")/gi) || []).length;
const helmetTwCard = (seoHead.match(/name="twitter:card"/g) || []).length;
if (staticTwCard > 0) {
  errors.push(
    `meta twitter:card estática em __root.tsx (${staticTwCard}x) — remover. ` +
    `Fonte única é SEOHead.tsx (Helmet) por rota (Rodada 24.4).`,
  );
}
if (helmetTwCard < 1) {
  errors.push(
    `SEOHead.tsx não emite <meta name="twitter:card"> — deveria ser a fonte única (Rodada 24.4).`,
  );
}

// Regra dedicada Rodada 25.1: meta description é fonte única no SEOHead (Helmet).
// __root.tsx head() NÃO pode conter <meta name="description"> — evita a mesma
// description genérica em todas as 100 URLs da matriz nacional.
const staticDescription = (indexHtml.match(/(?:<meta[^>]+name=["']description["']|name: "description")/gi) || []).length;
const helmetDescription = (seoHead.match(/name="description"/g) || []).length;
if (staticDescription > 0) {
  errors.push(
    `meta description estática em __root.tsx (${staticDescription}x) — remover. ` +
    `Fonte única é SEOHead.tsx (Helmet) por rota (Rodada 25.1).`,
  );
}
if (helmetDescription < 1) {
  errors.push(
    `SEOHead.tsx não emite <meta name="description"> — deveria ser a fonte única (Rodada 25.1).`,
  );
}
if (warnings.length) {
  console.warn("[seo-dedup] avisos:");
  for (const w of warnings) console.warn("  ⚠ " + w);
}
if (errors.length) {
  console.error("[seo-dedup] FALHOU:");
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`[seo-dedup] OK — ${CRITICAL.length} regras verificadas, sem duplicidade.`);
