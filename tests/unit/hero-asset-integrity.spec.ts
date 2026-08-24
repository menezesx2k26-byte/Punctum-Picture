import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("hero asset integrity", () => {
  it("stores the public hero as a real WebP binary, not base64 text", async () => {
    const hero = await readFile("public/images/hero-maria.webp");

    expect(hero.subarray(0, 4).toString("ascii")).toBe("RIFF");
    expect(hero.subarray(8, 12).toString("ascii")).toBe("WEBP");
  });
});
