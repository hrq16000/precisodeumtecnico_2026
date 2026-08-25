import { Helmet } from "@/lib/helmet-compat";
import { Layout } from "@/components/layout/Layout";
import { COMPANY } from "@/data/companyInfo";
import { COMMERCIAL } from "@/data/pricingPolicy";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.legalName,
  url: COMPANY.website,
  foundingDate: COMPANY.foundingYear,
  areaServed: COMPANY.areaServed,
  sameAs: [COMPANY.facebook, COMPANY.instagram],
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: "https://precisodeumtecnico.com/" },
    { "@type": "ListItem", position: 2, name: "Dados da Empresa", item: "https://precisodeumtecnico.com/dados-da-empresa" },
  ],
};

export default function DadosEmpresa() {
  return (
    <Layout>
      <Helmet>
        <title>Dados da Empresa — Preciso de um Técnico</title>
        <meta name="description" content={`${COMPANY.experiencePhrase} · Área de atendimento: ${COMPANY.areaServed}.`} />
        <link rel="canonical" href="https://precisodeumtecnico.com/dados-da-empresa" />
        <meta property="og:title" content="Dados da Empresa — Preciso de um Técnico" />
        <meta property="og:url" content="https://precisodeumtecnico.com/dados-da-empresa" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      </Helmet>
      <section className="container-custom section-padding">
        <header className="mb-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">Dados da Empresa</h1>
          <p className="text-muted-foreground">Transparência institucional e informações públicas.</p>
        </header>

        <dl className="grid gap-5 max-w-2xl">
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Razão / Marca</dt>
            <dd className="font-semibold text-lg">{COMPANY.legalName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Experiência</dt>
            <dd>{COMPANY.experiencePhrase}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Área de atendimento</dt>
            <dd>{COMPANY.areaServed}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Horário de atendimento</dt>
            <dd>{COMPANY.serviceHours}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase text-muted-foreground">Redes</dt>
            <dd className="flex gap-4">
              <a href={COMPANY.facebook} target="_blank" rel="noopener noreferrer" className="underline">Facebook</a>
              <a href={COMPANY.instagram} target="_blank" rel="noopener noreferrer" className="underline">Instagram</a>
            </dd>
          </div>
        </dl>

        <aside className="mt-10 max-w-2xl rounded-xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          <p>{COMMERCIAL.partnersDisclaimer}</p>
        </aside>
      </section>
    </Layout>
  );
}
