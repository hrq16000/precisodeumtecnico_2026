import { createFileRoute } from "@tanstack/react-router";
import ChecklistsReparo from "@/pages/ChecklistsReparo";

export const Route = createFileRoute("/checklists-de-reparo")({
  component: ChecklistsReparo,
});
