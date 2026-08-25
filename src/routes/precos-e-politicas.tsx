import { createFileRoute } from "@tanstack/react-router";
import PrecosEPoliticas from "@/pages/PrecosEPoliticas";

export const Route = createFileRoute("/precos-e-politicas")({
  component: PrecosEPoliticas,
});
