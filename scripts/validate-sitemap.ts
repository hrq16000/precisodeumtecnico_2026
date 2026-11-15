// Validador de sitemaps pós-build. Roda no CI.
// Confere:
//  - existência de public/sitemap.xml + public/robots.txt;
//  - sitemap.xml é sitemapindex apontando para shards existentes;
//  - cada shard tem <urlset> válido, URLs https, sem duplicação intra e inter-shard;
//  - nos shards de páginas, cada <url> traz <xhtml:link rel="canonical"> igual à <loc>;
//  - robots.txt aponta Sitemap: absoluto https e não bloqueia áreas indexáveis;
//  - shards city/bairros usam nomenclatura esperada.
//
// Sem verificação HTTP 200 aqui — o CI já roda Playwright/Lighthouse contra o
// preview, então essa checagem live vive no script check-page-images/e2e.
//
// Run: bun scripts/validate-sitemap.ts

import { readFileSync, existsSync } from "node:fs";

const errors: string[] = [];
const push = (m: string) => errors.push(m);

if (!existsSync("public/sitemap.xml")) push("Missing public/sitemap.xml");
if (!existsSync("public/robots.txt")) push("Missing public/robots.txt");

if (errors.length === 0) {
  const rootXml = readFileSync("public/sitemap.xml", "utf8");
  if (!/<sitemapindex/.test(rootXml)) push("sitemap.xml: raiz deve ser <sitemapindex>");

  const shardLocs = Array.from(rootXml.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g)).map((m) => m[1].trim());
  if (shardLocs.length === 0) push("sitemap.xml: nenhum shard listado");

  const allLocs = new Map<string, string>(); // loc -> shard file
  let totalUrls = 0;
  const shardStats: { file: string; count: number }[] = [];

  for (const shardUrl of shardLocs) {
    if (!/^https:\/\//i.test(shardUrl)) push(`sitemap.xml: shard não-https ${shardUrl}`);
    const fname = shardUrl.split("/").pop()!;
    const path = `public/${fname}`;
    if (!existsSync(path)) {
      push(`shard ausente no disco: ${fname}`);
      continue;
    }
    const isImageShard = fname === "sitemap-images.xml";
    if (!/^sitemap-(images|main|servicos|cidades|regions|bairros|nacional-servicos-piloto|city-[a-z0-9-]+|bairros-[a-z0-9-]+)\.xml$/.test(fname)) {
      push(`nomenclatura inesperada de shard: ${fname}`);
    }

    const xml = readFileSync(path, "utf8");
    if (!/<urlset/.test(xml)) {
      push(`${fname}: falta <urlset>`);
      continue;
    }

    const urlBlocks = Array.from(xml.matchAll(/<url>([\s\S]*?)<\/url>/g)).map((m) => m[1]);
    let shardCount = 0;
    const localSeen = new Set<string>();
    for (const block of urlBlocks) {
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
      const can = block.match(/<xhtml:link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1]?.trim();
      if (!loc) { push(`${fname}: <url> sem <loc>`); continue; }
      if (!/^https:\/\//i.test(loc)) push(`${fname}: URL não-https ${loc}`);
      if (isImageShard && !/<image:loc>https:\/\//i.test(block)) push(`${fname}: <loc> ${loc} sem imagem HTTPS`);
      if (!isImageShard && !can) push(`${fname}: <loc> ${loc} sem canonical`);
      else if (can && can !== loc) push(`${fname}: canonical (${can}) difere de loc (${loc})`);
      if (localSeen.has(loc)) push(`${fname}: duplicada intra-shard ${loc}`);
      localSeen.add(loc);
      if (!isImageShard && allLocs.has(loc)) push(`URL duplicada entre shards: ${loc} (em ${allLocs.get(loc)} e ${fname})`);
      if (!isImageShard) allLocs.set(loc, fname);
      shardCount++;
    }
    shardStats.push({ file: fname, count: shardCount });
    if (!isImageShard) totalUrls += shardCount;
  }

  const robots = readFileSync("public/robots.txt", "utf8");
  const sm = robots.match(/Sitemap:\s*(\S+)/i);
  if (!sm) push("robots.txt: linha Sitemap ausente");
  else if (!/^https:\/\//i.test(sm[1])) push("robots.txt: Sitemap não-https absoluto");

  const blocked = ["/servicos", "/regioes", "/blog", "/precos"];
  const lines = robots.split("\n");
  let inGlobal = false;
  for (const raw of lines) {
    const l = raw.trim();
    if (/^User-agent:\s*\*/i.test(l)) inGlobal = true;
    else if (/^User-agent:/i.test(l)) inGlobal = false;
    if (inGlobal) {
      const dis = l.match(/^Disallow:\s*(\S+)/i);
      if (dis && blocked.some((b) => dis[1] === b || dis[1].startsWith(b + "/")))
        push(`robots.txt: caminho indexável "${dis[1]}" bloqueado em User-agent: *`);
    }
  }

  console.log(`✓ sitemap-index com ${shardLocs.length} shards, ${totalUrls} URLs únicas`);
  for (const s of shardStats) console.log(`  • ${s.file}: ${s.count} URLs`);
}

if (errors.length) {
  console.error("✗ Validação de sitemaps falhou:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✓ robots.txt OK");
