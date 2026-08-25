import { z } from "zod";
import { internalImageIdSchema } from "./image-reference";
import {
  SECTION_ALIGNMENT_IDS,
  SECTION_DENSITY_IDS,
  SECTION_REGISTRY,
  SECTION_TYPES,
  type SectionSurfaceId,
  type SectionType,
} from "./section-registry";

export const sectionInstanceIdSchema = z
  .string()
  .min(3)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "O identificador da seção precisa ser estável e seguro.");

export const heroMediaRefSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("site-media"), id: internalImageIdSchema }).strict(),
  z.object({ kind: z.literal("portfolio-image"), id: internalImageIdSchema }).strict(),
]);
export type HeroMediaRef = z.infer<typeof heroMediaRefSchema>;

const densitySchema = z.enum(SECTION_DENSITY_IDS);
const alignmentSchema = z.enum(SECTION_ALIGNMENT_IDS);

function appearanceSchema<Surface extends readonly [SectionSurfaceId, ...SectionSurfaceId[]]>(surfaces: Surface) {
  return z
    .object({
      surface: z.enum(surfaces),
      density: densitySchema,
      alignment: alignmentSchema,
      backgroundImageId: internalImageIdSchema.nullable(),
    })
    .strict()
    .superRefine((appearance, context) => {
      if (appearance.surface === "photo" && !appearance.backgroundImageId) {
        context.addIssue({ code: "custom", message: "Escolha uma fotografia para este fundo.", path: ["backgroundImageId"] });
      }
      if (appearance.surface !== "photo" && appearance.backgroundImageId) {
        context.addIssue({ code: "custom", message: "Este fundo não usa fotografia.", path: ["backgroundImageId"] });
      }
    });
}

const heroSectionSchema = z.object({
  id: sectionInstanceIdSchema,
  type: z.literal("hero"),
  enabled: z.boolean(),
  variant: z.enum(["cinematic", "editorial", "fullscreen", "split"]),
  appearance: appearanceSchema(["default", "dark", "photo"]),
  heroMedia: heroMediaRefSchema.nullable().optional(),
}).strict();

const statementSectionSchema = z.object({
  id: sectionInstanceIdSchema,
  type: z.literal("statement"),
  enabled: z.boolean(),
  variant: z.enum(["manifesto", "centered"]),
  appearance: appearanceSchema(["default", "light", "dark", "accent"]),
}).strict();

const photoReelSectionSchema = z.object({
  id: sectionInstanceIdSchema,
  type: z.literal("photo-reel"),
  enabled: z.boolean(),
  variant: z.enum(["horizontal", "filmstrip", "patch"]),
  appearance: appearanceSchema(["default", "light", "dark", "accent"]),
  photoIds: z.array(internalImageIdSchema).max(6),
}).strict().superRefine((section, context) => {
  if (new Set(section.photoIds).size !== section.photoIds.length) {
    context.addIssue({ code: "custom", message: "Escolha cada fotografia apenas uma vez.", path: ["photoIds"] });
  }
  if (section.photoIds.length > 0 && section.photoIds.length < 3) {
    context.addIssue({ code: "custom", message: "Escolha pelo menos três fotografias para o Patch.", path: ["photoIds"] });
  }
});

const featuredWorkSectionSchema = z.object({
  id: sectionInstanceIdSchema,
  type: z.literal("featured-work"),
  enabled: z.boolean(),
  variant: z.enum(["editorial-grid", "gallery", "collage"]),
  appearance: appearanceSchema(["default", "light", "dark", "accent"]),
  itemCount: z.number().int().min(2).max(6),
}).strict();

const aboutSectionSchema = z.object({
  id: sectionInstanceIdSchema,
  type: z.literal("about"),
  enabled: z.boolean(),
  variant: z.enum(["portrait", "side-portrait", "centered", "editorial"]),
  appearance: appearanceSchema(["default", "light", "dark", "accent", "photo"]),
}).strict();

const contactSectionSchema = z.object({
  id: sectionInstanceIdSchema,
  type: z.literal("contact"),
  enabled: z.boolean(),
  variant: z.enum(["split-form", "minimal"]),
  appearance: appearanceSchema(["default", "light", "dark", "accent", "photo"]),
}).strict();

export const homeSectionConfigSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  statementSectionSchema,
  photoReelSectionSchema,
  featuredWorkSectionSchema,
  aboutSectionSchema,
  contactSectionSchema,
]);

