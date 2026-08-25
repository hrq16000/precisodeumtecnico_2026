import { createFileRoute } from "@tanstack/react-router";
import GuiaEmpresarial from "@/pages/GuiaEmpresarial";

export const Route = createFileRoute("/guias/organizacao-de-ti-para-pequenos-escritorios")({
  component: () => <GuiaEmpresarial slug="organizacao-de-ti-para-pequenos-escritorios" />,
});
