import { createFileRoute } from "@tanstack/react-router";
import KeywordServicePage from "@/pages/KeywordServicePage";

export const Route = createFileRoute("/remocao-de-virus-curitiba")({
  component: () => <KeywordServicePage slug="remocao-de-virus-curitiba" />,
});
