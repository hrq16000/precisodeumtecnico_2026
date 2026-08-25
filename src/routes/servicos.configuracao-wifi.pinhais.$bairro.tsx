import { createFileRoute } from "@tanstack/react-router";
import ServicoBairroCidadeRegiao from "@/pages/ServicoBairroCidadeRegiao";

export const Route = createFileRoute("/servicos/configuracao-wifi/pinhais/$bairro")({
  component: () => <ServicoBairroCidadeRegiao cidade="pinhais" service="configuracao-wifi" />,
});
