import { createFileRoute } from "@tanstack/react-router";
import GuiaEmpresarial from "@/pages/GuiaEmpresarial";

export const Route = createFileRoute("/guias/como-escolher-uma-workstation")({
  component: () => <GuiaEmpresarial slug="como-escolher-uma-workstation" />,
});
