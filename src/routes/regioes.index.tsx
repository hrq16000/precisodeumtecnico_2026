import { createFileRoute } from "@tanstack/react-router";
import Regioes from "@/pages/Regioes";

export const Route = createFileRoute("/regioes/")({
  component: Regioes,
});
