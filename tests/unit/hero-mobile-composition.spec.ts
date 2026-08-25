import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("hero mobile composition", () => {
  it("keeps the horizontal photo in a bounded stage instead of stretching it across the full mobile hero", () => {
    const hero = fs.readFileSync(
      path.join(process.cwd(), "app/sections/home/HomeHeroSection.tsx"),
      "utf8",
    );

    expect(hero).toContain("--hero-mobile-stage-height");
    expect(hero).toContain("--hero-mobile-object-position");
    expect(hero).toContain("padding-top: var(--hero-mobile-stage-height, 50svh)");
    expect(hero).toContain("height: var(--hero-mobile-stage-height, 50svh)");
    expect(hero).toContain("object-position: var(--hero-mobile-object-position, 60% 38%)");
    expect(hero).toContain("background: #0d1010");
  });
});
