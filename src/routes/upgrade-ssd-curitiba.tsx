import { createFileRoute } from "@tanstack/react-router";
import KeywordServicePage from "@/pages/KeywordServicePage";

export const Route = createFileRoute("/upgrade-ssd-curitiba")({
  component: () => <KeywordServicePage slug="upgrade-ssd-curitiba" />,
});
