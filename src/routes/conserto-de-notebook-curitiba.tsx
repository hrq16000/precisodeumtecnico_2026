import { createFileRoute } from "@tanstack/react-router";
import KeywordServicePage from "@/pages/KeywordServicePage";

export const Route = createFileRoute("/conserto-de-notebook-curitiba")({
  component: () => <KeywordServicePage slug="conserto-de-notebook-curitiba" />,
});
