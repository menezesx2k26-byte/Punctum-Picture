/// <reference types="vite/client" />

import { describe, expect, it } from "vitest";
import config from "../../wrangler.jsonc?raw";

const productionAccountId = "257bca437616da74ece1ce4bbaf0bd89";
const placeholderDatabaseId = "00000000-0000-4000-8000-000000000000";

describe("Cloudflare production configuration", () => {
  it("selects the production account and references a real D1 database", () => {
    expect(config).toContain(`"account_id": "${productionAccountId}"`);
    expect(config).not.toContain(`"database_id": "${placeholderDatabaseId}"`);
  });
});
