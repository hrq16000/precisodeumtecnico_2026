import { PRICING } from "@/data/pricingPolicy";
/**
 * Schema.org Offer/Service JSON-LD para a oferta âncora R$ 99,99 (visita
 * técnica ou diagnóstico em bancada) e R$ 299,99 (coleta e entrega).
 * Use em páginas de cidade/bairro/serviço através de
 * <SEOHead structuredData={[..., buildOfferSchema(...)]} />.
 */
export interface OfferSchemaInput {
  serviceName: string;
  serviceSlug?: string;
  areaServed?: string | string[];
  url: string;
}

export function buildOfferSchema(input: OfferSchemaInput) {
  const areas = Array.isArray(input.areaServed)
    ? input.areaServed
    : input.areaServed
      ? [input.areaServed]
      : ["Curitiba"];

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.serviceName,
    provider: {
      "@type": "LocalBusiness",
      name: "Preciso de Um Técnico",
      url: "https://precisodeumtecnico.com",
    },
    areaServed: areas.map((a) => ({ "@type": "City", name: a })),
    url: input.url,
    offers: [
      {
        "@type": "Offer",
        name: PRICING.technicalVisit.label,
        url: `${input.url}#visita-99`,
        priceCurrency: "BRL",
        price: PRICING.technicalVisit.priceBRL.toFixed(2),
        availability: "https://schema.org/InStock",
        eligibleRegion: areas.map((a) => ({ "@type": "Place", name: a })),
      },
      {
        "@type": "Offer",
        name: "Diagnóstico em bancada (30 min)",
        url: `${input.url}#bancada-99`,
        priceCurrency: "BRL",
        price: "99.99",
        availability: "https://schema.org/InStock",
        eligibleRegion: areas.map((a) => ({ "@type": "Place", name: a })),
      },
      {
        "@type": "Offer",
        name: "Coleta e entrega personalizada (até 2h)",
        url: `${input.url}#coleta-299`,
        priceCurrency: "BRL",
        price: "299.99",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "299.99",
          priceCurrency: "BRL",
          minPrice: "299.99",
        },
        availability: "https://schema.org/InStock",
        eligibleRegion: areas.map((a) => ({ "@type": "Place", name: a })),
      },
    ],
  };
}
