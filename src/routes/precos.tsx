import { createFileRoute } from "@tanstack/react-router";
import Precos from "@/pages/Precos";

export const Route = createFileRoute("/precos")({
  component: Precos,
});
