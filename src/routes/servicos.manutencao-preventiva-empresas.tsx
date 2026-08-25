import { createFileRoute } from "@tanstack/react-router";
import GuiaEmpresarial from "@/pages/GuiaEmpresarial";

export const Route = createFileRoute("/servicos/manutencao-preventiva-empresas")({
  component: () => <GuiaEmpresarial slug="manutencao-preventiva-empresas" />,
});
