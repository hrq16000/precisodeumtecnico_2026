import { createFileRoute } from "@tanstack/react-router";
import KeywordServicePage from "@/pages/KeywordServicePage";

export const Route = createFileRoute("/suporte-tecnico-remoto")({
  component: () => <KeywordServicePage slug="suporte-tecnico-remoto" />,
});
