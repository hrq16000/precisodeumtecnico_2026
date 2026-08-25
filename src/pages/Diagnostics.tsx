import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

interface SchemaEntry {
  raw: string;
  parsed: unknown;
  type: string;
  errors: string[];
  warnings: string[];
}

const REQUIRED_BY_TYPE: Record<string, string[]> = {
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
  Article: ["headline", "datePublished", "author", "image"],
  BlogPosting: ["headline", "datePublished", "author", "image"],
  NewsArticle: ["headline", "datePublished", "author", "image"],
  Service: ["name", "provider", "areaServed"],
  LocalBusiness: ["name", "address", "telephone", "url"],
  Organization: ["name", "url"],
  Review: ["author", "reviewRating", "itemReviewed"],
  AggregateRating: ["ratingValue", "reviewCount"],
  WebSite: ["name", "url"],
  WebPage: ["name", "url"],
  Blog: ["name"],
  Product: ["name", "image", "description"],
  Offer: ["price", "priceCurrency"],
  Question: ["name", "acceptedAnswer"],
  Answer: ["text"],
  PostalAddress: ["addressLocality", "addressCountry"],
  ImageObject: ["url"],
  Person: ["name"],
  VideoObject: ["name", "thumbnailUrl", "uploadDate"],
  Event: ["name", "startDate", "location"],
  HowTo: ["name", "step"],
  Recipe: ["name", "recipeIngredient", "recipeInstructions"],
};

const RECOMMENDED_BY_TYPE: Record<string, string[]> = {
  LocalBusiness: ["openingHoursSpecification", "aggregateRating", "geo", "priceRange", "image"],
  Service: ["areaServed", "offers", "description"],
  Article: ["publisher", "mainEntityOfPage", "dateModified"],
  BlogPosting: ["publisher", "mainEntityOfPage", "dateModified"],
  Product: ["offers", "brand", "aggregateRating"],
  Organization: ["logo", "sameAs", "contactPoint"],
  WebSite: ["potentialAction"],
};

const KNOWN_TYPES = new Set(Object.keys(REQUIRED_BY_TYPE));

function getType(obj: Record<string, unknown>): string {
  const raw = obj["@type"];
  return Array.isArray(raw) ? String(raw[0]) : String(raw ?? "unknown");
}

function validateNode(
  obj: Record<string, unknown>,
  path: string,
  errors: string[],
  warnings: string[],
) {
  const type = getType(obj);
  const required = REQUIRED_BY_TYPE[type];
  if (required) {
    for (const k of required) {
      const v = obj[k];
      if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0))
        errors.push(`${path || type}: campo obrigatório ausente para @type=${type} → "${k}"`);
    }
  }
  const recommended = RECOMMENDED_BY_TYPE[type];
  if (recommended) {
    for (const k of recommended) {
      if (obj[k] === undefined || obj[k] === null || obj[k] === "")
        warnings.push(`${path || type}: recomendado para @type=${type} → "${k}"`);
    }
  }
  // Walk nested typed objects
  for (const [k, v] of Object.entries(obj)) {
    if (k.startsWith("@")) continue;
    const items = Array.isArray(v) ? v : [v];
    items.forEach((item, idx) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const child = item as Record<string, unknown>;
        if (child["@type"]) {
          const sub = Array.isArray(v) ? `${path || type}.${k}[${idx}]` : `${path || type}.${k}`;
          validateNode(child, sub, errors, warnings);
        }
      }
    });
  }
}

function validate(parsed: unknown): { type: string; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!parsed || typeof parsed !== "object") {
    return { type: "unknown", errors: ["Não é um objeto JSON válido."], warnings };
  }
  const obj = parsed as Record<string, unknown>;
  const type = getType(obj);
  if (!obj["@context"]) errors.push("Faltando @context");
  if (!obj["@type"]) errors.push("Faltando @type");
  if (obj["@type"] && !KNOWN_TYPES.has(type)) {
    warnings.push(`@type "${type}" não está na lista de tipos validados`);
  }
  validateNode(obj, "", errors, warnings);

  // Type-specific deep checks
  if (type === "FAQPage" && Array.isArray(obj.mainEntity)) {
    obj.mainEntity.forEach((q, i) => {
      const qq = q as Record<string, unknown>;
      if (!qq.name) errors.push(`mainEntity[${i}].name ausente`);
      const aa = qq.acceptedAnswer as Record<string, unknown> | undefined;
      if (!aa) errors.push(`mainEntity[${i}].acceptedAnswer ausente`);
      else if (!aa.text) errors.push(`mainEntity[${i}].acceptedAnswer.text ausente`);
    });
  }
  if (type === "BreadcrumbList" && Array.isArray(obj.itemListElement)) {
    obj.itemListElement.forEach((it, i) => {
      const e = it as Record<string, unknown>;
      if (!e.position) warnings.push(`itemListElement[${i}].position ausente`);
      if (!e.name) warnings.push(`itemListElement[${i}].name ausente`);
      if (!e.item) warnings.push(`itemListElement[${i}].item (URL) ausente`);
    });
  }
  return { type, errors, warnings };
}

