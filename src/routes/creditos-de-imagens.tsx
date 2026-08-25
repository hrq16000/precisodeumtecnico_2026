import { createFileRoute } from "@tanstack/react-router";
import CreditosDeImagens from "@/pages/CreditosDeImagens";

export const Route = createFileRoute("/creditos-de-imagens")({
  component: CreditosDeImagens,
});
