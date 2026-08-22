import { describe, expect, it } from "vitest";
import { PUNCTUM_DEFAULT_SITE_CONFIG } from "../../shared/config";
import {
  HOME_SECTION_RENDERER_KEYS,
  buildHomeSectionRenderPlan,
} from "../../app/sections/home/render-plan";

describe("plano server-first do HomeRenderer", () => {
  it("possui um renderer aprovado para cada section e variant atual", () => {
    expect(HOME_SECTION_RENDERER_KEYS).toEqual({
      hero: {
        cinematic: "hero:cinematic",
        editorial: "hero:editorial",
        fullscreen: "hero:fullscreen",
        split: "hero:split",
      },
      statement: {
        manifesto: "statement:manifesto",
        centered: "statement:centered",
      },
      "photo-reel": {
        horizontal: "photo-reel:horizontal",
        filmstrip: "photo-reel:filmstrip",
        patch: "photo-reel:patch",
      },
      "featured-work": {
        "editorial-grid": "featured-work:editorial-grid",
        gallery: "featured-work:gallery",
        collage: "featured-work:collage",
      },
      about: {
        portrait: "about:portrait",
        "side-portrait": "about:side-portrait",
        centered: "about:centered",
        editorial: "about:editorial",
      },
      contact: {
        "split-form": "contact:split-form",
        minimal: "contact:minimal",
      },
    });
  });

  it("mapeia variants aprovadas sem importar editor ou configuração livre", () => {
    const home = structuredClone(PUNCTUM_DEFAULT_SITE_CONFIG.pages.home);
    const hero = home.sections.find((section) => section.type === "hero");
    const reel = home.sections.find((section) => section.type === "photo-reel");
    const featured = home.sections.find((section) => section.type === "featured-work");
    if (!hero || hero.type !== "hero" || !reel || reel.type !== "photo-reel" || !featured || featured.type !== "featured-work") {
      throw new Error("Composição default incompleta");
    }
    hero.variant = "split";
    reel.variant = "patch";
    featured.variant = "collage";
    expect(buildHomeSectionRenderPlan(home).map(({ rendererKey }) => rendererKey)).toContain("hero:split");
    expect(buildHomeSectionRenderPlan(home).map(({ rendererKey }) => rendererKey)).toContain("photo-reel:patch");
    expect(buildHomeSectionRenderPlan(home).map(({ rendererKey }) => rendererKey)).toContain("featured-work:collage");
  });

  it("renderiza todas as sections default na ordem da composição", () => {
    const plan = buildHomeSectionRenderPlan(
      PUNCTUM_DEFAULT_SITE_CONFIG.pages.home,
    );
    expect(plan.map(({ section }) => section.id)).toEqual([
      "home-hero",
      "home-statement",
      "home-photo-reel",
      "home-featured-work",
      "home-about",
      "home-contact",
    ]);
    expect(plan.map(({ rendererKey }) => rendererKey)).toEqual([
      "hero:cinematic",
      "statement:manifesto",
      "photo-reel:horizontal",
      "featured-work:editorial-grid",
      "about:portrait",
      "contact:split-form",
    ]);
  });

  it("faz a ordem do array determinar a ordem do plano e respeita enabled", () => {
    const home = structuredClone(PUNCTUM_DEFAULT_SITE_CONFIG.pages.home);
    const hero = home.sections.shift();
    if (!hero) throw new Error("Capa default ausente");
    const about = home.sections.find((section) => section.type === "about");
    if (!about) throw new Error("Sobre mim default ausente");
    about.enabled = false;
    home.sections = [hero, ...home.sections.reverse()];

    expect(
      buildHomeSectionRenderPlan(home).map(({ section }) => section.id),
    ).toEqual([
      "home-hero",
      "home-contact",
      "home-featured-work",
      "home-photo-reel",
      "home-statement",
    ]);
  });
});
