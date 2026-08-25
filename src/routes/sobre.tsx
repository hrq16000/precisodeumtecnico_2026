import { createFileRoute } from "@tanstack/react-router";
import Sobre from "@/pages/Sobre";

export const Route = createFileRoute("/sobre")({
  component: Sobre,
});
