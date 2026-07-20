import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    cloudflareTest({
      main: "./worker/test-entry.ts",
      wrangler: { configPath: "./wrangler.jsonc" },
      miniflare: {
        bindings: {
          ENVIRONMENT: "local",
          SITE_ORIGIN: "http://localhost:8787",
          PUBLIC_SITE_URL: "http://localhost:8787",
          CLOUDFLARE_TEAM_DOMAIN: "example.cloudflareaccess.com",
          CLOUDFLARE_ACCESS_AUD: "test-audience",
          MAX_UPLOAD_BYTES: "26214400",
          ALLOWED_MIME_TYPES: "image/jpeg,image/png,image/webp",
          PRESIGNED_URL_TTL_SECONDS: "900",
          CONTACT_RATE_LIMIT_WINDOW_SECONDS: "3600",
          CONTACT_RATE_LIMIT_MAX: "5",
          ADMIN_RATE_LIMIT_WINDOW_SECONDS: "60",
          ADMIN_RATE_LIMIT_MAX: "200",
        },
      },
    }),
  ],
  test: {
    include: ["tests/**/*.spec.ts"],
    testTimeout: 20_000,
  },
});
