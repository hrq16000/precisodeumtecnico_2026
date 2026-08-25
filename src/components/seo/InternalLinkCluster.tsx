/**
 * Cluster de links internos (Rodada 28).
 * Cria automaticamente o triângulo SEMÂNTICO sintoma → serviço → bairro/cidade,
 * aumentando profundidade de rastreio e relevância local sem duplicar conteúdo.
 *
 * Regras:
 *  - Só emite rotas que existem no App (sem links quebrados).
 *  - Âncoras descritivas e localizadas (bom para busca e para IAs).
 */
import { Link } from "@/lib/router-compat";
import { SYMPTOMS } from "@/data/symptoms";
import { getBairrosForCity } from "@/data/nationalBairros";
import { SOLUTION_GUIDES, guidePath, SOLUTIONS_HUB_PATH } from "@/data/solutionGuides";

const CATEGORY_TO_SERVICE: Record<string, string> = {
  tv: "tvs",
  celular: "celulares",
  console: "games",
  notebook: "notebooks",
  pc: "informatica",
  som: "informatica",
};

const CORE_SERVICES: { slug: string; name: string }[] = [
  { slug: "informatica", name: "Informática" },
  { slug: "notebooks", name: "Notebooks" },
  { slug: "tvs", name: "TVs" },
  { slug: "redes", name: "Redes e Wi-Fi" },
  { slug: "cftv", name: "CFTV" },
  { slug: "eletrica", name: "Elétrica" },
  { slug: "ar-condicionado", name: "Ar-condicionado" },
  { slug: "celulares", name: "Celulares" },
];

interface Props {
  /** Nome da cidade exibido nas âncoras. */
  city: string;
  /** Slug da cidade (usado nos links nacionais). */
  citySlug?: string;
  /** Nome do bairro atual, quando houver. */
  neighborhood?: string;
  /** Slug do bairro atual, para excluí-lo da lista de relacionados. */
  neighborhoodSlug?: string;
  /** Quantidade de sintomas listados. */
  symptomLimit?: number;
}

export function InternalLinkCluster({
  city,
  citySlug,
  neighborhood,
  neighborhoodSlug,
  symptomLimit = 6,
}: Props) {
  const where = neighborhood ? `${neighborhood}, ${city}` : city;

  const symptoms = SYMPTOMS.slice(0, symptomLimit).map((s) => ({
    label: `${s.label} em ${where}`,
    to: `/servicos/${CATEGORY_TO_SERVICE[s.category] ?? "informatica"}`,
    key: s.slug,
  }));

  const bairros = citySlug
    ? getBairrosForCity(citySlug)
        .filter((b) => b.slug !== neighborhoodSlug)
        .slice(0, 10)
    : [];

  return (
    <section className="section-padding bg-muted/30" aria-labelledby="cluster-links-title">
      <div className="container-custom">
        <h2 id="cluster-links-title" className="text-2xl md:text-3xl font-display font-bold mb-2">
          Problemas, serviços e regiões relacionados em {where}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          Navegue pelos conteúdos técnicos ligados a {where}. Cada página traz sintomas,
          modalidade de atendimento (bancada, visita ou coleta) e as condições de orçamento.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-semibold mb-3">Sintomas mais buscados</h3>
            <ul className="space-y-2 text-sm">
              {symptoms.map((s) => (
                <li key={s.key}>
                  <Link to={s.to} className="text-primary hover:underline">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Serviços técnicos</h3>
            <ul className="space-y-2 text-sm">
              {CORE_SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link to={`/servicos/${s.slug}`} className="text-primary hover:underline">
                    {s.name} em {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">
              {bairros.length > 0 ? `Bairros atendidos em ${city}` : "Cobertura"}
            </h3>
            <ul className="space-y-2 text-sm">
              {bairros.map((b) => (
                <li key={b.slug}>
                  <Link
                    to={`/atendimento-nacional/${citySlug}/${b.slug}`}
                    className="text-primary hover:underline"
                  >
                    Técnico em {b.name}, {city}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/atendimento-nacional" className="text-primary hover:underline">
                  Todas as cidades atendidas
                </Link>
              </li>
              <li>
                <Link to="/assistencia-tecnica-curitiba" className="text-primary hover:underline">
                  Assistência técnica em Curitiba
                </Link>
              </li>
              <li>
                <Link to="/gestor-responsavel" className="text-primary hover:underline">
                  Quem é o gestor técnico responsável
                </Link>
              </li>
              <li>
                <Link to={SOLUTIONS_HUB_PATH} className="text-primary hover:underline">
                  Central de soluções por equipamento
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-3">Guias de solução para o mesmo problema</h3>
          <ul className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTION_GUIDES.slice(0, 6).map((g) => (
              <li key={g.slug}>
                <Link to={guidePath(g.slug)} className="text-primary hover:underline">
                  {g.h1}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
