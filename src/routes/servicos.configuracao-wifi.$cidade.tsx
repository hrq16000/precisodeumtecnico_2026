import { createFileRoute } from "@tanstack/react-router";
import ServicoCidadeRegiao from "@/pages/ServicoCidadeRegiao";

export const Route = createFileRoute("/servicos/configuracao-wifi/$cidade")({
  component: () => <ServicoCidadeRegiao service="configuracao-wifi" />,
});
