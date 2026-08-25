import { useLocation } from "@/lib/router-compat";
import { PublicPhotoBand } from "./PublicPhotoBand";
import { CITY_PHOTO_BY_SLUG, pickLocalityPhotos } from "@/data/publicPhotos";

interface Props {
  title: string;
  intro?: string;
  count?: number;
}

/**
 * Faixa de fotos reais para páginas de localidade que não expõem slugs no escopo
 * do componente: o seed é o próprio pathname (determinístico e único por rota),
 * e a cidade é inferida quando o path contém um slug com foto real no acervo.
 */
export function LocalityPhotoBand({ title, intro, count = 3 }: Props) {
  const { pathname } = useLocation();
  const citySlug =
    Object.keys(CITY_PHOTO_BY_SLUG).find((slug) => pathname.includes(slug)) ?? "curitiba";

  return (
    <PublicPhotoBand
      title={title}
      intro={intro}
      photos={pickLocalityPhotos(citySlug, pathname, count)}
    />
  );
}
