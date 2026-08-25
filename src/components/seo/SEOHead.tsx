import { Helmet } from "@/lib/helmet-compat";
import { resolveOgImage } from "@/lib/seo/ogImage";

/**
 * Validate and stringify a structured-data object. Catches the most common
 * mistakes (missing @context/@type, FAQPage without mainEntity, BreadcrumbList
 * without itemListElement) and warns in development. Always returns a JSON
 * string in production so a misformed entry never breaks SSR/CSR rendering.
 */
function safeStringify(schema: unknown, idx: number): string | null {
  try {
    const obj = schema as Record<string, unknown>;
    if (import.meta.env.DEV && obj && typeof obj === "object") {
      if (!obj["@context"]) console.warn(`[SEO] schema[${idx}] missing @context`);
      if (!obj["@type"]) console.warn(`[SEO] schema[${idx}] missing @type`);
      if (obj["@type"] === "FAQPage" && !obj.mainEntity)
        console.warn(`[SEO] FAQPage schema[${idx}] missing mainEntity`);
      if (obj["@type"] === "BreadcrumbList" && !obj.itemListElement)
        console.warn(`[SEO] BreadcrumbList schema[${idx}] missing itemListElement`);
      if (obj["@type"] === "Article" && !obj.headline)
        console.warn(`[SEO] Article schema[${idx}] missing headline`);
    }
    return JSON.stringify(schema);
  } catch (e) {
    if (import.meta.env.DEV) console.error(`[SEO] failed to stringify schema[${idx}]`, e);
    return null;
  }
}

/**
 * Imagem social: fonte ÚNICA por rota, resolvida em src/lib/seo/ogImage.ts a
 * partir do canonical (cidade → arte da cidade, cluster temático → arte do
 * cluster, senão default). index.html NÃO emite og:image/twitter:image — o
 * gate scripts/check-seo-dedup.ts falha o build se as duas fontes coexistirem.
 */
export { DEFAULT_OG_IMAGE } from "@/lib/seo/ogImage";


function absoluteUrl(u: string): string {
  if (/^https?:\/\//i.test(u)) return u;
  return `https://precisodeumtecnico.com${u.startsWith("/") ? "" : "/"}${u}`;
}

/** Limites práticos de SERP (Google trunca acima disso). */
const TITLE_MAX = 65;
const DESC_MAX = 160;

/** Corta na última palavra inteira antes do limite, sem cortar no meio. */
function clampAtWord(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max - 1);
  const cut = slice.lastIndexOf(" ");
  return `${(cut > max * 0.6 ? slice.slice(0, cut) : slice).replace(/[\s,;:·—-]+$/, "")}…`;
}

export function clampTitle(title: string): string {
  return clampAtWord(title, TITLE_MAX);
}

/** Prefere terminar em fim de frase; se não houver, corta na palavra. */
export function clampDescription(description: string): string {
  const clean = description.replace(/\s+/g, " ").trim();
  if (clean.length <= DESC_MAX) return clean;
  const head = clean.slice(0, DESC_MAX);
  const stop = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
  if (stop > DESC_MAX * 0.6) return head.slice(0, stop + 1).trim();
  return clampAtWord(clean, DESC_MAX);
}

interface Breadcrumb { name: string; url: string; }
interface ServiceInfo {
  name: string;
  description?: string;
  priceMinBRL?: number;
  areaServed?: string;
}
interface FAQItem { question: string; answer: string; }
/** Imagem real (Wikimedia Commons) com crédito/licença — vira ImageObject. */
export interface SEOImageCredit {
  contentUrl: string;
  caption: string;
  license: string;
  licenseUrl?: string;
  author: string;
  source: string;
  width?: number;
  height?: number;
}

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: "website" | "article" | "service";
  schema?: object;
  /** Optional list of additional structured-data objects (FAQ, Breadcrumb, etc.) */
  structuredData?: object[];
  keywords?: string;
  /** Breadcrumbs; emitem BreadcrumbList schema. */
  breadcrumbs?: Breadcrumb[];
  /** Se presente, emite Service schema (páginas de serviço). */
  service?: ServiceInfo;
  /** Se presente, emite FAQPage schema. Deve corresponder às FAQs visíveis. */
  faq?: FAQItem[];
  /** Fotos reais exibidas na página; emitem ImageObject com crédito/licença. */
  images?: SEOImageCredit[];
  /** Article publication metadata for blog posts */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  /** Se true, emite `<meta name="robots" content="noindex, nofollow">`. */
  noindex?: boolean;
}


