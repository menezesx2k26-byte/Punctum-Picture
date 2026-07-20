import vinext from "vinext";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  vars: {
    ENVIRONMENT: "local",
    SITE_ORIGIN: "http://localhost:3000",
    PUBLIC_SITE_URL: "http://localhost:3000",
    PUBLIC_WHATSAPP_E164: "5511999999999",
    PUBLIC_INSTAGRAM_URL: "https://instagram.com/punctumpicture",
    MAX_UPLOAD_BYTES: "26214400",
    ALLOWED_MIME_TYPES: "image/jpeg,image/png,image/webp",
    PRESIGNED_URL_TTL_SECONDS: "900",
    CONTACT_RATE_LIMIT_WINDOW_SECONDS: "3600",
    CONTACT_RATE_LIMIT_MAX: "5",
    ADMIN_RATE_LIMIT_WINDOW_SECONDS: "60",
    ADMIN_RATE_LIMIT_MAX: "60",
    BACKUP_PREFIX: "backups/d1",
    BACKUP_RETENTION_DAYS: "180",
    CLEANUP_ORPHAN_UPLOAD_AGE_HOURS: "24",
  },
};

export default defineConfig(async ({ command }) => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      sites(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: command === "serve" ? localBindingConfig : undefined,
      }),
    ],
  };
});
