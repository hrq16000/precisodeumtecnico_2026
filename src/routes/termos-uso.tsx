import { createFileRoute } from "@tanstack/react-router";
import TermosDeUso from "@/pages/TermosDeUso";

export const Route = createFileRoute("/termos-uso")({
  component: TermosDeUso,
});
