import { handleAdminApi } from "./api/admin";
import { handleAdminAuth } from "./api/admin-auth";
import { handlePublicApi } from "./api/public";
import { serveMedia } from "./media/serve";
import { AppError } from "./utils/errors";
import { apiError } from "./utils/response";

/**
 * API-only entrypoint for the Workers Vitest pool.
 *
 * The production entrypoint also imports vinext virtual modules generated at
 * build time. Keeping those out of the isolated Worker tests lets the real API
 * handlers run against Miniflare's D1 and R2 implementations.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestId = request.headers.get("cf-ray") ?? crypto.randomUUID();
    const url = new URL(request.url);

    try {
      const publicResponse = await handlePublicApi(request, url, env);
      if (publicResponse) return publicResponse;

      const adminAuthResponse = await handleAdminAuth(request, url, env);
      if (adminAuthResponse) return adminAuthResponse;

      const adminResponse = await handleAdminApi(request, url, env);
      if (adminResponse) return adminResponse;

      const mediaMatch = url.pathname.match(/^\/media\/([^/]+)\/([^/]+)$/);
      if (request.method === "GET" && mediaMatch) {
        return await serveMedia(
          request,
          env,
          decodeURIComponent(mediaMatch[1]),
          decodeURIComponent(mediaMatch[2]),
        );
      }

      throw new AppError(404, "not_found", "Rota não encontrada.");
    } catch (error) {
      return apiError(error, requestId);
    }
  },
} satisfies ExportedHandler<Env>;
