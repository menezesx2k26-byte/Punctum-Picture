import { describe, expect, it } from "vitest";
import deployWorkflow from "../../.github/workflows/cloudflare-git-main.yml?raw";

describe("deploy de produção", () => {
  it("aplica migrations remotas do D1 antes do deploy do Worker", () => {
    const migrationStep = deployWorkflow.indexOf("wrangler d1 migrations apply punctum-picture --remote --config wrangler.jsonc");
    const deployStep = deployWorkflow.indexOf("wrangler deploy --config dist/server/wrangler.json");
    expect(migrationStep).toBeGreaterThan(-1);
    expect(deployStep).toBeGreaterThan(migrationStep);
    expect(deployWorkflow).toContain("CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_D1_API_TOKEN }}");
  });
});
