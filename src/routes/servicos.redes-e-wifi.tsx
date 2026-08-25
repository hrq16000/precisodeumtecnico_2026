import { createFileRoute } from "@tanstack/react-router";
import GuiaEmpresarial from "@/pages/GuiaEmpresarial";

export const Route = createFileRoute("/servicos/redes-e-wifi")({
  component: () => <GuiaEmpresarial slug="redes-e-wifi" />,
});
