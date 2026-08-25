/**
 * Organization + Person (gestor responsável) — schemas consistentes em todo o site.
 * Ambos usam @id estáveis para que buscadores e IAs consolidem a entidade.
 */
import { COMPANY } from "@/data/companyInfo";
import { MANAGER, MANAGER_URL } from "@/data/manager";

export const ORG_ID = `${COMPANY.website}#organization`;
export const PERSON_ID = `${MANAGER_URL}#person`;

export function buildPersonSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: MANAGER.name,
    jobTitle: MANAGER.jobTitle,
    description: MANAGER.shortBio,
    url: MANAGER_URL,
    knowsAbout: [...MANAGER.expertise],
    knowsLanguage: ["pt-BR"],
    hasCredential: MANAGER.credentials.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.name,
      credentialCategory: "certification",
      recognizedBy: { "@type": "Organization", name: c.issuer },
    })),
    areaServed: MANAGER.areaOfService.map((name) => ({ "@type": "City", name })),
    worksFor: { "@id": ORG_ID },
  };
}

export function buildOrganizationSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: COMPANY.brand,
    legalName: COMPANY.legalName,
    url: COMPANY.website,
    email: COMPANY.email,
    foundingDate: COMPANY.foundingYear,
    description: `${COMPANY.brand} — assistência técnica com ${COMPANY.experiencePhrase.toLowerCase()}, atuando desde ${COMPANY.foundingYear} em ${COMPANY.areaServed}.`,
    areaServed: COMPANY.areaServed,
    knowsLanguage: ["pt-BR"],
    sameAs: [COMPANY.facebook, COMPANY.instagram],
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
  };
}
