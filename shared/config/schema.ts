import { z } from "zod";
import { BACKGROUND_ASSET_IDS, BACKGROUND_STYLE_IDS } from "./background-registry";
import { compositionConfigSchema } from "./composition";
import { editorialConfigSchema } from "./editorial";
import { BODY_FONT_FAMILY_IDS, FONT_REGISTRY, HEADING_FONT_FAMILY_IDS } from "./font-registry";
import { internalImageIdSchema } from "./image-reference";
import { PALETTE_IDS, PALETTE_REGISTRY } from "./palette-registry";
import { SITE_PRESET_IDS } from "./preset-ids";
import { SITE_CONFIG_SCHEMA_VERSION } from "./version";

export const identityConfigSchema = z.object({ sourcePresetId: z.enum(SITE_PRESET_IDS) }).strict();

const themeCoreShape = {
  palette: z.object({ id: z.enum(PALETTE_IDS), mode: z.enum(["light", "dark"]) }).strict(),
  typography: z.object({
    headingFamily: z.enum(HEADING_FONT_FAMILY_IDS),
    bodyFamily: z.enum(BODY_FONT_FAMILY_IDS),
    headingScale: z.enum(["restrained", "editorial", "display"]),
    bodyScale: z.enum(["compact", "comfortable"]),
    headingWeight: z.enum(["regular", "medium", "semibold"]),
    headingTracking: z.enum(["tight", "normal"]),
  }).strict(),
  shape: z.object({ radius: z.enum(["square", "soft", "rounded"]) }).strict(),
  spacing: z.object({ density: z.enum(["compact", "balanced", "spacious"]) }).strict(),
  container: z.object({ width: z.enum(["narrow", "standard", "wide"]) }).strict(),
  shadow: z.object({ style: z.enum(["none", "soft", "graphic"]) }).strict(),
  motion: z.object({ intensity: z.enum(["none", "subtle", "expressive"]) }).strict(),
  image: z.object({ treatment: z.enum(["natural", "soft", "contrast", "monochrome"]) }).strict(),
} as const;

function refineTheme(
  theme: {
    palette: { id: (typeof PALETTE_IDS)[number]; mode: "light" | "dark" };
    typography: { headingFamily: (typeof HEADING_FONT_FAMILY_IDS)[number]; headingWeight: "regular" | "medium" | "semibold" };
  },
  context: z.RefinementCtx,
) {
  if (PALETTE_REGISTRY[theme.palette.id].mode !== theme.palette.mode) {
    context.addIssue({ code: "custom", message: "O modo precisa corresponder à paleta aprovada.", path: ["palette", "mode"] });
  }
  const selectedWeight = { regular: 400, medium: 500, semibold: 600 }[theme.typography.headingWeight];
  if (!FONT_REGISTRY[theme.typography.headingFamily].availableWeights.includes(selectedWeight)) {
    context.addIssue({
      code: "custom",
      message: "Essa escrita não oferece o peso escolhido. Selecione um estilo aprovado.",
      path: ["typography", "headingWeight"],
    });
  }
}

export const legacyThemeConfigV3Schema = z.object({
  ...themeCoreShape,
  background: z.object({ style: z.enum(BACKGROUND_STYLE_IDS), assetId: z.enum(BACKGROUND_ASSET_IDS).nullable() }).strict(),
  collage: z.object({ style: z.enum(["off", "polaroid", "editorial-collage", "patchwork", "moodboard"]) }).strict(),
}).strict().superRefine((theme, context) => {
  refineTheme(theme, context);
  if (theme.background.style === "soft-image" && !theme.background.assetId) {
    context.addIssue({ code: "custom", message: "Um fundo fotográfico precisa usar um asset aprovado.", path: ["background", "assetId"] });
  }
  if (theme.background.style !== "soft-image" && theme.background.assetId) {
    context.addIssue({ code: "custom", message: "Este estilo de fundo não aceita imagem.", path: ["background", "assetId"] });
  }
});

export const themeConfigSchema = z.object({
  ...themeCoreShape,
  background: z.object({
    style: z.enum(BACKGROUND_STYLE_IDS),
    assetId: z.enum(BACKGROUND_ASSET_IDS).nullable(),
    imageId: internalImageIdSchema.nullable(),
    treatment: z.enum(["soft", "present", "dark", "light"]),
  }).strict(),
}).strict().superRefine((theme, context) => {
  refineTheme(theme, context);
  const hasApprovedAsset = Boolean(theme.background.assetId);
  const hasPublishedImage = Boolean(theme.background.imageId);
  if (theme.background.style === "soft-image" && hasApprovedAsset === hasPublishedImage) {
    context.addIssue({
      code: "custom",
      message: "Escolha uma fotografia aprovada para o fundo.",
      path: ["background"],
    });
  }
  if (theme.background.style !== "soft-image" && (hasApprovedAsset || hasPublishedImage)) {
    context.addIssue({
      code: "custom",
      message: "Este estilo de fundo não aceita fotografia.",
      path: ["background"],
    });
  }
});

export const siteConfigSchema = z.object({
  schemaVersion: z.literal(SITE_CONFIG_SCHEMA_VERSION),
  identity: identityConfigSchema,
  theme: themeConfigSchema,
  editorial: editorialConfigSchema,
  pages: compositionConfigSchema,
}).strict();

export type IdentityConfig = z.infer<typeof identityConfigSchema>;
export type LegacyThemeConfigV3 = z.infer<typeof legacyThemeConfigV3Schema>;
export type ThemeConfig = z.infer<typeof themeConfigSchema>;
export type SiteConfig = z.infer<typeof siteConfigSchema>;