export const homeCompositionSchema = z.object({ sections: z.array(homeSectionConfigSchema).max(12) }).strict().superRefine((home, context) => {
  const ids = new Set<string>();
  const counts = new Map<SectionType, number>();
  home.sections.forEach((section, index) => {
    if (ids.has(section.id)) {
      context.addIssue({ code: "custom", message: "Cada seção precisa ter uma identidade única.", path: ["sections", index, "id"] });
    }
    ids.add(section.id);
    counts.set(section.type, (counts.get(section.type) ?? 0) + 1);
  });
  for (const type of SECTION_TYPES) {
    const definition = SECTION_REGISTRY[type];
    const count = counts.get(type) ?? 0;
    if (!definition.allowMultiple && count > 1) {
      context.addIssue({ code: "custom", message: `${definition.label} só pode aparecer uma vez.`, path: ["sections"] });
    }
    if (definition.required && !home.sections.some((section) => section.type === type && section.enabled)) {
      context.addIssue({ code: "custom", message: `${definition.label} é essencial e precisa permanecer ativa.`, path: ["sections"] });
    }
  }
});

export const compositionConfigSchema = z.object({ home: homeCompositionSchema }).strict();
export type HomeSectionConfig = z.infer<typeof homeSectionConfigSchema>;
export type HomeComposition = z.infer<typeof homeCompositionSchema>;
export type CompositionConfig = z.infer<typeof compositionConfigSchema>;

const defaultAppearance = {
  surface: "default" as const,
  density: "balanced" as const,
  alignment: "start" as const,
  backgroundImageId: null,
};

export const PUNCTUM_DEFAULT_COMPOSITION_CONFIG = compositionConfigSchema.parse({
  home: {
    sections: [
      { id: "home-hero", type: "hero", enabled: true, variant: "cinematic", appearance: defaultAppearance },
      { id: "home-statement", type: "statement", enabled: true, variant: "manifesto", appearance: defaultAppearance },
      { id: "home-photo-reel", type: "photo-reel", enabled: true, variant: "horizontal", appearance: defaultAppearance, photoIds: [] },
      { id: "home-featured-work", type: "featured-work", enabled: true, variant: "editorial-grid", appearance: defaultAppearance, itemCount: 6 },
      { id: "home-about", type: "about", enabled: true, variant: "portrait", appearance: defaultAppearance },
      { id: "home-contact", type: "contact", enabled: true, variant: "split-form", appearance: defaultAppearance },
    ],
  },
});

export function enabledHomeSections(home: HomeComposition): HomeSectionConfig[] {
  return homeCompositionSchema.parse(home).sections.filter((section) => section.enabled);
}

const legacySectionSchemas = [
  z.object({ id: sectionInstanceIdSchema, type: z.literal("hero"), enabled: z.boolean(), variant: z.literal("cinematic") }).strict(),
  z.object({ id: sectionInstanceIdSchema, type: z.literal("statement"), enabled: z.boolean(), variant: z.literal("manifesto") }).strict(),
  z.object({ id: sectionInstanceIdSchema, type: z.literal("photo-reel"), enabled: z.boolean(), variant: z.literal("horizontal") }).strict(),
  z.object({ id: sectionInstanceIdSchema, type: z.literal("featured-work"), enabled: z.boolean(), variant: z.literal("editorial-grid") }).strict(),
  z.object({ id: sectionInstanceIdSchema, type: z.literal("about"), enabled: z.boolean(), variant: z.literal("portrait") }).strict(),
  z.object({ id: sectionInstanceIdSchema, type: z.literal("contact"), enabled: z.boolean(), variant: z.literal("split-form") }).strict(),
] as const;

export const legacyCompositionConfigV3Schema = z.object({
  home: z.object({ sections: z.array(z.discriminatedUnion("type", legacySectionSchemas)).max(12) }).strict(),
}).strict();
export type LegacyCompositionConfigV3 = z.infer<typeof legacyCompositionConfigV3Schema>;

export function migrateCompositionV3(
  legacy: LegacyCompositionConfigV3,
  collageStyle: "off" | "polaroid" | "editorial-collage" | "patchwork" | "moodboard",
): CompositionConfig {
  const defaults = new Map(PUNCTUM_DEFAULT_COMPOSITION_CONFIG.home.sections.map((section) => [section.type, section]));
  const sections = legacy.home.sections.map((section) => {
    const defaultSection = defaults.get(section.type);
    if (!defaultSection) throw new Error("Seção legada sem equivalente seguro.");
    const migrated = { ...structuredClone(defaultSection), id: section.id, enabled: section.enabled };
    if (section.type === "photo-reel" && collageStyle === "patchwork") {
      return { ...migrated, type: "photo-reel" as const, variant: "patch" as const };
    }
    if (section.type === "featured-work" && ["polaroid", "editorial-collage", "moodboard"].includes(collageStyle)) {
      return { ...migrated, type: "featured-work" as const, variant: "collage" as const };
    }
    return migrated;
  });
  return compositionConfigSchema.parse({ home: { sections } });
}
