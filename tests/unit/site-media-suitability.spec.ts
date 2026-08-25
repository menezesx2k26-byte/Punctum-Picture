import { describe, expect, it } from "vitest";
import { isSuitableHeroSource } from "../../worker/site-media";

describe("resolução de mídia do Hero", () => {
  it("aceita a foto 1536x961 enviada pelo Studio", () => {
    expect(isSuitableHeroSource(1536, 961)).toBe(true);
  });

  it("continua rejeitando imagens realmente pequenas", () => {
    expect(isSuitableHeroSource(640, 360)).toBe(false);
  });
});
