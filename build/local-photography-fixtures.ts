import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

/** Optional public-only QA fixtures. Never included in a production build. */
export function localPhotographyFixtures(): Plugin {
  return {
    name: "local-photography-fixtures",
    apply: "serve",
    async configureServer(server) {
      let manifest: Record<string, string>;
      try {
        manifest = JSON.parse(await readFile(resolve(server.config.root, "public/qa-media/index.json"), "utf8"));
      } catch { return; }
      server.middlewares.use(async (request, response, next) => {
        const match = request.url?.match(/^\/media\/([^/]+)\/(?:sheet|thumb|card|gallery|hero|display|og)(?:\?|$)/);
        const asset = match && manifest[match[1]];
        if (!asset || !/^\/(?:photos|qa-media)\/[a-zA-Z0-9-]+\.jpg$/.test(asset)) return next();
        try {
          const bytes = await readFile(resolve(server.config.root, `public${asset}`));
          response.setHeader("Content-Type", "image/jpeg");
          response.setHeader("Cache-Control", "no-store");
          response.end(bytes);
        } catch { next(); }
      });
    },
  };
}
