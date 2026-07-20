import {
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
  handleImageOptimization,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { handleAdminApi } from "./api/admin";
import { handlePublicApi } from "./api/public";
import { serveMedia } from "./media/serve";
import { handleScheduled } from "./scheduled";
import { robots, sitemap } from "./seo";
import { requireAdmin } from "./utils/auth";
import { AppError } from "./utils/errors";
import { apiError, withSecurityHeaders } from "./utils/response";

async function routeRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);

  if (url.hostname === "www.punctumpicture.com") {
    return Response.redirect(
      `https://punctumpicture.com${url.pathname}${url.search}`,
      308,
    );
  }

  if (url.pathname === "/_vinext/image") {
    const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
    return handleImageOptimization(
      request,
      {
        fetchAsset: (path) =>
          env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const imageFormat = format as
            | "image/jpeg"
            | "image/png"
            | "image/webp"
            | "image/gif"
            | "image/avif";
          const result = await env.IMAGES.input(body)
            .transform(width > 0 ? { width } : {})
            .output({ format: imageFormat, quality });
          return result.response();
        },
      },
      allowedWidths,
    );
  }

  const publicResponse = await handlePublicApi(request, url, env);
  if (publicResponse) {
    return publicResponse;
  }

  const adminResponse = await handleAdminApi(request, url, env);
  if (adminResponse) {
    return adminResponse;
  }

  const mediaMatch = url.pathname.match(/^\/media\/([^/]+)\/([^/]+)$/);
  if (request.method === "GET" && mediaMatch) {
    return serveMedia(
      request,
      env,
      decodeURIComponent(mediaMatch[1]),
      decodeURIComponent(mediaMatch[2]),
    );
  }

  if (request.method === "GET" && url.pathname === "/sitemap.xml") {
    return sitemap(env);
  }
  if (request.method === "GET" && url.pathname === "/robots.txt") {
    return robots(env);
  }

  if (url.pathname === "/admin" || url.pathname.startsWith("/admin/")) {
    await requireAdmin(request, env);
  }

  const response = await handler.fetch(request, env, ctx);
  return withSecurityHeaders(response);
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const requestId = request.headers.get("cf-ray") ?? crypto.randomUUID();
    try {
      return await routeRequest(request, env, ctx);
    } catch (error) {
      if (error instanceof AppError && error.status === 404 && !new URL(request.url).pathname.startsWith("/api/")) {
        return new Response("Página não encontrada.", {
          status: 404,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
      return apiError(error, requestId);
    }
  },
  scheduled: handleScheduled,
} satisfies ExportedHandler<Env>;
