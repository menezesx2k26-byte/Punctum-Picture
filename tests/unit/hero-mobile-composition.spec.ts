import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("hero mobile composition", () => {
  it("keeps the horizontal photo in a bounded stage instead of stretching it across the full mobile hero", () => {
    const css = fs.readFileSync(path.join(process.cwd(), "app/hero-responsive.css"), "utf8");
    const hero = fs.readFileSync(
      path.join(process.cwd(), "app/sections/home/HomeHeroSection.tsx"),
      "utf8",
    );

    expect(hero).toContain("--hero-mobile-stage-height");
    expect(hero).toContain("--hero-mobile-object-position");
    expect(css).toContain("padding-top: var(--hero-mobile-stage-height, 50svh)");
    expect(css).toContain("height: var(--hero-mobile-stage-height, 50svh)");
    expect(css).toContain("object-position: var(--hero-mobile-object-position, 60% 38%)");
    expect(css).toContain("background: #0d1010");
  });
});
