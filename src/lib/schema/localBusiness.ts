/**
 * Fonte única do schema LocalBusiness (NAP + área atendida + horários).
 * Usado na home e nas páginas de atendimento (cidade/bairro) para reforçar
 * autoridade local e facilitar a captação por buscadores e IAs.
 *
 * Regras:
 *  - Nunca publicar aggregateRating/reviewCount fabricados (Rodada 23).
 *  - Telefone não é publicado (política do portal: contato só via triagem).
 */
import { COMPANY } from "@/data/companyInfo";

export interface LocalBusinessOptions {
  /** Cidade principal da página (ex.: "São Paulo"). Default: Curitiba. */
  city?: string;
  /** UF da cidade principal (ex.: "SP"). Default: PR. */
  state?: string;
  /** Bairro, quando a página é de bairro. */
  neighborhood?: string;
  /** URL canônica da página. */
  url?: string;
  /** Lista extra de cidades atendidas. */
  extraAreas?: string[];
  /** Descrição específica da página. */
  description?: string;
}

const DEFAULT_AREAS = [
  "Curitiba",
  "São José dos Pinhais",
  "Pinhais",
  "Colombo",
  "Araucária",
];

export const OPENING_HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:00",
    closes: "22:00",
    description: "Atendimento comercial 08h–22h · WhatsApp com triagem 24h",
  },
];

export function buildLocalBusinessSchema(opts: LocalBusinessOptions = {}): object {
  const city = opts.city ?? "Curitiba";
  const state = opts.state ?? "PR";
  const url = opts.url ?? COMPANY.website;

  const areaServed = [
    ...(opts.neighborhood
      ? [{ "@type": "Place", name: `${opts.neighborhood}, ${city} - ${state}` }]
      : []),
    { "@type": "City", name: city, containedInPlace: { "@type": "State", name: state, addressCountry: "BR" } },
    ...[...DEFAULT_AREAS, ...(opts.extraAreas ?? [])]
      .filter((n) => n !== city)
      .map((name) => ({ "@type": "City", name })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness`,
    name: COMPANY.brand,
    legalName: COMPANY.legalName,
    description:
      opts.description ??
      `Assistência técnica com ${COMPANY.experiencePhrase.toLowerCase()} em informática, notebooks, TVs, redes/Wi-Fi, CFTV, elétrica e ar-condicionado. Atendimento em ${city} e região, com triagem técnica antes do orçamento.`,
    url,
    foundingDate: COMPANY.foundingYear,
    slogan: "Triagem técnica antes do orçamento. Sem surpresa no preço.",
    knowsLanguage: ["pt-BR"],
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state,
      addressCountry: "BR",
    },
    geo:
      city === "Curitiba"
        ? { "@type": "GeoCoordinates", latitude: "-25.4284", longitude: "-49.2733" }
        : undefined,
    openingHoursSpecification: OPENING_HOURS,
    areaServed,
    currenciesAccepted: "BRL",
    priceRange: "$$",
    sameAs: [COMPANY.facebook, COMPANY.instagram],
  };
}
