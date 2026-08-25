import { createFileRoute } from "@tanstack/react-router";
import KeywordServicePage from "@/pages/KeywordServicePage";

export const Route = createFileRoute("/formatacao-de-computador-curitiba")({
  component: () => <KeywordServicePage slug="formatacao-de-computador-curitiba" />,
});
