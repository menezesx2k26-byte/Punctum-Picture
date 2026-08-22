import { describe, expect, it } from "vitest";
import {
  HOME_SECTION_VARIANTS,
  PUNCTUM_DEFAULT_COMPOSITION_CONFIG,
  SECTION_REGISTRY,
  SECTION_TYPES,
  enabledHomeSections,
  homeCompositionSchema,
  homeSectionConfigSchema,
  isAllowedSectionVariant,
  isSectionType,
} from "../../shared/config";

describe("SectionRegistry", () => {
  it("possui uma definição fechada e amigável para cada SectionType", () => {
    expect(Object.keys(SECTION_REGISTRY)).toEqual(SECTION_TYPES);

    for (const type of SECTION_TYPES) {
      const definition = SECTION_REGISTRY[type];
      expect(definition.type).toBe(type);
      expect(definition.label.length).toBeGreaterThan(2);
      expect(definition.description.length).toBeGreaterThan(12);
      expect(definition.label).not.toMatch(/section|component|registry/i);
      expect(definition.allowedVariants).toContain(definition.defaultVariant);
      expect(isSectionType(type)).toBe(true);
      expect(isAllowedSectionVariant(type, definition.defaultVariant)).toBe(true);
    }

    expect(isSectionType("html-livre")).toBe(false);
  });

  it("mantém todas as variants atuais registradas e rejeita type/variant desconhecidos", () => {
    for (const type of SECTION_TYPES) {
      expect(SECTION_REGISTRY[type].allowedVariants).toEqual(
        HOME_SECTION_VARIANTS[type],
      );
    }

    expect(
      homeSectionConfigSchema.safeParse({
        id: "home-video",
        type: "video",
        enabled: true,
        variant: "default",
      }).success,
    ).toBe(false);
    expect(
      homeSectionConfigSchema.safeParse({
        id: "home-hero",
        type: "hero",
        enabled: true,
        variant: "html-livre",
      }).success,
    ).toBe(false);
  });

  it("rejeita IDs repetidos, duplicação não permitida e propriedades arbitrárias", () => {
    const sections = structuredClone(
      PUNCTUM_DEFAULT_COMPOSITION_CONFIG.home.sections,
    );
    sections[1].id = sections[0].id;
    expect(homeCompositionSchema.safeParse({ sections }).success).toBe(false);

    const duplicateType = structuredClone(
      PUNCTUM_DEFAULT_COMPOSITION_CONFIG.home.sections,
    );
    duplicateType.push({
      id: "home-statement-secondary",
      type: "statement",
      enabled: true,
      variant: "manifesto",
      appearance: {
        surface: "default",
        density: "balanced",
        alignment: "start",
        backgroundImageId: null,
      },
    });
    expect(
      homeCompositionSchema.safeParse({ sections: duplicateType }).success,
    ).toBe(false);

    expect(
      homeSectionConfigSchema.safeParse({
        ...PUNCTUM_DEFAULT_COMPOSITION_CONFIG.home.sections[0],
        customCss: "display:none",
      }).success,
    ).toBe(false);
  });

  it("exige a Capa presente e ativa", () => {
    const withoutHero = PUNCTUM_DEFAULT_COMPOSITION_CONFIG.home.sections.filter(
      (section) => section.type !== "hero",
    );
    expect(
      homeCompositionSchema.safeParse({ sections: withoutHero }).success,
    ).toBe(false);

    const disabledHero = structuredClone(
      PUNCTUM_DEFAULT_COMPOSITION_CONFIG.home.sections,
    );
    disabledHero[0].enabled = false;
    expect(
      homeCompositionSchema.safeParse({ sections: disabledHero }).success,
    ).toBe(false);
  });
});

describe("CompositionConfig da Home", () => {
  it("reproduz a ordem visual atual com IDs estáveis", () => {
    expect(PUNCTUM_DEFAULT_COMPOSITION_CONFIG.home.sections.map(({ id, type, enabled, variant }) => ({ id, type, enabled, variant }))).toEqual([
      { id: "home-hero", type: "hero", enabled: true, variant: "cinematic" },
      {
        id: "home-statement",
        type: "statement",
        enabled: true,
        variant: "manifesto",
      },
      {
        id: "home-photo-reel",
        type: "photo-reel",
        enabled: true,
        variant: "horizontal",
      },
      {
        id: "home-featured-work",
        type: "featured-work",
        enabled: true,
        variant: "editorial-grid",
      },
      { id: "home-about", type: "about", enabled: true, variant: "portrait" },
      {
        id: "home-contact",
        type: "contact",
        enabled: true,
        variant: "split-form",
      },
    ]);
  });

  it("usa a ordem do array e omite apenas sections opcionais desativadas", () => {
    const sections = structuredClone(
      PUNCTUM_DEFAULT_COMPOSITION_CONFIG.home.sections,
    );
    const hero = sections.shift();
    if (!hero) throw new Error("Capa default ausente");
    const about = sections.find((section) => section.type === "about");
    if (!about) throw new Error("Sobre mim default ausente");
    about.enabled = false;

    const reordered = { sections: [hero, ...sections.reverse()] };
    expect(enabledHomeSections(reordered).map((section) => section.id)).toEqual([
      "home-hero",
      "home-contact",
      "home-featured-work",
      "home-photo-reel",
      "home-statement",
    ]);
  });
});
