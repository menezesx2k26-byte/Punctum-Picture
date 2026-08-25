import { describe, expect, it } from "vitest";
import {
  getHeroObjectPosition,
  getHeroMobileMinHeight,
  getPublicVisualAsset,
  getSiteHeaderClassName,
  resolveHeroVisual,
} from "../../app/lib/public-visuals";

describe("identidade visual pública", () => {
  it("renderiza o cabeçalho interno como sobreposição transparente com a marca quadrada", () => {
    const logo = getPublicVisualAsset("logo");
    expect(getSiteHeaderClassName(true)).toBe("site-header dark site-header-transparent");
    expect(logo).toEqual({ src: "/logo-punctum-transparent.png", alt: "", width: 1254, height: 1254 });
  });

  it("usa a fotografia editorial atual no hero em resolução 4K", () => {
    expect(getPublicVisualAsset("hero")).toEqual({
      src: "/images/hero-maria.webp",
      alt: "Fotógrafa em primeiro plano nas arquibancadas de um estádio",
      width: 3840,
      height: 2160,
    });
  });

  it("prefere a fotografia escolhida no Studio e mantém o 4K como fallback", () => {
    const fallback = getPublicVisualAsset("hero");
    expect(resolveHeroVisual("photo-123", [{ id: "photo-123", src: "/media/photo-123/display", alt: "Novo hero" }])).toEqual({
      src: "/media/photo-123/display",
      alt: "Novo hero",
      width: 3840,
      height: 2160,
    });
    expect(resolveHeroVisual(null, [])).toEqual(fallback);
  });

  it("usa enquadramentos distintos no desktop e no mobile", () => {
    expect(getHeroObjectPosition("desktop")).toBe("45% 42%");
    expect(getHeroObjectPosition("mobile")).toBe("50% 50%");
  });

  it("mantém o hero mobile full-bleed por pelo menos uma viewport", () => {
    expect(getHeroMobileMinHeight()).toBe("100svh");
  });
});