export function SEOHead({
  title,
  description,
  canonical = "https://precisodeumtecnico.com",
  ogImage,
  type = "website",
  schema,
  structuredData,
  keywords,
  breadcrumbs,
  service,
  faq,
  images,
  article,
  noindex = false,
}: SEOHeadProps) {

  // Limites de SERP: título ≤ 65 e descrição ≤ 160 caracteres. As páginas
  // programáticas (serviço × cidade × bairro) geram textos longos; aqui o
  // corte é feito na fronteira de palavra/frase, preservando a unicidade —
  // o gate scripts/check-meta-uniqueness.ts falha o build se algo escapar.
  const withBrand =
    title.includes("Preciso de Um Técnico") ? title : `${title} | Preciso de Um Técnico`;
  const fullTitle = withBrand.length <= TITLE_MAX ? withBrand : clampTitle(title);
  const metaDescription = clampDescription(description);
  const socialImage = resolveOgImage(canonical, ogImage);


  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Preciso de Um Técnico",
    description:
      "Assistência técnica especializada em Curitiba e Região Metropolitana. Informática, elétrica, CFTV, notebooks, ar-condicionado e muito mais.",
    url: "https://precisodeumtecnico.com",
    foundingDate: "1998",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Curitiba",
      addressRegion: "PR",
      addressCountry: "BR",
    },
    geo: { "@type": "GeoCoordinates", latitude: "-25.4284", longitude: "-49.2733" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Curitiba" },
      { "@type": "City", name: "São José dos Pinhais" },
      { "@type": "City", name: "Pinhais" },
      { "@type": "City", name: "Colombo" },
      { "@type": "City", name: "Araucária" },
    ],
    priceRange: "$$",
  };

  const extra: object[] = [];
  if (breadcrumbs && breadcrumbs.length > 0) {
    extra.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      })),
    });
  }
  if (service) {
    extra.push({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.name,
      description: service.description,
      areaServed: service.areaServed ?? "Curitiba e Região Metropolitana",
      provider: { "@type": "LocalBusiness", name: "Preciso de Um Técnico" },
      ...(service.priceMinBRL
        ? {
            offers: {
              "@type": "Offer",
              price: service.priceMinBRL,
              priceCurrency: "BRL",
              availability: "https://schema.org/InStock",
            },
          }
        : {}),
    });
  }
  if (faq && faq.length > 0) {
    extra.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  if (images && images.length > 0) {
    for (const img of images) {
      extra.push({
        "@context": "https://schema.org",
        "@type": "ImageObject",
        contentUrl: absoluteUrl(img.contentUrl),
        url: absoluteUrl(img.contentUrl),
        caption: img.caption,
        description: img.caption,
        creator: { "@type": "Person", name: img.author },
        creditText: `${img.author} — ${img.license} (Wikimedia Commons)`,
        copyrightNotice: `${img.author} · ${img.license}`,
        license: img.licenseUrl || img.source,
        acquireLicensePage: img.source,
        isPartOf: { "@id": `${canonical}#webpage` },
        ...(img.width ? { width: img.width } : {}),
        ...(img.height ? { height: img.height } : {}),
      });
    }
  }

  const baseSchemas = structuredData ?? (schema ? [schema] : [localBusinessSchema]);
  const merged = [...baseSchemas, ...extra];

  // WebPage canônico da rota (uma única vez, se ainda não fornecido pelo caller).
  const hasWebPage = merged.some((s) => {
    const t = (s as Record<string, unknown>)?.["@type"];
    return t === "WebPage" || (Array.isArray(t) && t.includes("WebPage"));
  });
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: fullTitle,
    description: metaDescription,
    inLanguage: "pt-BR",
    isPartOf: {
      "@type": "WebSite",
      name: "Preciso de Um Técnico",
      url: "https://precisodeumtecnico.com",
    },
    ...(breadcrumbs && breadcrumbs.length > 0
      ? { breadcrumb: { "@type": "BreadcrumbList", name: fullTitle } }
      : {}),
  };

  const schemas = hasWebPage ? merged : [...merged, webPageSchema];


  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      {/* og:image / twitter:image por rota (fonte única — ver lib/seo/ogImage). */}
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Preciso de Um Técnico" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      <meta name="twitter:image:alt" content={fullTitle} />



      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} />}
      {article?.author && <meta property="article:author" content={article.author} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article?.tags?.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}

      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      <meta name="author" content="Preciso de Um Técnico" />
      <meta name="geo.region" content="BR-PR" />
      <meta name="geo.placename" content="Curitiba" />

      {schemas.map((s, i) => {
        const json = safeStringify(s, i);
        if (!json) return null;
        return (
          <script key={i} type="application/ld+json">
            {json}
          </script>
        );
      })}
    </Helmet>
  );
}
