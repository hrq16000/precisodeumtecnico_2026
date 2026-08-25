import { createFileRoute } from "@tanstack/react-router";
import GuiaEmpresarial from "@/pages/GuiaEmpresarial";

export const Route = createFileRoute("/servicos/suporte-tecnico-empresarial")({
  component: () => <GuiaEmpresarial slug="suporte-tecnico-empresarial" />,
});
