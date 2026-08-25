import { createFileRoute } from "@tanstack/react-router";
import ComoEscolherTecnico from "@/pages/ComoEscolherTecnico";

export const Route = createFileRoute("/como-escolher-tecnico-preco-prazo")({
  component: ComoEscolherTecnico,
});
