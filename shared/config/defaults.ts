import { assertPaletteContrast } from "./contrast";
import { PUNCTUM_DEFAULT_EDITORIAL_CONFIG } from "./editorial";
import { PUNCTUM_DEFAULT_COMPOSITION_CONFIG } from "./composition";
import { siteConfigSchema } from "./schema";
import { PALETTE_IDS } from "./palette-registry";
import { SITE_CONFIG_SCHEMA_VERSION } from "./version";

PALETTE_IDS.forEach((id) => assertPaletteContrast(id));

export const PUNCTUM_DEFAULT_SITE_CONFIG = siteConfigSchema.parse({
  schemaVersion: SITE_CONFIG_SCHEMA_VERSION,
  identity: {
    sourcePresetId: "punctum-default",
  },
  theme: {
    palette: {
      id: "punctum-violet",
      mode: "light",
    },
    typography: {
      headingFamily: "cormorant-garamond",
      bodyFamily: "manrope",
      headingScale: "display",
      bodyScale: "comfortable",
      headingWeight: "regular",
      headingTracking: "tight",
    },
    shape: { radius: "square" },
    spacing: { density: "balanced" },
    container: { width: "wide" },
    shadow: { style: "soft" },
    motion: { intensity: "subtle" },
    image: { treatment: "natural" },
    background: {
      style: "organic-glow",
      assetId: null,
      imageId: null,
      treatment: "soft",
    },
  },
  editorial: PUNCTUM_DEFAULT_EDITORIAL_CONFIG,
  pages: PUNCTUM_DEFAULT_COMPOSITION_CONFIG,
});
