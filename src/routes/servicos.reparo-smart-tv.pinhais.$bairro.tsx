import { createFileRoute } from "@tanstack/react-router";
import ServicoBairroCidadeRegiao from "@/pages/ServicoBairroCidadeRegiao";

export const Route = createFileRoute("/servicos/reparo-smart-tv/pinhais/$bairro")({
  component: () => <ServicoBairroCidadeRegiao cidade="pinhais" service="reparo-smart-tv" />,
});
