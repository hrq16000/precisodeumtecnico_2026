import { createFileRoute } from "@tanstack/react-router";
import KeywordServicePage from "@/pages/KeywordServicePage";

export const Route = createFileRoute("/upgrade-memoria-ram-curitiba")({
  component: () => <KeywordServicePage slug="upgrade-memoria-ram-curitiba" />,
});
