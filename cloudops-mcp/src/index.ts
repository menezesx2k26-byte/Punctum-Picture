import { createMcpHandler } from "agents/mcp/server";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";

interface Env {
  MEDIA: R2Bucket;
  IMAGES: ImagesBinding;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  ALLOWED_BRANCH_PREFIX: string;
  GITHUB_TOKEN?: string;
}

function jsonText(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
  };
}

function safeKey(key: string) {
  const normalized = key.replace(/^\/+/, "").replace(/\.\./g, "");
  if (!normalized || normalized.length > 512) throw new Error("Invalid R2 key");
  return normalized;
}

async function sha256Hex(bytes: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function githubHeaders(env: Env) {
  if (!env.GITHUB_TOKEN) throw new Error("GITHUB_TOKEN secret is not configured");
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "punctum-cloudops-mcp",
  };
}

function assertAllowedBranch(env: Env, branch: string) {
  if (!branch.startsWith(env.ALLOWED_BRANCH_PREFIX)) {
    throw new Error(`Branch must start with ${env.ALLOWED_BRANCH_PREFIX}`);
  }
}

function createServer(env: Env) {
  const server = new McpServer({
    name: "punctum-cloudops-mcp",
    version: "0.1.0",
  });

  server.registerTool(
    "media_info",
    {
      description: "Read metadata for an image already stored in R2.",
      inputSchema: { key: z.string().min(1) },
    },
    async ({ key }) => {
      const object = await env.MEDIA.get(safeKey(key));
      if (!object) throw new Error("Object not found");
      const info = await env.IMAGES.info(object.body);
      return jsonText({ key: object.key, size: object.size, etag: object.etag, info });
    },
  );

  server.registerTool(
    "media_convert",
    {
      description: "Convert and resize an image from one R2 key to another without Base64.",
      inputSchema: {
        sourceKey: z.string().min(1),
        destinationKey: z.string().min(1),
        format: z.enum(["image/webp", "image/jpeg", "image/avif"]).default("image/webp"),
        quality: z.number().min(1).max(100).default(84),
        maxSide: z.number().int().min(320).max(8192).default(2048),
      },
    },
    async ({ sourceKey, destinationKey, format, quality, maxSide }) => {
      const source = await env.MEDIA.get(safeKey(sourceKey));
      if (!source) throw new Error("Source object not found");

      const info = await env.IMAGES.info(source.body);
      const width = Number((info as any).width ?? 0);
      const height = Number((info as any).height ?? 0);
      if (!width || !height) throw new Error("Unable to determine image dimensions");

      const transform = width >= height ? { width: maxSide } : { height: maxSide };
      const originalAgain = await env.MEDIA.get(safeKey(sourceKey));
      if (!originalAgain) throw new Error("Source object disappeared");

      const response = (
        await env.IMAGES.input(originalAgain.body)
          .transform(transform)
          .output({ format, quality })
      ).response();

      if (!response.ok || !response.body) {
        throw new Error(`Images binding failed with HTTP ${response.status}`);
      }

      const bytes = await response.arrayBuffer();
      const key = safeKey(destinationKey);
      const hash = await sha256Hex(bytes);
      const stored = await env.MEDIA.put(key, bytes, {
        httpMetadata: {
          contentType: format,
          cacheControl: "public, max-age=31536000, immutable",
        },
        customMetadata: {
          sha256: hash,
          sourceKey: safeKey(sourceKey),
        },
      });

      return jsonText({
        key,
        format,
        bytes: bytes.byteLength,
        sha256: hash,
        etag: stored?.etag ?? null,
        source: { width, height },
      });
    },
  );

  server.registerTool(
    "media_delete",
    {
      description: "Delete one R2 media object.",
      inputSchema: { key: z.string().min(1) },
    },
    async ({ key }) => {
      const safe = safeKey(key);
      await env.MEDIA.delete(safe);
      return jsonText({ deleted: safe });
    },
  );

  server.registerTool(
    "github_read_file",
    {
      description: "Read a UTF-8 text file from the configured GitHub repository.",
      inputSchema: {
        path: z.string().min(1),
        branch: z.string().min(1),
      },
    },
    async ({ path, branch }) => {
      assertAllowedBranch(env, branch);
      const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${encodeURI(path)}?ref=${encodeURIComponent(branch)}`;
      const response = await fetch(url, { headers: githubHeaders(env) });
      if (!response.ok) throw new Error(`GitHub read failed: ${response.status}`);
      const data = (await response.json()) as any;
      if (data.type !== "file" || data.encoding !== "base64") throw new Error("Path is not a regular file");
      const content = atob(String(data.content).replace(/\n/g, ""));
      return jsonText({ path, branch, sha: data.sha, content });
    },
  );

  server.registerTool(
    "github_write_file",
    {
      description: "Create or replace a UTF-8 text file on an allowed branch. Intended for source/config files, not binary media.",
      inputSchema: {
        path: z.string().min(1),
        branch: z.string().min(1),
        content: z.string(),
        message: z.string().min(1).max(160),
        sha: z.string().optional(),
      },
    },
    async ({ path, branch, content, message, sha }) => {
      assertAllowedBranch(env, branch);
      const body: Record<string, unknown> = {
        message,
        branch,
        content: btoa(unescape(encodeURIComponent(content))),
      };
      if (sha) body.sha = sha;

      const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${encodeURI(path)}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { ...githubHeaders(env), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(`GitHub write failed: ${response.status} ${JSON.stringify(data)}`);
      return jsonText({ path, branch, result: data });
    },
  );

  return server;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ ok: true, service: "punctum-cloudops-mcp", version: "0.1.0" });
    }

    return createMcpHandler(() => createServer(env), { route: "/mcp" })(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
