import { createFileRoute } from "@tanstack/react-router";
import PoliticaDeCookies from "@/pages/PoliticaDeCookies";

export const Route = createFileRoute("/politica-de-cookies")({
  component: PoliticaDeCookies,
});
