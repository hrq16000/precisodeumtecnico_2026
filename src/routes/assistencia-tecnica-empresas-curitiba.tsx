import { createFileRoute } from "@tanstack/react-router";
import KeywordServicePage from "@/pages/KeywordServicePage";

export const Route = createFileRoute("/assistencia-tecnica-empresas-curitiba")({
  component: () => <KeywordServicePage slug="assistencia-tecnica-empresas-curitiba" />,
});
