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
      src: "/logo-punctum.png",
      alt: "",
      width: 1254,
      height: 1254,
    });
  });

  it("usa a fotografia original em alta resolução no hero", () => {
    expect(getPublicVisualAsset("hero")).toEqual({
      src: "/photos/p001.jpg",
      alt: "Maria Helena fotografando no estádio",
      width: 1024,
      height: 1536,
    });
  });
});