function readSchemasFromDoc(doc: Document): SchemaEntry[] {
  const nodes = Array.from(doc.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'));
  return nodes.map((n) => {
    const raw = n.textContent ?? "";
    try {
      const parsed = JSON.parse(raw);
      const v = validate(parsed);
      return { raw, parsed, ...v };
    } catch (e) {
      return { raw, parsed: null, type: "invalid", errors: [`JSON inválido: ${(e as Error).message}`], warnings: [] };
    }
  });
}
function readMetaFromDoc(doc: Document, name: string) {
  const el =
    doc.querySelector(`meta[property="${name}"]`) ||
    doc.querySelector(`meta[name="${name}"]`);
  return el?.getAttribute("content") ?? null;
}

interface AuditCheck { ok: boolean; label: string; detail?: string }

function runPageAudit(doc: Document, currentPath: string): AuditCheck[] {
  const checks: AuditCheck[] = [];
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null;

  if (!canonical) {
    checks.push({ ok: false, label: "Canonical presente", detail: "rel=canonical ausente" });
  } else {
    const isAbsolute = /^https?:\/\//i.test(canonical);
    checks.push({ ok: isAbsolute, label: "Canonical absoluto", detail: canonical });
    try {
      const u = new URL(canonical);
      if (currentPath && currentPath.startsWith("/")) {
        const matches = u.pathname.replace(/\/$/, "") === currentPath.split("?")[0].replace(/\/$/, "");
        checks.push({
          ok: matches,
          label: "Canonical aponta para a rota atual",
          detail: `${u.pathname} ↔ ${currentPath}`,
        });
      }
    } catch { /* ignored */ }
  }

  const robots = doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
  const noindex = /noindex/i.test(robots);
  const isDiag = currentPath.startsWith("/diagnostic");
  checks.push({
    ok: isDiag ? noindex : !noindex,
    label: isDiag ? "Diagnóstico marcado como noindex" : "Página indexável (sem noindex)",
    detail: robots || "(sem meta robots)",
  });

  const hreflangs = Array.from(doc.querySelectorAll('link[rel="alternate"][hreflang]'));
  if (hreflangs.length) {
    const broken = hreflangs.filter((l) => !l.getAttribute("href") || !l.getAttribute("hreflang"));
    checks.push({
      ok: broken.length === 0,
      label: `${hreflangs.length} hreflang declarado(s)`,
      detail: broken.length ? `${broken.length} sem href/hreflang` : "todos válidos",
    });
  }

  const h1s = doc.querySelectorAll("h1");
  checks.push({
    ok: h1s.length === 1,
    label: "Exatamente um <h1>",
    detail: `${h1s.length} encontrado(s)${h1s.length ? `: "${(h1s[0].textContent ?? "").trim().slice(0, 80)}"` : ""}`,
  });

  const ogImg = doc.querySelector('meta[property="og:image"]')?.getAttribute("content");
  checks.push({ ok: !!ogImg, label: "og:image definido", detail: ogImg ?? "ausente" });

  return checks;
}

// ---------------- SEO checklist (final) ----------------

function runSeoChecklist(doc: Document): AuditCheck[] {
  const checks: AuditCheck[] = [];
  const html = doc.documentElement;
  checks.push({ ok: !!html.getAttribute("lang"), label: "<html lang> definido", detail: html.getAttribute("lang") ?? "ausente" });

  const viewport = doc.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? "";
  checks.push({ ok: /width=device-width/i.test(viewport), label: "Viewport responsivo", detail: viewport || "ausente" });

  const title = doc.title || "";
  checks.push({ ok: title.length >= 20 && title.length <= 70, label: "Title 20–70 chars", detail: `${title.length}: ${title}` });

  const desc = doc.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
  checks.push({ ok: desc.length >= 80 && desc.length <= 170, label: "Meta description 80–170 chars", detail: `${desc.length}` });

  const h1 = doc.querySelectorAll("h1").length;
  const h2 = doc.querySelectorAll("h2").length;
  checks.push({ ok: h1 === 1, label: "Headings: exatamente 1 H1", detail: `H1=${h1}, H2=${h2}` });
  checks.push({ ok: h2 >= 2, label: "Headings: ≥2 H2 (estrutura)", detail: `H2=${h2}` });

  const imgs = Array.from(doc.querySelectorAll("img"));
  const noAlt = imgs.filter((i) => !i.getAttribute("alt"));
  checks.push({
    ok: noAlt.length === 0,
    label: "Imagens com alt",
    detail: `${imgs.length - noAlt.length}/${imgs.length} com alt`,
  });

  const links = Array.from(doc.querySelectorAll("a[href]"));
  const internal = links.filter((a) => {
    const href = a.getAttribute("href") || "";
    return href.startsWith("/") || href.includes("precisodeumtecnico");
  });
  checks.push({
    ok: internal.length >= 10,
    label: "Links internos (≥10 recomendado)",
    detail: `${internal.length} internos / ${links.length} totais`,
  });

  const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
  checks.push({
    ok: !/noindex/i.test(robotsMeta),
    label: "Indexável (sem noindex)",
    detail: robotsMeta || "(sem meta robots)",
  });

  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
  checks.push({ ok: /^https?:\/\//i.test(canonical), label: "Canonical absoluto", detail: canonical || "ausente" });

  const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute("content");
  const ogDesc = doc.querySelector('meta[property="og:description"]')?.getAttribute("content");
  const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute("content");
  checks.push({ ok: !!(ogTitle && ogDesc && ogImage), label: "OG completo (title+desc+image)" });

  // Core Web Vitals (apenas quando rodando na própria aba)
  if (typeof performance !== "undefined" && (performance as { getEntriesByType?: (t: string) => PerformanceEntry[] }).getEntriesByType) {
    const nav = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined);
    if (nav) {
      const ttfb = Math.round(nav.responseStart);
      checks.push({ ok: ttfb < 800, label: `TTFB ${ttfb}ms (<800ms ideal)`, detail: `${ttfb}ms` });
      const domReady = Math.round(nav.domContentLoadedEventEnd);
      checks.push({ ok: domReady < 2500, label: `DOMContentLoaded ${domReady}ms`, detail: `${domReady}ms` });
    }
  }

  return checks;
}

// ---------------- Sitemap audit ----------------

interface SitemapAudit {
  url: string;
  ok: boolean;
  status?: number;
  urlCount?: number;
  hasExpected?: boolean;
  error?: string;
}

const EXPECTED_SITEMAP_PATHS = ["/", "/servicos", "/precos", "/blog", "/contato"];

async function auditSitemaps(robotsRaw: string): Promise<SitemapAudit[]> {
  const lines = robotsRaw.match(/^\s*Sitemap:\s*(\S+)/gim) ?? [];
  const urls = lines.map((l) => l.replace(/^\s*Sitemap:\s*/i, "").trim()).filter(Boolean);
  if (urls.length === 0) return [];
  const results: SitemapAudit[] = [];
  for (const url of urls) {
    try {
      // Tentar via mesma origem para evitar CORS quando possível.
      const sameOrigin = url.replace(/^https?:\/\/[^/]+/, "");
      const fetchUrl = sameOrigin.startsWith("/") ? sameOrigin : url;
      const res = await fetch(fetchUrl, { cache: "no-store" });
      if (!res.ok) {
        results.push({ url, ok: false, status: res.status, error: `HTTP ${res.status}` });
        continue;
      }
      const text = await res.text();
      const locs = Array.from(text.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
      const hasExpected = EXPECTED_SITEMAP_PATHS.every((p) =>
        locs.some((l) => l.endsWith(p) || l.endsWith(`${p}/`)),
      );
      results.push({ url, ok: true, status: res.status, urlCount: locs.length, hasExpected });
    } catch (e) {
      results.push({ url, ok: false, error: (e as Error).message });
    }
  }
  return results;
}


// ---------------- Bulk audit ----------------

const BULK_DEFAULT_ROUTES = [
  "/",
  "/servicos",
  "/servicos/informatica",
  "/servicos/redes-wifi",
  "/regioes",
  "/regioes/curitiba",
  "/regioes/curitiba/batel",
  "/servico-em/curitiba/informatica",
  "/precos",
  "/blog",
  "/blog/categoria/informatica",
  "/contato",
  "/sobre",
];

interface BulkResult {
  path: string;
  status: "pending" | "ok" | "fail" | "error";
  schemaCount: number;
  schemaErrors: number;
  auditFails: number;
  failingChecks: string[];
}

// ---------------- Robots.txt audit ----------------

interface RobotsAudit {
  loaded: boolean;
  raw?: string;
  checks: AuditCheck[];
}

async function auditRobots(): Promise<RobotsAudit> {
  try {
    const res = await fetch("/robots.txt", { cache: "no-store" });
    if (!res.ok) {
      return {
        loaded: false,
        checks: [{ ok: false, label: "robots.txt acessível", detail: `HTTP ${res.status}` }],
      };
    }
    const raw = await res.text();
    const lower = raw.toLowerCase();
    const checks: AuditCheck[] = [];

    checks.push({ ok: true, label: "robots.txt acessível", detail: `${raw.length} bytes` });

    const sitemapMatches = raw.match(/^\s*Sitemap:\s*(\S+)/gim) ?? [];
    checks.push({
      ok: sitemapMatches.length > 0,
      label: "Sitemap declarado",
      detail: sitemapMatches.join(" | ") || "nenhuma diretiva Sitemap:",
    });
    const sitemapAbs = sitemapMatches.every((l) => /https?:\/\//i.test(l));
    if (sitemapMatches.length) {
      checks.push({
        ok: sitemapAbs,
        label: "Sitemap com URL absoluta (https://)",
        detail: sitemapAbs ? "ok" : "use URL completa",
      });
    }

    checks.push({
      ok: /user-agent:\s*\*/i.test(raw),
      label: "Possui User-agent: *",
    });
    checks.push({
      ok: /user-agent:\s*googlebot/i.test(raw),
      label: "Permite Googlebot explicitamente",
    });
    checks.push({
      ok: !/disallow:\s*\/\s*$/im.test(raw) || /allow:\s*\//i.test(raw),
      label: "Não bloqueia o site inteiro (Disallow: /)",
    });
    checks.push({
      ok: /disallow:\s*\/admin/i.test(lower),
      label: "Bloqueia /admin",
    });

    return { loaded: true, raw, checks };
  } catch (e) {
    return {
      loaded: false,
      checks: [{ ok: false, label: "robots.txt acessível", detail: (e as Error).message }],
    };
  }
}

export default function Diagnostics() {
  const [schemas, setSchemas] = useState<SchemaEntry[]>([]);
  const [target, setTarget] = useState<string>(() => {
    const p = new URLSearchParams(window.location.search).get("path");
    return p ?? "/";
  });
  const [loadedFor, setLoadedFor] = useState<string>("/diagnostics");
  const [meta, setMeta] = useState<Record<string, string | null>>({});
  const [audit, setAudit] = useState<AuditCheck[]>([]);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const onLoadHandlerRef = useRef<(() => void) | null>(null);

  // Bulk audit state
  const [bulkInput, setBulkInput] = useState<string>(BULK_DEFAULT_ROUTES.join("\n"));
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([]);
  const [bulkRunning, setBulkRunning] = useState(false);

  // Robots audit state
  const [robotsAudit, setRobotsAudit] = useState<RobotsAudit | null>(null);
  const [robotsLoading, setRobotsLoading] = useState(false);

  // SEO checklist + sitemap audit
  const [seoChecklist, setSeoChecklist] = useState<AuditCheck[]>([]);
  const [sitemapAudits, setSitemapAudits] = useState<SitemapAudit[]>([]);
  const [sitemapLoading, setSitemapLoading] = useState(false);

  // Smoke SEO — rotas críticas
  interface SmokeRow {
    path: string;
    status: "pending" | "ok" | "fail" | "error";
    canonical: string | null;
    canonicalCount: number;
    ogImage: string | null;
    ogImageCount: number;
    ogTitleCount: number;
    fails: string[];
  }
  const CRITICAL_ROUTES = [
    "/",
    "/servicos",
    "/precos",
    "/assistencia-tecnica-curitiba",
    "/termos-orcamento-pre-aprovado",
    "/contato",
  ];
  const [smoke, setSmoke] = useState<SmokeRow[]>([]);
  const [smokeRunning, setSmokeRunning] = useState(false);

  const collect = (doc: Document, path: string) => {
    setSchemas(readSchemasFromDoc(doc));
    setMeta({
      title: doc.title,
      description: readMetaFromDoc(doc, "description"),
      canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? null,
      "og:title": readMetaFromDoc(doc, "og:title"),
      "og:description": readMetaFromDoc(doc, "og:description"),
      "og:image": readMetaFromDoc(doc, "og:image"),
      "og:type": readMetaFromDoc(doc, "og:type"),
      "twitter:card": readMetaFromDoc(doc, "twitter:card"),
      "twitter:image": readMetaFromDoc(doc, "twitter:image"),
    });
    setAudit(runPageAudit(doc, path));
    setSeoChecklist(runSeoChecklist(doc));
    setLoadedFor(path);
  };

  const refresh = () => collect(document, window.location.pathname + window.location.search);

  const auditPath = (path: string) => {
    if (!path || path === "/diagnostics" || path.startsWith("/diagnostico")) {
      refresh();
      setIframeUrl(null);
      return;
    }
    setLoading(true);
    onLoadHandlerRef.current = () => {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) { setLoading(false); return; }
      setTimeout(() => {
        collect(doc, path);
        setLoading(false);
      }, 250);
    };
    setIframeUrl(path);
  };

  const onIframeLoad = () => {
    onLoadHandlerRef.current?.();
  };

  // Load a path into the hidden iframe and resolve with its document.
  const loadPathInIframe = (path: string): Promise<Document | null> =>
    new Promise((resolve) => {
      onLoadHandlerRef.current = () => {
        // Wait for Helmet to populate head.
        setTimeout(() => resolve(iframeRef.current?.contentDocument ?? null), 350);
      };
      setIframeUrl((prev) => (prev === path ? `${path}?_=${Date.now()}` : path));
    });

  const runBulkAudit = async () => {
    const paths = bulkInput
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p && p.startsWith("/") && !p.startsWith("/diagnostic"));
    if (!paths.length) return;
    setBulkRunning(true);
    const initial: BulkResult[] = paths.map((p) => ({
      path: p, status: "pending", schemaCount: 0, schemaErrors: 0, auditFails: 0, failingChecks: [],
    }));
    setBulkResults(initial);

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      try {
        const doc = await loadPathInIframe(path);
        if (!doc) {
          setBulkResults((prev) => prev.map((r, idx) => idx === i ? { ...r, status: "error" } : r));
          continue;
        }
        const ss = readSchemasFromDoc(doc);
        const checks = runPageAudit(doc, path);
        const schemaErrors = ss.reduce((a, s) => a + s.errors.length, 0);
        const failing = checks.filter((c) => !c.ok);
        const status: BulkResult["status"] = schemaErrors === 0 && failing.length === 0 ? "ok" : "fail";
        setBulkResults((prev) => prev.map((r, idx) => idx === i ? {
          ...r,
          status,
          schemaCount: ss.length,
          schemaErrors,
          auditFails: failing.length,
          failingChecks: failing.map((c) => c.label),
        } : r));
      } catch {
        setBulkResults((prev) => prev.map((r, idx) => idx === i ? { ...r, status: "error" } : r));
      }
    }
    setBulkRunning(false);
  };

  const runRobotsAudit = async () => {
    setRobotsLoading(true);
    const r = await auditRobots();
    setRobotsAudit(r);
    setRobotsLoading(false);
    if (r.loaded && r.raw) {
      setSitemapLoading(true);
      const s = await auditSitemaps(r.raw);
      setSitemapAudits(s);
      setSitemapLoading(false);
    }
  };

  const runSmoke = async () => {
    setSmokeRunning(true);
    const initial: SmokeRow[] = CRITICAL_ROUTES.map((p) => ({
      path: p, status: "pending", canonical: null, canonicalCount: 0,
      ogImage: null, ogImageCount: 0, ogTitleCount: 0, fails: [],
    }));
    setSmoke(initial);
    for (let i = 0; i < CRITICAL_ROUTES.length; i++) {
      const path = CRITICAL_ROUTES[i];
      try {
        const doc = await loadPathInIframe(path);
        if (!doc) {
          setSmoke((prev) => prev.map((r, idx) => idx === i ? { ...r, status: "error", fails: ["iframe sem document"] } : r));
          continue;
        }
        const head = doc.head;
        const canonicals = head.querySelectorAll('link[rel="canonical"]');
        const ogImages = head.querySelectorAll('meta[property="og:image"]');
        const ogTitles = head.querySelectorAll('meta[property="og:title"]');
        const canonical = canonicals[0]?.getAttribute("href") ?? null;
        const ogImage = ogImages[0]?.getAttribute("content") ?? null;
        const fails: string[] = [];
        if (canonicals.length !== 1) fails.push(`canonical=${canonicals.length}`);
        if (ogImages.length !== 1) fails.push(`og:image=${ogImages.length}`);
        if (ogTitles.length !== 1) fails.push(`og:title=${ogTitles.length}`);
        if (!canonical || !/^https?:\/\//i.test(canonical)) fails.push("canonical não absoluto");
        setSmoke((prev) => prev.map((r, idx) => idx === i ? {
          ...r,
          status: fails.length ? "fail" : "ok",
          canonical, canonicalCount: canonicals.length,
          ogImage, ogImageCount: ogImages.length,
          ogTitleCount: ogTitles.length,
          fails,
        } : r));
      } catch (e) {
        setSmoke((prev) => prev.map((r, idx) => idx === i ? { ...r, status: "error", fails: [(e as Error).message] } : r));
      }
    }
    setSmokeRunning(false);
  };

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("path");
    const t = setTimeout(() => {
      if (initial && initial !== "/" && !initial.startsWith("/diagnostic")) {
        setTarget(initial);
        auditPath(initial);
      } else {
        refresh();
      }
    }, 50);
    // Also auto-run robots audit.
    runRobotsAudit();
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalErrors = schemas.reduce((a, s) => a + s.errors.length, 0);
  const totalWarnings = schemas.reduce((a, s) => a + s.warnings.length, 0);

  const bulkSummary = {
    total: bulkResults.length,
    ok: bulkResults.filter((r) => r.status === "ok").length,
    fail: bulkResults.filter((r) => r.status === "fail").length,
    error: bulkResults.filter((r) => r.status === "error").length,
    pending: bulkResults.filter((r) => r.status === "pending").length,
  };

  return (
    <Layout>
      <Helmet>
        <title>Diagnóstico SEO | Schemas & Open Graph</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Diagnóstico SEO</h1>
          <p className="text-muted-foreground mb-6">
            Auditoria de schemas, Open Graph, robots.txt e auditoria em lote de várias rotas.
            Use <code>?path=/alguma-rota</code> para abrir uma rota específica direto.
          </p>

          {/* Single URL */}
          <Card className="p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <input
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="/blog/algum-post"
                className="flex-1 px-3 py-2 rounded-sm border border-border bg-background"
              />
              <Button onClick={() => auditPath(target)} disabled={loading || bulkRunning}>
                {loading ? "Carregando..." : "Auditar URL"}
              </Button>
              <Button variant="outline" onClick={refresh}>Reescanear esta aba</Button>
              <Button variant="ghost" onClick={() => window.open(target, "_blank", "noopener,noreferrer")}>
                Abrir
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Auditando: <code>{loadedFor}</code>
            </p>
            {iframeUrl && (
              <iframe
                ref={iframeRef}
                src={iframeUrl}
                onLoad={onIframeLoad}
                title="audit-frame"
                className="sr-only"
                aria-hidden
                style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
              />
            )}
          </Card>

          {/* Smoke SEO — rotas críticas */}
          <h2 className="font-display text-xl font-bold mb-3">Smoke SEO — rotas críticas</h2>
          <Card className="p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-3">
              Mede canonical e og:image nas 6 rotas críticas. Falha se houver duplicidade
              (canonical ≠ 1, og:image ≠ 1, og:title ≠ 1) ou canonical não absoluto.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Button onClick={runSmoke} disabled={smokeRunning || bulkRunning}>
                {smokeRunning ? "Medindo..." : "Rodar smoke agora"}
              </Button>
              <Button
                variant="outline"
                disabled={smoke.length === 0 || smokeRunning}
                onClick={() => {
                  const report = {
                    generated_at: new Date().toISOString(),
                    origin: window.location.origin,
                    routes: smoke.map((r) => ({
                      path: r.path,
                      absolute_url: `${window.location.origin}${r.path}`,
                      status: r.status,
                      canonical: r.canonical,
                      canonical_count: r.canonicalCount,
                      og_image: r.ogImage,
                      og_image_count: r.ogImageCount,
                      og_title_count: r.ogTitleCount,
                      fails: r.fails,
                      evidence: {
                        open: `${window.location.origin}${r.path}`,
                        audit: `${window.location.origin}/diagnostics?path=${encodeURIComponent(r.path)}`,
                      },
                    })),
                  };
                  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `smoke-seo-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Exportar JSON
              </Button>
              <Button
                variant="outline"
                disabled={smoke.length === 0 || smokeRunning}
                onClick={() => {
                  const header = [
                    "path",
                    "status",
                    "canonical",
                    "canonical_count",
                    "og_image",
                    "og_image_count",
                    "og_title_count",
                    "fails",
                    "evidence_open",
                    "evidence_audit",
                  ];
                  const esc = (v: unknown) => {
                    const s = v == null ? "" : String(v);
                    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
                  };
                  const rows = smoke.map((r) =>
                    [
                      r.path,
                      r.status,
                      r.canonical ?? "",
                      r.canonicalCount,
                      r.ogImage ?? "",
                      r.ogImageCount,
                      r.ogTitleCount,
                      r.fails.join("|"),
                      `${window.location.origin}${r.path}`,
                      `${window.location.origin}/diagnostics?path=${encodeURIComponent(r.path)}`,
                    ]
                      .map(esc)
                      .join(","),
                  );
                  const csv = [header.join(","), ...rows].join("\n");
                  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `smoke-seo-${Date.now()}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Exportar CSV
              </Button>
              {smoke.some((r) => r.status === "fail") && (
                <Badge variant="destructive" className="self-center">
                  {smoke.filter((r) => r.status === "fail").length} rota(s) com falha
                </Badge>
              )}
            </div>
            {smoke.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-left border-b border-border">
                      <th className="py-2 pr-2">Rota</th>
                      <th className="py-2 pr-2">Status</th>
                      <th className="py-2 pr-2">canonical</th>
                      <th className="py-2 pr-2">og:image</th>
                      <th className="py-2 pr-2">og:title</th>
                      <th className="py-2 pr-2">Falhas</th>
                      <th className="py-2 pr-2">Evidência</th>
                    </tr>
                  </thead>
                  <tbody>
                    {smoke.map((r) => (
                      <tr key={r.path} className="border-b border-border/60 align-top">
                        <td className="py-2 pr-2 font-mono">{r.path}</td>
                        <td className="py-2 pr-2">
                          <Badge variant={r.status === "ok" ? "secondary" : r.status === "pending" ? "outline" : "destructive"}>
                            {r.status}
                          </Badge>
                        </td>
                        <td className="py-2 pr-2 break-all">
                          <span className={r.canonicalCount === 1 ? "" : "text-destructive font-semibold"}>
                            ×{r.canonicalCount}
                          </span>
                          {r.canonical && <div className="text-muted-foreground">{r.canonical}</div>}
                        </td>
                        <td className="py-2 pr-2 break-all">
                          <span className={r.ogImageCount === 1 ? "" : "text-destructive font-semibold"}>
                            ×{r.ogImageCount}
                          </span>
                          {r.ogImage && <div className="text-muted-foreground truncate max-w-[240px]">{r.ogImage}</div>}
                        </td>
                        <td className="py-2 pr-2">
                          <span className={r.ogTitleCount === 1 ? "" : "text-destructive font-semibold"}>
                            ×{r.ogTitleCount}
                          </span>
                        </td>
                        <td className="py-2 pr-2 text-destructive">
                          {r.fails.length ? r.fails.join(", ") : "—"}
                        </td>
                        <td className="py-2 pr-2">
                          <a className="underline" href={r.path} target="_blank" rel="noopener noreferrer">abrir</a>
                          {" · "}
                          <a className="underline" href={`/diagnostics?path=${encodeURIComponent(r.path)}`} target="_blank" rel="noopener noreferrer">auditar</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Bulk audit */}
          <h2 className="font-display text-xl font-bold mb-3">Auditoria em lote</h2>
          <Card className="p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-2">
              Uma rota por linha. Cada URL é carregada em sequência num iframe oculto e validada.
            </p>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 rounded-sm border border-border bg-background font-mono text-xs"
              disabled={bulkRunning}
            />
            <div className="flex flex-wrap gap-2 mt-3 items-center">
              <Button onClick={runBulkAudit} disabled={bulkRunning || loading}>
                {bulkRunning ? "Auditando..." : "Rodar auditoria em lote"}
              </Button>
              <Button variant="outline" onClick={() => setBulkInput(BULK_DEFAULT_ROUTES.join("\n"))} disabled={bulkRunning}>
                Restaurar padrão
              </Button>
              {bulkResults.length > 0 && (
                <div className="flex gap-2 text-xs ml-auto">
                  <Badge variant="secondary">{bulkSummary.ok} OK</Badge>
                  {bulkSummary.fail > 0 && <Badge variant="destructive">{bulkSummary.fail} falhas</Badge>}
                  {bulkSummary.error > 0 && <Badge variant="destructive">{bulkSummary.error} erros</Badge>}
                  {bulkSummary.pending > 0 && <Badge>{bulkSummary.pending} pendentes</Badge>}
                </div>
              )}
            </div>

            {bulkResults.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-left text-muted-foreground">
                    <tr>
                      <th className="py-1">Rota</th>
                      <th className="py-1">Status</th>
                      <th className="py-1">Schemas</th>
                      <th className="py-1">Erros</th>
                      <th className="py-1">Falhas</th>
                      <th className="py-1">Detalhes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkResults.map((r) => (
                      <tr key={r.path} className="border-t border-border">
                        <td className="py-1 pr-2 font-mono break-all">{r.path}</td>
                        <td className="py-1 pr-2">
                          {r.status === "ok" && <Badge variant="secondary">OK</Badge>}
                          {r.status === "fail" && <Badge variant="destructive">FALHA</Badge>}
                          {r.status === "error" && <Badge variant="destructive">ERRO</Badge>}
                          {r.status === "pending" && <Badge>...</Badge>}
                        </td>
                        <td className="py-1 pr-2">{r.schemaCount}</td>
                        <td className="py-1 pr-2">{r.schemaErrors}</td>
                        <td className="py-1 pr-2">{r.auditFails}</td>
                        <td className="py-1 text-muted-foreground">{r.failingChecks.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* robots.txt */}
          <h2 className="font-display text-xl font-bold mb-3">robots.txt</h2>
          <Card className="p-4 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Button size="sm" onClick={runRobotsAudit} disabled={robotsLoading}>
                {robotsLoading ? "Verificando..." : "Reverificar robots.txt"}
              </Button>
              <a className="text-xs underline" href="/robots.txt" target="_blank" rel="noopener noreferrer">abrir</a>
            </div>
            {robotsAudit ? (
              <>
                <ul className="space-y-2 text-sm">
                  {robotsAudit.checks.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Badge variant={c.ok ? "secondary" : "destructive"} className="mt-0.5">
                        {c.ok ? "OK" : "FALHA"}
                      </Badge>
                      <div className="flex-1">
                        <p className="font-medium">{c.label}</p>
                        {c.detail && <p className="text-xs text-muted-foreground break-all">{c.detail}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
                {robotsAudit.raw && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-xs text-muted-foreground">Ver robots.txt</summary>
                    <pre className="mt-2 text-xs bg-secondary/40 p-3 rounded-sm overflow-auto max-h-64">{robotsAudit.raw}</pre>
                  </details>
                )}
              </>
            ) : (
              <p className="text-muted-foreground text-sm">Carregando…</p>
            )}
          </Card>

          {/* Sitemaps referenced by robots.txt */}
          <h2 className="font-display text-xl font-bold mb-3">Sitemaps (referenciados em robots.txt)</h2>
          <Card className="p-4 mb-8">
            {sitemapLoading && <p className="text-sm text-muted-foreground">Verificando sitemaps…</p>}
            {!sitemapLoading && sitemapAudits.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum sitemap referenciado ou robots.txt indisponível.</p>
            )}
            {sitemapAudits.length > 0 && (
              <ul className="space-y-3 text-sm">
                {sitemapAudits.map((s, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Badge variant={s.ok && s.hasExpected ? "secondary" : "destructive"} className="mt-0.5">
                      {s.ok && s.hasExpected ? "OK" : s.ok ? "PARCIAL" : "FALHA"}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium break-all">
                        <a className="underline" href={s.url} target="_blank" rel="noopener noreferrer">{s.url}</a>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {s.ok
                          ? `HTTP ${s.status} · ${s.urlCount} URL(s) · rotas essenciais ${s.hasExpected ? "presentes" : "AUSENTES"}`
                          : s.error}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Single page details */}
          <div className="grid sm:grid-cols-3 gap-3 mb-6">
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Schemas encontrados</p>
              <p className="text-3xl font-bold">{schemas.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Erros</p>
              <p className={`text-3xl font-bold ${totalErrors ? "text-destructive" : ""}`}>{totalErrors}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">Avisos</p>
              <p className="text-3xl font-bold">{totalWarnings}</p>
            </Card>
          </div>

          <h2 className="font-display text-xl font-bold mb-3">Open Graph & Meta</h2>
          <Card className="p-4 mb-8">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(meta).map(([k, v]) => (
                  <tr key={k} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs text-muted-foreground align-top">{k}</td>
                    <td className="py-2 break-all">
                      {v ? v : <span className="text-destructive">— ausente —</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <h2 className="font-display text-xl font-bold mb-3">Auditoria da página</h2>
          <Card className="p-4 mb-8">
            <ul className="space-y-2 text-sm">
              {audit.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Badge variant={c.ok ? "secondary" : "destructive"} className="mt-0.5">
                    {c.ok ? "OK" : "FALHA"}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">{c.label}</p>
                    {c.detail && (
                      <p className="text-xs text-muted-foreground break-all">{c.detail}</p>
                    )}
                  </div>
                </li>
              ))}
              {audit.length === 0 && (
                <li className="text-muted-foreground">Sem auditorias ainda.</li>
              )}
            </ul>
          </Card>

          <h2 className="font-display text-xl font-bold mb-3">Checklist final de SEO</h2>
          <Card className="p-4 mb-8">
            <p className="text-xs text-muted-foreground mb-3">
              Cobre Core Web Vitals (TTFB), headings (H1/H2), links internos, indexabilidade, canonical, OG e metadados.
            </p>
            <ul className="space-y-2 text-sm">
              {seoChecklist.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Badge variant={c.ok ? "secondary" : "destructive"} className="mt-0.5">
                    {c.ok ? "OK" : "REVER"}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">{c.label}</p>
                    {c.detail && <p className="text-xs text-muted-foreground break-all">{c.detail}</p>}
                  </div>
                </li>
              ))}
              {seoChecklist.length === 0 && (
                <li className="text-muted-foreground">Sem checklist gerada ainda.</li>
              )}
            </ul>
          </Card>

          <h2 className="font-display text-xl font-bold mb-3">Schemas JSON-LD</h2>
          {schemas.length > 0 && (
            <Card className="p-4 mb-4">
              <p className="text-xs text-muted-foreground mb-2">Tipos detectados nesta página:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(
                  schemas.reduce<Record<string, { count: number; errors: number; warnings: number }>>((acc, s) => {
                    const t = s.type || "unknown";
                    acc[t] = acc[t] || { count: 0, errors: 0, warnings: 0 };
                    acc[t].count += 1;
                    acc[t].errors += s.errors.length;
                    acc[t].warnings += s.warnings.length;
                    return acc;
                  }, {}),
                ).map(([t, v]) => (
                  <Badge
                    key={t}
                    variant={v.errors ? "destructive" : v.warnings ? "outline" : "secondary"}
                    title={`${v.count} bloco(s), ${v.errors} erro(s), ${v.warnings} aviso(s)`}
                  >
                    {t} ×{v.count}
                    {v.errors > 0 && ` · ${v.errors}❌`}
                    {v.warnings > 0 && ` · ${v.warnings}⚠`}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
          <div className="space-y-4">
            {schemas.map((s, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge>{s.type}</Badge>
                  {s.errors.length === 0 ? (
                    <Badge variant="secondary">válido</Badge>
                  ) : (
                    <Badge variant="destructive">{s.errors.length} erro(s)</Badge>
                  )}
                  {s.warnings.length > 0 && <Badge variant="outline">{s.warnings.length} aviso(s)</Badge>}
                </div>
                {s.errors.length > 0 && (
                  <ul className="text-sm text-destructive list-disc pl-5 mb-2">
                    {s.errors.map((er, j) => <li key={j}>{er}</li>)}
                  </ul>
                )}
                {s.warnings.length > 0 && (
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mb-2">
                    {s.warnings.map((w, j) => <li key={j}>{w}</li>)}
                  </ul>
                )}
                <details>
                  <summary className="cursor-pointer text-xs text-muted-foreground">Ver JSON</summary>
                  <pre className="mt-2 text-xs bg-secondary/40 p-3 rounded-sm overflow-auto max-h-96">
{JSON.stringify(s.parsed, null, 2)}
                  </pre>
                </details>
              </Card>
            ))}
            {schemas.length === 0 && (
              <p className="text-muted-foreground text-sm">Nenhum schema encontrado nesta aba.</p>
            )}
          </div>

          <div className="mt-8 text-xs text-muted-foreground">
            Dica: também é possível validar externamente em
            {" "}
            <a className="underline" href="https://validator.schema.org/" target="_blank" rel="noopener noreferrer">validator.schema.org</a>
            {" "}e{" "}
            <a className="underline" href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer">Rich Results Test</a>.
          </div>
        </div>
      </section>
    </Layout>
  );
}
