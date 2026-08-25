import { createFileRoute } from "@tanstack/react-router";
import Servicos from "@/pages/Servicos";

export const Route = createFileRoute("/servicos/")({
  component: Servicos,
});
