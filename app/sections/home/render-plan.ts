import {
  enabledHomeSections,
  type HomeComposition,
  type HomeSectionConfig,
  type SectionType,
  type SectionVariantByType,
} from "../../../shared/config";
import { protectImmersiveHome } from "../../../shared/config/immersive-policy";

type HomeSectionRendererKeyMap = {
  [Type in SectionType]: {
    [Variant in SectionVariantByType[Type]]: `${Type}:${Variant}`;
  };
};

export const HOME_SECTION_RENDERER_KEYS = {
  hero: {
    cinematic: "hero:cinematic", editorial: "hero:editorial",
    fullscreen: "hero:fullscreen", split: "hero:split",
  },
  statement: { manifesto: "statement:manifesto", centered: "statement:centered" },
  "photo-reel": {
    horizontal: "photo-reel:horizontal", filmstrip: "photo-reel:filmstrip", patch: "photo-reel:patch",
  },
  "featured-work": {
    "editorial-grid": "featured-work:editorial-grid", gallery: "featured-work:gallery", collage: "featured-work:collage",
  },
  about: {
    portrait: "about:portrait", "side-portrait": "about:side-portrait",
    centered: "about:centered", editorial: "about:editorial",
  },
  contact: { "split-form": "contact:split-form", minimal: "contact:minimal" },
} as const satisfies HomeSectionRendererKeyMap;

type HomeSectionRendererKeyFor<Type extends SectionType> =
  (typeof HOME_SECTION_RENDERER_KEYS)[Type][keyof (typeof HOME_SECTION_RENDERER_KEYS)[Type]];

export type HomeSectionRendererKey = {
  [Type in SectionType]: HomeSectionRendererKeyFor<Type>;
}[SectionType];

export type HomeSectionRenderPlanEntry = {
  section: HomeSectionConfig;
  rendererKey: HomeSectionRendererKey;
};

function rendererKeyFor(
  section: HomeSectionConfig,
): HomeSectionRendererKey {
  switch (section.type) {
    case "hero":
      return HOME_SECTION_RENDERER_KEYS.hero[section.variant];
    case "statement":
      return HOME_SECTION_RENDERER_KEYS.statement[section.variant];
    case "photo-reel":
      return HOME_SECTION_RENDERER_KEYS["photo-reel"][section.variant];
    case "featured-work":
      return HOME_SECTION_RENDERER_KEYS["featured-work"][section.variant];
    case "about":
      return HOME_SECTION_RENDERER_KEYS.about[section.variant];
    case "contact":
      return HOME_SECTION_RENDERER_KEYS.contact[section.variant];
  }
}

export function buildHomeSectionRenderPlan(
  home: HomeComposition,
): HomeSectionRenderPlanEntry[] {
  return enabledHomeSections(protectImmersiveHome(home)).map((section) => ({
    section,
    rendererKey: rendererKeyFor(section),
  }));
}
