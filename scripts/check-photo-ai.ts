/**
 * Gate anti-IA / anti-placeholder das imagens públicas.
 *
 * Falha o CI quando:
 *   1. o nome de um arquivo de imagem sugere geração por IA
 *      (midjourney, dall-e, stable diffusion, "ai-generated", "gerado-por-ia"…);
 *   2. o nome sugere placeholder/stub ("placeholder", "lorem", "dummy",
 *      "sample-image", "temp-image") fora do arquivo institucional
 *      `public/placeholder.svg`;
 *   3. o binário JPEG/PNG carrega assinatura textual de gerador de IA
 *      (metadado `Software`/`parameters` das ferramentas de difusão).
 *
 * Correção: substituir por foto real (bancada, equipe, equipamento) e
 * rodar `bun run photos:optimize`.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["public", "src/assets"];
const IMAGE = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

/** Arquivos institucionais aceitos apesar do nome. */
const ALLOWLIST = new Set<string>(["public/placeholder.svg"]);

const AI_NAME_PATTERNS: RegExp[] = [
  /midjourney/i,
  /dall[\s._-]?e/i,
  /stable[\s._-]?diffusion/i,
  /\bsdxl\b/i,
  /firefly[\s._-]?ai/i,
  /(^|[\s._-])ai[\s._-]?(gen|generated|image|art)/i,
  /gerad[oa][\s._-]?por[\s._-]?ia/i,
  /(^|[\s._-])ia[\s._-]?gerad/i,
  /leonardo[\s._-]?ai/i,
  /nano[\s._-]?banana/i,
  /flux[\s._-]?(dev|schnell)/i,
];

const PLACEHOLDER_NAME_PATTERNS: RegExp[] = [
  /placeholder/i,
  /lorem[\s._-]?(ipsum|picsum)/i,
  /(^|[\s._-])dummy([\s._-]|\.)/i,
  /sample[\s._-]?image/i,
  /temp[\s._-]?image/i,
  /(^|[\s._-])mock([\s._-]|\.)/i,
];

/** Assinaturas textuais deixadas por geradores dentro do binário. */
const AI_BINARY_SIGNATURES = [
  "Stable Diffusion",
  "stable-diffusion",
  "Midjourney",
  "DALL-E",
  "dall-e",
  "Adobe Firefly",
  "Generated with AI",
  "AI-generated",
  "parameters\u0000Negative prompt",
];

function walk(dir: string, out: string[] = []): string[] {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (IMAGE.test(entry)) out.push(full);
  }
  return out;
}

const offenders: string[] = [];
let scanned = 0;

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const rel = file.replace(/\\/g, "/");
    if (ALLOWLIST.has(rel)) continue;
    scanned++;
    const base = rel.split("/").pop() ?? rel;

    if (AI_NAME_PATTERNS.some((p) => p.test(base))) {
      offenders.push(`${rel}: nome sugere imagem gerada por IA`);
      continue;
    }
    if (PLACEHOLDER_NAME_PATTERNS.some((p) => p.test(base))) {
      offenders.push(`${rel}: placeholder/stub não permitido em produção`);
      continue;
    }

    // Assinaturas textuais só existem em bitmaps com metadados embutidos.
    if (/\.(jpe?g|png|webp)$/i.test(rel)) {
      let head = "";
      try {
        head = readFileSync(file).subarray(0, 96 * 1024).toString("latin1");
      } catch {
        continue;
      }
      const hit = AI_BINARY_SIGNATURES.find((sig) => head.includes(sig));
      if (hit) offenders.push(`${rel}: metadado com assinatura de IA ("${hit}")`);
    }
  }
}

if (offenders.length > 0) {
  console.error("❌ check:photo-ai — imagens de IA ou placeholders detectados:");
  offenders.forEach((o) => console.error(`   - ${o}`));
  process.exit(1);
}

console.log(`✅ check:photo-ai — ${scanned} imagens verificadas, nenhuma assinatura de IA/placeholder.`);
