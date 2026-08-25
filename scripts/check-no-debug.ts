/**
 * Post-build guard: garante que o bundle de produção não vaza textos de
 * debug/testes ("payload de teste", "Ver payload"). Falha o build em CI
 * caso encontre — impede regressão como a de rodada anterior.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const DIST = resolve("dist/client");
const FORBIDDEN = [/payload de teste/i, /Ver payload/i];
const EXT = /\.(html|js|css|json|txt)$/i;

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXT.test(name)) out.push(p);
  }
  return out;
}

let failed = 0;
try {
  statSync(DIST);
} catch {
  console.warn("[no-debug] dist/ ausente — pulei (build não rodou).");
  process.exit(0);
}

for (const file of walk(DIST)) {
  const content = readFileSync(file, "utf-8");
  for (const rx of FORBIDDEN) {
    if (rx.test(content)) {
      console.error(`[no-debug] FALHOU: ${file} contém ${rx}`);
      failed++;
    }
  }
}

if (failed) {
  console.error(`[no-debug] ${failed} ocorrência(s) de debug no bundle.`);
  process.exit(1);
}
console.log("[no-debug] OK — nenhum rastro de debug no bundle.");
