import { createFileRoute } from "@tanstack/react-router";
import MensagensProntas from "@/pages/MensagensProntas";

export const Route = createFileRoute("/operacao/mensagens-prontas")({
  component: MensagensProntas,
});
