import type { CSSProperties } from "react";
import type { HomeSectionConfig } from "../../../shared/config";

export function homeSectionAttributes(section: HomeSectionConfig) {
  return {
    "data-home-section-id": section.id,
    "data-home-section-type": section.type,
    "data-home-section-variant": section.variant,
    "data-section-surface": section.appearance.surface,
    "data-section-density": section.appearance.density,
    "data-section-alignment": section.appearance.alignment,
    ...(section.appearance.backgroundImageId
      ? {
          style: {
            "--section-background-image": `url("/media/${section.appearance.backgroundImageId}/hero")`,
          } as CSSProperties,
        }
      : {}),
  };
}
