import { createFileRoute } from "@tanstack/react-router";
import ServicoBairroCidadeRegiao from "@/pages/ServicoBairroCidadeRegiao";

export const Route = createFileRoute("/servicos/reparo-smart-tv/sao-jose-dos-pinhais/$bairro")({
  component: () => <ServicoBairroCidadeRegiao cidade="sao-jose-dos-pinhais" service="reparo-smart-tv" />,
});
