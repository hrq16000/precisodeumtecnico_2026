import { createFileRoute } from "@tanstack/react-router";
import ServicoCidadeRegiao from "@/pages/ServicoCidadeRegiao";

export const Route = createFileRoute("/servicos/troca-de-tela-tv/$cidade")({
  component: () => <ServicoCidadeRegiao service="troca-de-tela-tv" />,
});
