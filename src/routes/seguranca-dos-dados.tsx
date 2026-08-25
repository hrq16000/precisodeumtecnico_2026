import { createFileRoute } from "@tanstack/react-router";
import GuiaEmpresarial from "@/pages/GuiaEmpresarial";

export const Route = createFileRoute("/seguranca-dos-dados")({
  component: () => <GuiaEmpresarial slug="seguranca-dos-dados" />,
});
