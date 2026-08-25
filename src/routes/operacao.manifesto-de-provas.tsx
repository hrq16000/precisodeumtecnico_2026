import { createFileRoute } from "@tanstack/react-router";
import ManifestoDeProvas from "@/pages/ManifestoDeProvas";

export const Route = createFileRoute("/operacao/manifesto-de-provas")({
  component: ManifestoDeProvas,
});
