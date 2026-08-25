import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/publicidade")({
  beforeLoad: () => {
    throw redirect({ href: "/anuncie", statusCode: 301 });
  },
});
