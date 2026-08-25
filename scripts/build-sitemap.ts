// Build-time sitemap generator. Run with: bun scripts/build-sitemap.ts
//
// Emite um sitemap-index consolidado em public/sitemap.xml com poucos shards:
//   - public/sitemap-main.xml                       (estáticas + serviços + blog + nacional)
//   - public/sitemap-servicos.xml                   (páginas de serviço)
//   - public/sitemap-cidades.xml                    (rotas de cidade + service×city)
//   - public/sitemap-bairros.xml                    (todos os bairros, locais e nacionais)
//   - public/sitemap-nacional-servicos-piloto.xml   (matriz piloto)
//
// Cada URL tem canonical == loc. Consolidação reduz número de arquivos
// publicados (de ~24 para 4) — menos falhas de upload no deploy.

import { writeFileSync, statSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { servicesData } from "../src/data/services";
import { CURATED_SERVICE_SLUGS } from "../src/data/curatedServiceSlugs";
import { CURITIBA_SERVICE_SLUGS } from "../src/data/curitibaServiceLocal";
import {
  citiesData,
  curitibaBairros,
  sjpBairros,
  pinhaiBairros,
  colomboBairros,
  araucariaBairros,
} from "../src/data/regions";
import { allBlogPosts as blogPosts, blogCategories } from "../src/data/blog";
import { nationalCities } from "../src/data/nationalCities";
import { nationalBairrosByCity } from "../src/data/nationalBairros";
import { KEYWORD_SERVICE_PAGES } from "../src/data/keywordServices";
import { SOLUTION_GUIDES } from "../src/data/solutionGuides";

import { enumeratePilotCombinations, NATIONAL_MATRIX_MAX } from "../src/data/nationalServiceCoverage";


const BASE = "https://precisodeumtecnico.com";
const today = new Date().toISOString().split("T")[0];

// Clamp any candidate lastmod (YYYY-MM-DD) so we never emit a date in the
// future — sitemaps with future <lastmod> are treated as invalid by crawlers
// and the guard `check-sitemap-dates.ts` fails the build.
const clampLastmod = (d: string): string => (d > today ? today : d);

// lastmod só é emitido quando existe uma data específica da página (mtime do
// arquivo-fonte que gera aquela rota). Sem fonte confiável, o campo é OMITIDO —
// nunca preenchido com a data do build.
const fileDate = (path: string): string | undefined => {
  try {
    if (!existsSync(path)) return undefined;
    return clampLastmod(statSync(path).mtime.toISOString().split("T")[0]);
  } catch {
    return undefined;
  }
};

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const servicesMtime = fileDate("src/data/services.ts");
const regionsMtime = fileDate("src/data/regions.ts");
const blogMtime = fileDate("src/data/blog.ts");
const satMtime = fileDate("src/data/satellitePosts.ts");
const indexMtime = fileDate("src/pages/Index.tsx");
const precosMtime = fileDate("src/pages/Precos.tsx");
const natMtime = fileDate("src/data/nationalCities.ts");

interface Url {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

const cityBairros: Record<string, string[]> = {
  curitiba: curitibaBairros,
  "sao-jose-dos-pinhais": sjpBairros,
  pinhais: pinhaiBairros,
  colombo: colomboBairros,
  araucaria: araucariaBairros,
};

// ---- Shards ----
const solutionsMtime = fileDate("src/data/solutionGuides.ts");

const mainUrls: Url[] = [
  { loc: `${BASE}/solucoes`, changefreq: "weekly", priority: 0.8, lastmod: solutionsMtime },
  ...SOLUTION_GUIDES.map((g) => ({
    loc: `${BASE}/solucoes/${g.slug}`,
    changefreq: "monthly",
    priority: 0.7,
    lastmod: solutionsMtime,
  })),
  { loc: `${BASE}/`, changefreq: "daily", priority: 1.0, lastmod: indexMtime },
  { loc: `${BASE}/servicos`, changefreq: "weekly", priority: 0.9, lastmod: servicesMtime },
  { loc: `${BASE}/regioes`, changefreq: "weekly", priority: 0.9, lastmod: regionsMtime },
  { loc: `${BASE}/sobre`, changefreq: "monthly", priority: 0.6, lastmod: fileDate("src/pages/Sobre.tsx") },
  { loc: `${BASE}/contato`, changefreq: "monthly", priority: 0.7, lastmod: fileDate("src/pages/Contato.tsx") },
  { loc: `${BASE}/termos-orcamento-pre-aprovado`, changefreq: "yearly", priority: 0.5, lastmod: fileDate("src/pages/TermosOrcamento.tsx") },
  { loc: `${BASE}/politica-de-pecas-do-cliente`, changefreq: "monthly", priority: 0.6, lastmod: fileDate("src/pages/PoliticaPecasCliente.tsx") },
  { loc: `${BASE}/processo-de-atendimento`, changefreq: "monthly", priority: 0.7, lastmod: fileDate("src/pages/ProcessoAtendimento.tsx") },
  { loc: `${BASE}/precos-e-politicas`, changefreq: "monthly", priority: 0.7, lastmod: fileDate("src/pages/PrecosEPoliticas.tsx") },
  { loc: `${BASE}/garantia-e-cobertura`, changefreq: "monthly", priority: 0.6, lastmod: fileDate("src/pages/GarantiaCobertura.tsx") },
  { loc: `${BASE}/obrigado`, changefreq: "monthly", priority: 0.4, lastmod: fileDate("src/pages/Obrigado.tsx") },
  { loc: `${BASE}/creditos-de-imagens`, changefreq: "monthly", priority: 0.3, lastmod: fileDate("src/pages/CreditosDeImagens.tsx") },
  { loc: `${BASE}/politica-privacidade`, changefreq: "yearly", priority: 0.4, lastmod: fileDate("src/pages/PoliticaPrivacidade.tsx") },
  { loc: `${BASE}/termos-uso`, changefreq: "yearly", priority: 0.4, lastmod: fileDate("src/pages/TermosDeUso.tsx") },
  { loc: `${BASE}/politica-de-anuncios`, changefreq: "yearly", priority: 0.4, lastmod: fileDate("src/pages/PoliticaDeAnuncios.tsx") },
  { loc: `${BASE}/politica-de-cookies`, changefreq: "yearly", priority: 0.4, lastmod: fileDate("src/pages/PoliticaDeCookies.tsx") },
  { loc: `${BASE}/anuncie`, changefreq: "monthly", priority: 0.5, lastmod: fileDate("src/pages/Anuncie.tsx") },
  { loc: `${BASE}/areas-atendidas`, changefreq: "weekly", priority: 0.8, lastmod: fileDate("src/pages/AreasAtendidas.tsx") },
  { loc: `${BASE}/como-avaliar`, changefreq: "monthly", priority: 0.5, lastmod: fileDate("src/pages/ComoAvaliar.tsx") },
  { loc: `${BASE}/avaliacoes`, changefreq: "weekly", priority: 0.75, lastmod: fileDate("src/pages/Avaliacoes.tsx") },
  { loc: `${BASE}/status-os`, changefreq: "weekly", priority: 0.6, lastmod: fileDate("src/pages/StatusOrdemServico.tsx") },
  { loc: `${BASE}/exclusao-de-dados`, changefreq: "yearly", priority: 0.4, lastmod: fileDate("src/pages/ExclusaoDeDados.tsx") },

  { loc: `${BASE}/guias/organizacao-de-ti-para-pequenos-escritorios`, changefreq: "monthly", priority: 0.7, lastmod: fileDate("src/data/enterpriseGuides.ts") },
  { loc: `${BASE}/empresa-de-ti-curitiba`, changefreq: "weekly", priority: 0.9, lastmod: fileDate("src/data/enterpriseLandings.ts") },
  { loc: `${BASE}/servicos/suporte-tecnico-empresarial`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/data/enterpriseLandings.ts") },
  { loc: `${BASE}/seguranca-dos-dados`, changefreq: "monthly", priority: 0.75, lastmod: fileDate("src/data/enterpriseLandings.ts") },
  { loc: `${BASE}/servicos/manutencao-preventiva-empresas`, changefreq: "monthly", priority: 0.8, lastmod: fileDate("src/data/enterpriseLandings.ts") },
  { loc: `${BASE}/servicos/backup-para-empresas`, changefreq: "monthly", priority: 0.8, lastmod: fileDate("src/data/enterpriseLandings.ts") },
  { loc: `${BASE}/servicos/redes-e-wifi`, changefreq: "monthly", priority: 0.8, lastmod: fileDate("src/data/enterpriseLandings.ts") },
  { loc: `${BASE}/guias/como-escolher-uma-workstation`, changefreq: "monthly", priority: 0.7, lastmod: fileDate("src/data/enterpriseGuides.ts") },

  { loc: `${BASE}/servicos/pc-gamer/como-funciona`, changefreq: "monthly", priority: 0.75, lastmod: fileDate("src/pages/ComoFuncionaPcGamer.tsx") },
  { loc: `${BASE}/blog`, changefreq: "weekly", priority: 0.9, lastmod: blogMtime },
  { loc: `${BASE}/precos`, changefreq: "weekly", priority: 0.85, lastmod: precosMtime },
  { loc: `${BASE}/como-funciona`, changefreq: "monthly", priority: 0.8, lastmod: fileDate("src/pages/ComoFunciona.tsx") },
  { loc: `${BASE}/guia-tecnico-informatica`, changefreq: "monthly", priority: 0.85, lastmod: fileDate("src/pages/GuiaTecnicoInformatica.tsx") },
  { loc: `${BASE}/como-escolher-tecnico-preco-prazo`, changefreq: "monthly", priority: 0.8, lastmod: fileDate("src/pages/ComoEscolherTecnico.tsx") },
  { loc: `${BASE}/area-de-atendimento-curitiba`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/pages/AreaAtendimentoCuritiba.tsx") },
  { loc: `${BASE}/atendimento-urgente`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/pages/AtendimentoUrgente.tsx") },
  { loc: `${BASE}/checklists-de-reparo`, changefreq: "monthly", priority: 0.8, lastmod: fileDate("src/pages/ChecklistsReparo.tsx") },
  { loc: `${BASE}/busca`, changefreq: "weekly", priority: 0.5, lastmod: fileDate("src/pages/Busca.tsx") },
  { loc: `${BASE}/assistencia-tecnica-curitiba`, changefreq: "weekly", priority: 0.95, lastmod: fileDate("src/pages/AssistenciaTecnicaCuritiba.tsx") },
  { loc: `${BASE}/assistencia-tecnica`, changefreq: "weekly", priority: 0.95, lastmod: fileDate("src/pages/AssistenciaTecnica.tsx") },
  { loc: `${BASE}/atendimento-nacional`, changefreq: "weekly", priority: 0.9, lastmod: fileDate("src/pages/AtendimentoNacional.tsx") },
  { loc: `${BASE}/faq`, changefreq: "monthly", priority: 0.6, lastmod: fileDate("src/pages/Faq.tsx") },
  { loc: `${BASE}/dados-da-empresa`, changefreq: "yearly", priority: 0.4, lastmod: fileDate("src/pages/DadosEmpresa.tsx") },
  { loc: `${BASE}/gestor-responsavel`, changefreq: "yearly", priority: 0.6, lastmod: fileDate("src/pages/GestorResponsavel.tsx") },
  { loc: `${BASE}/servicos/troca-de-tela-tv-curitiba`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/pages/TrocaDeTelaTVCuritiba.tsx") },
  { loc: `${BASE}/servicos/reparo-smart-tv-curitiba`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/pages/ReparoSmartTVCuritiba.tsx") },
  { loc: `${BASE}/servicos/conserto-de-som-e-audio-curitiba`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/pages/ConsertoSomAudio.tsx") },
  { loc: `${BASE}/servicos/configuracao-wifi-curitiba`, changefreq: "weekly", priority: 0.85, lastmod: fileDate("src/pages/ConfiguracaoWifiCuritiba.tsx") },
  // Landing pages por keyword de serviço (Rodada 28.1)
  ...KEYWORD_SERVICE_PAGES.map((p) => ({
    loc: `${BASE}/${p.slug}`,
    changefreq: "weekly",
    priority: 0.9,
    lastmod: fileDate("src/data/keywordServices.ts"),
  })),
];

// Bairros dedicados por serviço em Curitiba (Wi-Fi + Smart TV)
import { BAIRROS_CURITIBA_SERVICO } from "../src/data/bairrosCuritibaServico";
import { CIDADES_REGIAO } from "../src/data/cidadesRegiao";
const bairroServicoMtime = fileDate("src/data/bairrosCuritibaServico.ts");
const cidadesRegiaoMtime = fileDate("src/data/cidadesRegiao.ts");
for (const b of BAIRROS_CURITIBA_SERVICO) {
  mainUrls.push({ loc: `${BASE}/servicos/reparo-smart-tv/curitiba/${b.slug}`, changefreq: "weekly", priority: 0.75, lastmod: bairroServicoMtime });
  mainUrls.push({ loc: `${BASE}/servicos/configuracao-wifi/curitiba/${b.slug}`, changefreq: "weekly", priority: 0.75, lastmod: bairroServicoMtime });
}

// Serviço × cidade da RMC (rodada 27.3)
for (const c of CIDADES_REGIAO) {
  for (const svc of ["reparo-smart-tv", "troca-de-tela-tv", "configuracao-wifi"] as const) {
    mainUrls.push({ loc: `${BASE}/servicos/${svc}/${c.slug}`, changefreq: "weekly", priority: 0.8, lastmod: cidadesRegiaoMtime });
  }
}

// Bairros dedicados por serviço em SJP e Pinhais (rodada 27.7)
import { BAIRROS_BY_CIDADE, CIDADE_REGIAO_META } from "../src/data/bairrosCidadesRegiao";
const bairrosRegiaoMtime = fileDate("src/data/bairrosCidadesRegiao.ts");
for (const [cidadeSlug, bairros] of Object.entries(BAIRROS_BY_CIDADE)) {
  const services = CIDADE_REGIAO_META[cidadeSlug as keyof typeof CIDADE_REGIAO_META].services;
  for (const b of bairros) {
    for (const svc of services) {
      mainUrls.push({ loc: `${BASE}/servicos/${svc}/${cidadeSlug}/${b.slug}`, changefreq: "weekly", priority: 0.7, lastmod: bairrosRegiaoMtime });
    }
  }
}

// Apenas slugs com conteúdo curado existem em /servicos/:slug (os demais são NotFound).
for (const slug of CURATED_SERVICE_SLUGS)
  mainUrls.push({ loc: `${BASE}/servicos/${slug}`, changefreq: "weekly", priority: 0.85, lastmod: servicesMtime });

// Lote de contratação local: /servicos/:servico/curitiba (informática core).
const curitibaLocalMtime = fileDate("src/data/curitibaServiceLocal.ts");
for (const slug of CURITIBA_SERVICE_SLUGS)
  mainUrls.push({ loc: `${BASE}/servicos/${slug}/curitiba`, changefreq: "weekly", priority: 0.85, lastmod: curitibaLocalMtime });

for (const cat of blogCategories)
  mainUrls.push({ loc: `${BASE}/blog/categoria/${cat.slug}`, changefreq: "weekly", priority: 0.7, lastmod: blogMtime });

for (const post of blogPosts) {
  const postDate = post.updatedAt ?? post.publishedAt;
  const fileBased = post.slug.includes("-em-") ? satMtime : blogMtime;
  const lastmod = clampLastmod(postDate > (fileBased ?? "") ? postDate : (fileBased as string));
  mainUrls.push({ loc: `${BASE}/blog/${post.slug}`, changefreq: "monthly", priority: 0.75, lastmod });
}

for (const c of nationalCities)
  mainUrls.push({ loc: `${BASE}/atendimento-nacional/${c.slug}`, changefreq: "weekly", priority: 0.8, lastmod: natMtime });

// Bairros âncora de cada cidade nacional — mesma tabela usada pelo <Route
// path="/atendimento-nacional/:city/:bairro" />. Adicionados aqui para o Google
// descobrir a matriz cidade×bairro sem shards separados.
{
  const natBairroMtime = fileDate("src/data/nationalBairros.ts");
  for (const c of nationalCities) {
    const bairros = nationalBairrosByCity[c.slug] ?? [];
    for (const b of bairros) {
      mainUrls.push({
        loc: `${BASE}/atendimento-nacional/${c.slug}/${b.slug}`,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: natBairroMtime,
      });
    }
  }
}



// Por-cidade (rota + service×city)
const cityShards: { city: string; urls: Url[] }[] = [];
const matrixLastmod = (servicesMtime ?? "") > (regionsMtime ?? "") ? servicesMtime : regionsMtime;
for (const cityKey of Object.keys(citiesData)) {
  const urls: Url[] = [
    { loc: `${BASE}/regioes/${cityKey}`, changefreq: "weekly", priority: 0.85, lastmod: regionsMtime },
  ];
  for (const serviceKey of Object.keys(servicesData))
    urls.push({ loc: `${BASE}/servico-em/${cityKey}/${serviceKey}`, changefreq: "weekly", priority: 0.7, lastmod: matrixLastmod });
  cityShards.push({ city: cityKey, urls });
}

// Por-bairros
const bairroShards: { city: string; urls: Url[] }[] = [];
for (const [city, bairros] of Object.entries(cityBairros)) {
  const urls: Url[] = bairros.map((b) => ({
    loc: `${BASE}/regioes/${city}/${slugify(b)}`,
    changefreq: "monthly",
    priority: 0.6,
    lastmod: regionsMtime,
  }));
  bairroShards.push({ city, urls });
}

// ---- Dedupe global ----
const seenGlobal = new Set<string>();
const dedupe = (urls: Url[]): Url[] => {
  const out: Url[] = [];
  for (const u of urls) {
    if (seenGlobal.has(u.loc)) continue;
    seenGlobal.add(u.loc);
    out.push(u);
  }
  return out;
};

const mainDeduped = dedupe(mainUrls);
const cityDeduped = cityShards.map((s) => ({ city: s.city, urls: dedupe(s.urls) }));
const bairroDeduped = bairroShards.map((s) => ({ city: s.city, urls: dedupe(s.urls) }));

// ---- XML ----
const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const urlXml = (u: Url) =>
  `  <url>
    <loc>${escape(u.loc)}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""}${u.changefreq ? `\n    <changefreq>${u.changefreq}</changefreq>` : ""}${u.priority ? `\n    <priority>${u.priority.toFixed(2)}</priority>` : ""}
    <xhtml:link rel="canonical" href="${escape(u.loc)}"/>
  </url>`;

const buildUrlset = (urls: Url[]) =>
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(urlXml).join("\n")}
</urlset>
`;

/** lastmod do shard = maior lastmod real das URLs; undefined se nenhuma tiver. */
const shardLastmod = (urls: Url[]): string | undefined => {
  const dates = urls.map((u) => u.lastmod).filter((d): d is string => Boolean(d)).sort();
  return dates.length > 0 ? clampLastmod(dates[dates.length - 1]) : undefined;
};

// Limpa shards antigos (per-city e per-bairro do modelo antigo, além dos
// consolidados atuais e do shard piloto nacional).
for (const f of readdirSync("public")) {
  if (/^sitemap-(main|city-|bairros-?|regions|servicos|cidades|nacional-servicos-piloto).*\.xml$/.test(f)) {
    try { unlinkSync(`public/${f}`); } catch {}
  }
}

// Shard piloto — matriz nacional serviço × cidade × bairro (Rodada 24.1).
const matrixCombos = enumeratePilotCombinations();
const matrixMtime = fileDate("src/data/nationalServiceCoverage.ts");
const matrixUrls: Url[] = matrixCombos.slice(0, NATIONAL_MATRIX_MAX).map((c) => ({
  loc: c.url,
  lastmod: matrixMtime,
  changefreq: "weekly",
  priority: 0.65,
}));
const matrixDeduped = dedupe(matrixUrls);

// ---- Segmentação por tipo de rota (Rodada 32.2) ----
// Shards temáticos ajudam o Google a diagnosticar cobertura por categoria:
//   serviços · cidades · bairros. Um shard por tipo, sem duplicar URL.
const path = (loc: string) => loc.replace(BASE, "");
const segs = (loc: string) => path(loc).split("/").filter(Boolean);

type Bucket = "servicos" | "cidades" | "bairros" | "main";

const classify = (loc: string): Bucket => {
  const p = segs(loc);
  if (p.length === 0) return "main";
  const [a, b, c] = p;

  // /regioes/:cidade/:bairro · /atendimento-nacional/:cidade/:bairro
  if ((a === "regioes" || a === "atendimento-nacional") && c) return "bairros";
  // /regioes/:cidade · /atendimento-nacional/:cidade
  if ((a === "regioes" || a === "atendimento-nacional") && b) return "cidades";

  // /servicos/:servico/:cidade/:bairro
  if (a === "servicos" && p.length >= 4) return "bairros";
  // /servicos/:servico/:cidade
  if (a === "servicos" && p.length === 3) return "cidades";
  // /servicos/:slug
  if (a === "servicos") return "servicos";

  // /servico-em/:cidade/:servico
  if (a === "servico-em") return "cidades";

  // Landings de serviço com keyword (ex.: /formatacao-de-computador-curitiba)
  if (p.length === 1 && /(conserto|formatacao|reparo|instalacao|manutencao|suporte|assistencia|configuracao|troca|empresa-de-ti|seguranca-dos-dados)/.test(a)) {
    return "servicos";
  }
  return "main";
};

const allUrls: Url[] = [
  ...mainDeduped,
  ...cityDeduped.flatMap((s) => s.urls),
  ...bairroDeduped.flatMap((s) => s.urls),
];

const buckets: Record<Bucket, Url[]> = { servicos: [], cidades: [], bairros: [], main: [] };
for (const u of allUrls) buckets[classify(u.loc)].push(u);

const shardIndex: { name: string; lastmod?: string }[] = [];

const emit = (name: string, urls: Url[]) => {
  if (urls.length === 0) return;
  writeFileSync(`public/${name}`, buildUrlset(urls));
  shardIndex.push({ name, lastmod: shardLastmod(urls) });
};

emit("sitemap-main.xml", buckets.main);
emit("sitemap-servicos.xml", buckets.servicos);
emit("sitemap-cidades.xml", buckets.cidades);
emit("sitemap-bairros.xml", buckets.bairros);

// Shard piloto — matriz nacional serviços.
emit("sitemap-nacional-servicos-piloto.xml", matrixDeduped);

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${shardIndex
  .map(
    (s) => `  <sitemap>
    <loc>${BASE}/${s.name}</loc>${s.lastmod ? `\n    <lastmod>${s.lastmod}</lastmod>` : ""}
  </sitemap>`,
  )
  .join("\n")}
</sitemapindex>
`;
writeFileSync("public/sitemap.xml", indexXml);

const total = allUrls.length + matrixDeduped.length;
console.log(`✓ sitemap-index escrito com ${shardIndex.length} shards, ${total} URLs únicas`);
for (const s of shardIndex) console.log(`  • ${s.name}`);
