/**
 * Gate de PR: garante que a fonte única comercial (R$ 99,99 visita e bancada e
 * R$ 299,99 coleta) está intacta e que nenhum marcador legado voltou.
 *
 * Complementa scripts/check-no-bancada-legacy.ts:
 *  1. src/data/commercialTerms.ts e src/data/pricingPolicy.ts precisam existir
 *     e conter os valores oficiais;
 *  2. nenhum arquivo público pode citar taxa de diagnóstico/visita diferente
 *     dos valores oficiais (ex.: "taxa de R$ 120", "visita R$ 150");
 *  3. marcadores de telemetria legados continuam proibidos.
 *
 * Uso: bunx tsx scripts/check-price-markers.ts
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const problems: string[] = [];

// 1. Fonte única presente e com os valores oficiais.
for (const [file, needles] of [
  ["src/data/pricingPolicy.ts", ["99,99", "299,99"]],
  ["src/data/commercialTerms.ts", ["99,99"]],
] as const) {
  if (!existsSync(file)) {
    problems.push(`fonte única ausente: ${file}`);
    continue;
  }
  const src = readFileSync(file, "utf8");
  for (const n of needles) {
    if (!src.includes(n)) problems.push(`${file} não declara o valor oficial R$ ${n}`);
  }
}

// 2 e 3. Varredura de conteúdo público.
const BAD_FEE =
  /(taxa de (?:visita|deslocamento|diagnóstico)|visita técnica|taxa mínima)[^\n]{0,40}R\$\s?(?!99,99|299,99)\d{2,3}(?:,\d{2})?\b/i;
const LEGACY_MARKER = /(bancada-90|diagnostico-90|diagnóstico-90|taxa-90|visita-90)/i;
// 4. Diagnóstico nunca é gratuito nem tem valor diferente da taxa oficial.
const FREE_DIAGNOSIS = /diagn[oó]stico\s+(gratuito|grátis|gratuita|sem custo|free)/i;
const DIAGNOSIS_PRICE_CAPTURE = /"Diagn[oó]stico[^"]*",\s*price:\s*"([^"]+)"/i;
const DIAGNOSIS_PRICE_OK = /^(?:A partir de\s*)?R\$\s?99,99$|^Sob consulta$/i;
const IGNORE = new Set(["scripts/check-price-markers.ts", "scripts/check-no-bancada-legacy.ts"]);


function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (IGNORE.has(p)) continue;
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (/\.(tsx?|mdx?)$/.test(name)) inspect(p);
  }
}

function inspect(file: string) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, i) => {
      if (LEGACY_MARKER.test(line)) problems.push(`${file}:${i + 1} marcador legado — ${line.trim().slice(0, 140)}`);
      if (BAD_FEE.test(line) && !/faixa|a partir de|entre|orçament|peça|componente/i.test(line))
        problems.push(`${file}:${i + 1} taxa divergente da oficial — ${line.trim().slice(0, 140)}`);
      if (FREE_DIAGNOSIS.test(line) && !/nunca|não é|nao e|cobra|golpe|"Diagnóstico grátis"/i.test(line))
        problems.push(`${file}:${i + 1} promessa de diagnóstico gratuito — ${line.trim().slice(0, 140)}`);
      const dp = DIAGNOSIS_PRICE_CAPTURE.exec(line);
      if (dp && !DIAGNOSIS_PRICE_OK.test(dp[1].trim()))
        problems.push(`${file}:${i + 1} preço de diagnóstico ≠ R$ 99,99 — ${line.trim().slice(0, 140)}`);
    });
}


for (const root of ["src", "e2e"]) {
  try {
    walk(root);
  } catch {
    /* dir ausente */
  }
}

if (problems.length) {
  console.error(`[price-markers] FALHOU — ${problems.length} problema(s):`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log("[price-markers] OK — fonte única íntegra, sem marcadores legados.");
