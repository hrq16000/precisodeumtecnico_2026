import { createFileRoute } from "@tanstack/react-router";
import AssistenciaTecnica from "@/pages/AssistenciaTecnica";

export const Route = createFileRoute("/assistencia-tecnica")({
  component: AssistenciaTecnica,
});
