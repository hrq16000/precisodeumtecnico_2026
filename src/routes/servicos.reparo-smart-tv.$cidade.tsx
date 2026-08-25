import { createFileRoute } from "@tanstack/react-router";
import ServicoCidadeRegiao from "@/pages/ServicoCidadeRegiao";

export const Route = createFileRoute("/servicos/reparo-smart-tv/$cidade")({
  component: () => <ServicoCidadeRegiao service="reparo-smart-tv" />,
});
