import { createFileRoute } from "@tanstack/react-router";
import PoliticaDeAnuncios from "@/pages/PoliticaDeAnuncios";

export const Route = createFileRoute("/politica-de-anuncios")({
  component: PoliticaDeAnuncios,
});
