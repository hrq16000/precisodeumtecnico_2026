import { createFileRoute } from "@tanstack/react-router";
import AssistenciaTecnicaCuritiba from "@/pages/AssistenciaTecnicaCuritiba";

export const Route = createFileRoute("/assistencia-tecnica-curitiba")({
  component: AssistenciaTecnicaCuritiba,
});
