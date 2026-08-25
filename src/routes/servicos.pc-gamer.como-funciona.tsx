import { createFileRoute } from "@tanstack/react-router";
import ComoFuncionaPcGamer from "@/pages/ComoFuncionaPcGamer";

export const Route = createFileRoute("/servicos/pc-gamer/como-funciona")({
  component: ComoFuncionaPcGamer,
});
