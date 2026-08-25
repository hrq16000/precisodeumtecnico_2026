// Guard pós-build: garante que TODOS os shards listados no sitemap-index
// existem fisicamente em dist/ e batem com o manifesto determinístico.
// Falha o build antes do deploy quando algum sitemap está ausente ou
// corrompido — evita subir estados parciais para o S3.
//
// Run: bunx tsx scripts/check-sitemap-presence.ts
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const DIST = "dist/client";
const INDEX = join(DIST, "sitemap.xml");
const MANIFEST = join(DIST, "sitemaps.manifest.json");
const errors: string[] = [];

if (!existsSync(INDEX)) errors.push(`${INDEX} ausente`);
if (!existsSync(MANIFEST)) errors.push(`${MANIFEST} ausente — rode build-sitemap-manifest.ts`);

if (!errors.length) {
  const idx = readFileSync(INDEX, "utf8");
  const shardUrls = Array.from(idx.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
  if (!shardUrls.length) errors.push("sitemap.xml não referencia nenhum shard");

  const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as {
    files: { file: string; bytes: number; sha256: string }[];
  };
  const byName = new Map(manifest.files.map((f) => [f.file, f]));

  for (const url of shardUrls) {
    const fname = url.split("/").pop()!;
    const path = join(DIST, fname);
    if (!existsSync(path)) { errors.push(`shard ausente em dist/: ${fname}`); continue; }
    const entry = byName.get(fname);
    if (!entry) { errors.push(`shard sem entrada no manifesto: ${fname}`); continue; }
    const actualHash = createHash("sha256").update(readFileSync(path)).digest("hex");
    if (actualHash !== entry.sha256) errors.push(`hash divergente do manifesto: ${fname}`);
  }

  console.log(`✓ sitemap-index com ${shardUrls.length} shards, todos presentes e íntegros em dist/`);
}

if (errors.length) {
  console.error("✗ Guard de presença de sitemap falhou:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
