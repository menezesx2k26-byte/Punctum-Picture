import { describe, expect, it } from "vitest";
import {
  getPublicVisualAsset,
  getSiteHeaderClassName,
} from "../../app/lib/public-visuals";

describe("identidade visual pública", () => {
  it("renderiza o cabeçalho interno como sobreposição transparente com a marca quadrada", () => {
    const logo = getPublicVisualAsset("logo");

    expect(getSiteHeaderClassName(true)).toBe(
      "site-header dark site-header-transparent",
    );
    expect(logo).toEqual({
      src: "/logo-punctum-transparent.png",
      alt: "",
      width: 1254,
      height: 1254,
    });
  });

  it("usa a fotografia editorial atual no hero", () => {
    expect(getPublicVisualAsset("hero")).toEqual({
      src: "/photos/hero-maria-helena-2026-08-24.webp",
      alt: "Maria Helena fotografando nas arquibancadas de um estádio",
      width: 1536,
      height: 1024,
    });
  });
});
