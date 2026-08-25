import { createFileRoute } from "@tanstack/react-router";
import GuiaEmpresarial from "@/pages/GuiaEmpresarial";

export const Route = createFileRoute("/empresa-de-ti-curitiba")({
  component: () => <GuiaEmpresarial slug="empresa-de-ti-curitiba" />,
});
