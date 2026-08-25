import { createFileRoute } from "@tanstack/react-router";
import Obrigado from "@/pages/Obrigado";

export const Route = createFileRoute("/obrigado")({
  component: Obrigado,
});
