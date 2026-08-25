import { createFileRoute } from "@tanstack/react-router";
import ChecklistPublicacao from "@/pages/ChecklistPublicacao";

export const Route = createFileRoute("/checklist-publicacao")({
  component: ChecklistPublicacao,
});
