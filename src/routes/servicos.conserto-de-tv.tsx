import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/servicos/conserto-de-tv")({
  beforeLoad: () => {
    throw redirect({ href: "/servicos/tvs", statusCode: 301 });
  },
});
