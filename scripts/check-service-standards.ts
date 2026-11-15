/**
 * Gate de CI — padronização das páginas de serviço (Rodada 34).
 *
 * Garante que TODA rota curada de /servicos/:slug tenha ficha completa e que
 * os valores/prazos exibidos venham da fonte única (pricingPolicy.ts):
 *   - existe entrada em SERVICE_STANDARDS para cada slug curado da página;
 *   - valor inicial == PRICING.technicalVisit (nada de preço divergente);
 *   - prazo de execução == SLA.minLabel;
 *   - listas obrigatórias (incluso / não incluso / acréscimos / observações /
 *     limitações) não vazias e sem itens duplicados;
 *   - bloco de agendamento com source de triagem;
 *   - a página renderiza <ServiceStandardBand />.
 *
 * Executar: bunx tsx scripts/check-service-standards.ts
 */
import { readFileSync } from "node:fs";
import { SERVICE_STANDARDS } from "../src/data/serviceStandards";
import { PRICING, SLA } from "../src/data/pricingPolicy";

const PAGE = "src/pages/ServicoDetalhe.tsx";
const src = readFileSync(PAGE, "utf8");
const errors: string[] = [];

// slugs curados declarados no mapa local da página
const curated = [...src.matchAll(/^ {2}"([a-z0-9-]+)": \{$/gm)].map((m) => m[1]);
if (curated.length === 0) errors.push(`${PAGE}: nenhum slug curado reconhecido`);

if (!src.includes("<ServiceStandardBand")) {
  errors.push(`${PAGE}: não renderiza <ServiceStandardBand /> (ficha padrão ausente)`);
}

for (const slug of curated) {
  const std = SERVICE_STANDARDS[slug];
  if (!std) {
    errors.push(`"${slug}": sem ficha em src/data/serviceStandards.ts`);
    continue;
  }
  if (std.startingPriceBRL !== PRICING.technicalVisit.priceBRL) {
    errors.push(
      `"${slug}": valor inicial ${std.startingPriceBRL} ≠ política ${PRICING.technicalVisit.priceBRL}`,
    );
  }
  if (std.startingPriceLabel !== PRICING.technicalVisit.priceLabel) {
    errors.push(`"${slug}": rótulo de preço "${std.startingPriceLabel}" fora da política`);
  }
  if (std.executionSlaLabel !== SLA.minLabel) {
    errors.push(`"${slug}": prazo "${std.executionSlaLabel}" ≠ SLA oficial "${SLA.minLabel}"`);
  }
  const visitDuration = `até ${PRICING.technicalVisit.durationMinutes} minutos de inspeção`;
  if (std.diagnosisDurationLabel !== visitDuration) {
    errors.push(`"${slug}": duração da inspeção diverge da política (${visitDuration})`);
  }
  const lists: [string, string[]][] = [
    ["included", std.included],
    ["notIncluded", std.notIncluded],
    ["surcharges", std.surcharges],
    ["notes", std.notes],
    ["limitations", std.limitations],
  ];
  for (const [name, items] of lists) {
    if (!items || items.length === 0) errors.push(`"${slug}": campo obrigatório "${name}" vazio`);
    if (items && new Set(items).size !== items.length) {
      errors.push(`"${slug}": campo "${name}" com item duplicado`);
    }
  }
  if (!std.scheduling?.source?.startsWith("service-standard:")) {
    errors.push(`"${slug}": bloco de agendamento sem source de triagem padronizado`);
  }
  if (!std.scheduling?.label || !std.scheduling?.description) {
    errors.push(`"${slug}": bloco de agendamento sem rótulo/descrição`);
  }
}

// Nenhuma ficha pode conter preço em texto livre divergente da política.
for (const [slug, std] of Object.entries(SERVICE_STANDARDS)) {
  const text = [...std.included, ...std.notIncluded, ...std.surcharges, ...std.notes, ...std.limitations].join(" | ");
  const money = [...text.matchAll(/R\$\s?[\d.]+,\d{2}/g)].map((m) => m[0].replace(/\s/g, " "));
  const allowed = new Set([PRICING.technicalVisit.priceLabel, "R$ 299,99"]);
  for (const value of money) {
    if (![...allowed].some((a) => value.includes(a.replace("R$ ", "")))) {
      errors.push(`"${slug}": valor "${value}" fora da planilha oficial de preços`);
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} divergência(s) na padronização de serviços:`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(
  `✓ padronização OK: ${curated.length} serviço(s) curado(s) com ficha completa e preços alinhados à política.`,
);
