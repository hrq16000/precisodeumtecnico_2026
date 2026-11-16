import { resolve, sep } from "node:path";
import worker from "../.output/server/index.mjs";

const publicDir = resolve(".output/public");
const portIndex = process.argv.indexOf("--port");
const port = portIndex < 0 ? 4173 : Number(process.argv[portIndex + 1]);

Bun.serve({
  hostname: "localhost",
  port,
  async fetch(request) {
    if (request.method === "GET" || request.method === "HEAD") {
      const pathname = decodeURIComponent(new URL(request.url).pathname);
      const path = resolve(publicDir, "." + pathname);
      if (path.startsWith(publicDir + sep)) {
        const file = Bun.file(path);
        if (await file.exists()) {
          return request.method === "HEAD"
            ? new Response(null, { headers: { "Content-Type": file.type } })
            : new Response(file);
        }
      }
    }
    return worker.fetch(request, {}, { waitUntil() {} });
  },
});
