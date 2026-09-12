import { PUNCTUM_DEFAULT_COMPOSITION_CONFIG, type HomeComposition } from "./composition";
import type { SiteConfig } from "./schema";

export function isProtectedSection(type: string) {
  return type === "hero" || type === "photo-reel";
}

/** Presentation policy shared by Studio and the public renderer. No stored data migration. */
export function protectImmersiveHome(home: HomeComposition): HomeComposition {
  const sections = structuredClone(home.sections);
  for (const type of ["hero", "photo-reel"] as const) {
    let section = sections.find((item) => item.type === type);
    if (!section) {
      const original = structuredClone(PUNCTUM_DEFAULT_COMPOSITION_CONFIG.home.sections.find((item) => item.type === type)!);
      let suffix = 1;
      while (sections.some((item) => item.id === original.id)) original.id = `protected-${type}-${suffix++}`;
      sections.splice(type === "hero" ? 0 : 1, 0, original);
      section = original;
    }
    section.enabled = true;
    if (section.type === "hero") section.variant = "cinematic";
    if (section.type === "photo-reel") section.variant = "horizontal";
  }
  const hero = sections.find((section) => section.type === "hero")!;
  return {sections:[hero, ...sections.filter((section) => section !== hero)]};
}

export function protectImmersiveConfig(config: SiteConfig): SiteConfig {
  return {...config, pages:{...config.pages, home:protectImmersiveHome(config.pages.home)}};
}
