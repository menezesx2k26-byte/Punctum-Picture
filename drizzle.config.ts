import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // Generated diffs are review input. Immutable runtime migrations live in
  // `migrations/` and are applied by Wrangler after review.
  out: "./.drizzle-generated",
  schema: "./db/schema.ts",
  dialect: "sqlite",
});
