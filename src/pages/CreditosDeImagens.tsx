import { Link } from "@/lib/router-compat";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { PublicPhotoFigure } from "@/components/media/PublicPhotoFigure";
import { PUBLIC_PHOTOS } from "@/data/publicPhotos";
import { ImageIcon, ArrowRight } from "lucide-react";

const CANONICAL = "https://precisodeumtecnico.com/creditos-de-imagens";

const photos = Object.values(PUBLIC_PHOTOS).sort((a, b) =>
  a.caption.localeCompare(b.caption, "pt-BR"),
);

const CreditosDeImagens = () => (
  <Layout>
    <SEOHead
      title="Créditos de imagens | Preciso de um Técnico"
      description="Lista completa das fotos de referência usadas no site, com autor, licença Creative Commons ou domínio público e link para a fonte original no Wikimedia Commons."
      canonical={CANONICAL}
      breadcrumbs={[
        { name: "Início", url: "https://precisodeumtecnico.com/" },
        { name: "Créditos de imagens", url: CANONICAL },
      ]}
    />

    <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-14 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-5">
          <ImageIcon className="h-4 w-4" aria-hidden="true" />
          Transparência de mídia
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">Créditos de imagens</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          As fotos usadas nas páginas deste site são imagens de terceiros, em domínio público ou
          sob licença Creative Commons, exibidas apenas como referência visual do tema. Nenhuma
          delas é registro de atendimento realizado por nós.
        </p>
      </div>
    </section>

    <div className="container mx-auto px-4 max-w-5xl py-12 md:py-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {photos.length} imagens catalogadas
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <li key={photo.slug} className="rounded-lg overflow-hidden border border-border bg-card">
            <figure>
              <PublicPhotoFigure
                photo={photo}
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 92vw"
                className="w-full h-44 object-cover bg-muted"
              />
              <figcaption className="p-3 text-xs text-muted-foreground">
                <span className="block text-sm text-foreground font-medium">{photo.caption}</span>
                <span className="block mt-1">
                  {photo.author ? `${photo.author} · ` : ""}
                  {photo.licenseUrl ? (
                    <a
                      href={photo.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="underline hover:text-primary"
                    >
                      {photo.license}
                    </a>
                  ) : (
                    photo.license
                  )}
                </span>
                <a
                  href={photo.source}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="mt-1 inline-block underline hover:text-primary"
                >
                  Ver arquivo original
                </a>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-muted-foreground">
        Encontrou uma atribuição incorreta?{" "}
        <Link to="/contato" className="text-primary hover:underline inline-flex items-center gap-1">
          Fale com a gente <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </p>
    </div>
  </Layout>
);

export default CreditosDeImagens;
