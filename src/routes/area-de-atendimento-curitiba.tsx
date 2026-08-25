import { createFileRoute } from "@tanstack/react-router";
import AreaAtendimentoCuritiba from "@/pages/AreaAtendimentoCuritiba";

export const Route = createFileRoute("/area-de-atendimento-curitiba")({
  component: AreaAtendimentoCuritiba,
});
