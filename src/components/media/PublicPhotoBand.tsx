import { Helmet } from "@/lib/helmet-compat";
import { ImageIcon } from "lucide-react";
import { PublicPhotoFigure } from "@/components/media/PublicPhotoFigure";
import type { PublicPhoto } from "@/data/publicPhotos";


const ORIGIN = "https://precisodeumtecnico.com";

interface Props {
  title: string;
  intro?: string;
  photos: PublicPhoto[];
  /** A primeira imagem carrega eager (usar só quando a faixa está acima da dobra). */
  eagerFirst?: boolean;
}

/**
 * Faixa de fotos reais (domínio público / Creative Commons do Wikimedia Commons).
 *
 * Regras de honestidade (mesma política das galerias): nenhuma foto é
 * apresentada como registro de atendimento próprio — cada uma exibe autoria,
 * licença e link para a fonte, como exigem CC BY e CC BY-SA.
 */
export function PublicPhotoBand({ title, intro, photos, eagerFirst = false }: Props) {
  if (photos.length === 0) return null;

  // ImageObject por foto: relaciona cada arquivo servido ao autor, licença e
  // página de origem — o buscador nunca precisa inferir o crédito.
  const imageSchema = photos.map((photo) => {
    const largest = photo.variants[photo.variants.length - 1] ?? 800;
    return {
      "@context": "https://schema.org",
      "@type": "ImageObject",
      contentUrl: `${ORIGIN}/photos/${photo.slug}-${largest}.jpg`,
      url: `${ORIGIN}/photos/${photo.slug}-${largest}.jpg`,
      caption: photo.caption,
      description: photo.alt,
      width: photo.width,
      height: photo.height,
      creator: { "@type": "Person", name: photo.author },
      creditText: `${photo.author} — ${photo.license} (Wikimedia Commons)`,
      copyrightNotice: `${photo.author} · ${photo.license}`,
      license: photo.licenseUrl || photo.source,
      acquireLicensePage: photo.source,
    };
  });

  return (
    <section className="py-12 md:py-16 border-t border-border" aria-labelledby="fotos-heading">
      <Helmet>
        {imageSchema.map((schema) => (
          <script key={schema.contentUrl} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ImageIcon className="w-4 h-4" aria-hidden="true" /> Referências visuais
        </div>
        <h2 id="fotos-heading" className="mt-2 text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {intro ? <p className="mt-3 text-muted-foreground max-w-2xl">{intro}</p> : null}

        <ul
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="public-photo-band"
          style={{ contentVisibility: "auto", containIntrinsicSize: "480px" }}
        >
          {photos.map((photo, i) => (
            <li key={photo.slug} className="rounded-lg overflow-hidden border border-border bg-card">
              <figure>
                <PublicPhotoFigure
                  photo={photo}
                  eager={eagerFirst && i === 0}
                  sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 92vw"
                  className="w-full h-48 object-cover bg-muted"
                />

                <figcaption className="p-3 text-xs text-muted-foreground">
                  <span className="block text-sm text-foreground font-medium">{photo.caption}</span>
                  <span className="block mt-1">
                    Foto de terceiros, usada como referência visual do tema — não é registro
                    de atendimento nosso.
                  </span>
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
                    {" · "}
                    <a
                      href={photo.source}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="underline hover:text-primary"
                    >
                      Wikimedia Commons
                    </a>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
