import { createFileRoute } from "@tanstack/react-router";
import ServicoBairroCidadeRegiao from "@/pages/ServicoBairroCidadeRegiao";

export const Route = createFileRoute("/servicos/troca-de-tela-tv/pinhais/$bairro")({
  component: () => <ServicoBairroCidadeRegiao cidade="pinhais" service="troca-de-tela-tv" />,
});
