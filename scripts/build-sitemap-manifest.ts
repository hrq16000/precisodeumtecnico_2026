// Gera artefatos determinísticos de sitemap:
//   - dist/sitemaps.manifest.json      → sha256 + tamanho de cada shard
//   - dist/sitemap-diagnostics.json    → esperados (do sitemap-index) x
//                                        encontrados em dist/, com missing/extra
//
// Roda no postbuild. Nunca falha o build sozinho — apenas escreve o
// diagnóstico. O guard `check-sitemap-presence.ts` faz o hard-fail
// separado com base no manifesto.
//
// Run: bunx tsx scripts/build-sitemap-manifest.ts
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const DIST = "dist/client";
if (!existsSync(DIST)) {
  console.error(`✗ ${DIST}/ não existe — rode 'bun run build' primeiro.`);
  process.exit(1);
}

const files = readdirSync(DIST).filter((f) => /^sitemap.*\.xml$/.test(f)).sort();
if (!files.length) {
  console.error("✗ nenhum sitemap*.xml em dist/");
  process.exit(1);
}

const entries = files.map((name) => {
  const path = join(DIST, name);
  const buf = readFileSync(path);
  return {
    file: name,
    bytes: statSync(path).size,
    sha256: createHash("sha256").update(buf).digest("hex"),
  };
});

const manifest = {
  generatedAt: new Date().toISOString(),
  count: entries.length,
  files: entries,
};

const outPath = join(DIST, "sitemaps.manifest.json");
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`✓ sitemaps.manifest.json com ${entries.length} shards → ${outPath}`);
for (const e of entries) console.log(`  • ${e.file}  ${e.bytes}B  ${e.sha256.slice(0, 12)}…`);

// ---------------------------------------------------------------------------
// Diagnóstico: esperado (sitemap-index) x encontrado (dist/)
// ---------------------------------------------------------------------------
const INDEX = join(DIST, "sitemap.xml");
const expectedShards: string[] = [];
/** lastmod declarado no sitemap-index, por arquivo. */
const indexLastmod: Record<string, string | null> = {};
if (existsSync(INDEX)) {
  const idx = readFileSync(INDEX, "utf8");
  for (const block of idx.matchAll(/<sitemap>([\s\S]*?)<\/sitemap>/g)) {
    const loc = block[1].match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    const lm = block[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() ?? null;
    const fname = loc?.split("/").pop();
    if (fname) {
      expectedShards.push(fname);
      indexLastmod[fname] = lm;
    }
  }
  if (!expectedShards.length) {
    // index sem wrapper <sitemap> (formato legado) — cai no parse simples
    for (const m of idx.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const fname = m[1].trim().split("/").pop();
      if (fname) {
        expectedShards.push(fname);
        indexLastmod[fname] = null;
      }
    }
  }
}

const foundSet = new Set(files);
const expectedSet = new Set(expectedShards);
const missing = expectedShards.filter((f) => !foundSet.has(f));
const extra = files.filter((f) => f !== "sitemap.xml" && !expectedSet.has(f));

// Entradas por shard: tamanho, hash, nº de URLs e lastmod (index x conteúdo).
const byFile = new Map(entries.map((e) => [e.file, e]));
const shards = files.map((file) => {
  const xml = readFileSync(join(DIST, file), "utf8");
  const urlCount = [...xml.matchAll(/<url>/g)].length;
  const nestedCount = [...xml.matchAll(/<sitemap>/g)].length;
  const lastmods = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1].trim()).sort();
  const meta = byFile.get(file)!;
  return {
    file,
    bytes: meta.bytes,
    sha256: meta.sha256,
    isIndex: nestedCount > 0,
    urlCount,
    nestedSitemapCount: nestedCount,
    lastmodInIndex: indexLastmod[file] ?? null,
    lastmodMin: lastmods[0] ?? null,
    lastmodMax: lastmods[lastmods.length - 1] ?? null,
    inIndex: file === "sitemap.xml" ? true : expectedSet.has(file),
  };
});

const diagnostics = {
  generatedAt: manifest.generatedAt,
  indexPresent: existsSync(INDEX),
  expectedCount: expectedShards.length,
  foundCount: files.length,
  missingCount: missing.length,
  extraCount: extra.length,
  totalUrls: shards.filter((s) => !s.isIndex).reduce((n, s) => n + s.urlCount, 0),
  totalBytes: shards.reduce((n, s) => n + s.bytes, 0),
  shards,
  expected: expectedShards,
  found: files,
  missing,
  extra,
};

const diagPath = join(DIST, "sitemap-diagnostics.json");
writeFileSync(diagPath, JSON.stringify(diagnostics, null, 2) + "\n");
console.log(`✓ sitemap-diagnostics.json → ${diagPath}`);

if (missing.length || extra.length) {
  console.warn("");
  console.warn("⚠ Inconsistência detectada entre sitemap-index e dist/:");
  console.warn(`  esperados: ${expectedShards.length}  |  encontrados: ${files.length}`);
  if (missing.length) {
    console.warn(`  ✗ ausentes em dist/ (${missing.length}):`);
    for (const m of missing) console.warn(`      - ${m}`);
  }
  if (extra.length) {
    console.warn(`  ⚠ presentes em dist/ mas fora do index (${extra.length}):`);
    for (const x of extra) console.warn(`      - ${x}`);
  }
  console.warn("  → detalhes completos em dist/sitemap-diagnostics.json");
} else {
  console.log(`✓ diagnóstico OK: ${expectedShards.length} shards esperados, todos presentes.`);
}
