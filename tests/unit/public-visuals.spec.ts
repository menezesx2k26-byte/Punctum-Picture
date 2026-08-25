import { describe, expect, it } from "vitest";
import {
  getHeroObjectPosition,
  getHeroMobileStageHeight,
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

  it("usa a fotografia editorial atual no hero em resolução 4K", () => {
    expect(getPublicVisualAsset("hero")).toEqual({
      src: "/images/hero-maria.webp",
      alt: "Fotógrafa em primeiro plano nas arquibancadas de um estádio",
      width: 3840,
      height: 2160,
    });
  });

  it("usa enquadramentos distintos no desktop e no mobile", () => {
    expect(getHeroObjectPosition("desktop")).toBe("45% 42%");
    expect(getHeroObjectPosition("mobile")).toBe("60% 38%");
  });

  it("limita a fotografia no mobile para evitar zoom de uma imagem 16:9 em uma tela vertical", () => {
    expect(getHeroMobileStageHeight()).toBe("62svh");
  });
});
