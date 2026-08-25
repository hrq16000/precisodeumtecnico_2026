import { createFileRoute } from "@tanstack/react-router";
import GuiaEmpresarial from "@/pages/GuiaEmpresarial";

export const Route = createFileRoute("/servicos/backup-para-empresas")({
  component: () => <GuiaEmpresarial slug="backup-para-empresas" />,
});
