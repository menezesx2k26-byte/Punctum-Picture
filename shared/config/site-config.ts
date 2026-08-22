import { z } from "zod";
import {
  legacyCompositionConfigV3Schema,
  migrateCompositionV3,
  type LegacyCompositionConfigV3,
} from "./composition";
import { PUNCTUM_DEFAULT_SITE_CONFIG } from "./defaults";
import { editorialConfigSchema } from "./editorial";
import {
  identityConfigSchema,
  legacyThemeConfigV3Schema,
  siteConfigSchema,
  type LegacyThemeConfigV3,
  type SiteConfig,
} from "./schema";

export type SiteConfigParseResult = {
  config: SiteConfig;
  source: "input" | "migrated-v3" | "migrated-v2" | "migrated-v1" | "punctum-default";
  issues: readonly string[];
};

const siteConfigV1Schema = z.object({
  schemaVersion: z.literal(1),
  identity: identityConfigSchema,
  theme: legacyThemeConfigV3Schema,
}).strict();

const siteConfigV2Schema = z.object({
  schemaVersion: z.literal(2),
  identity: identityConfigSchema,
  theme: legacyThemeConfigV3Schema,
  editorial: editorialConfigSchema,
}).strict();

const siteConfigV3Schema = z.object({
  schemaVersion: z.literal(3),
  identity: identityConfigSchema,
  theme: legacyThemeConfigV3Schema,
  editorial: editorialConfigSchema,
  pages: legacyCompositionConfigV3Schema,
}).strict();

const LEGACY_DEFAULT_PAGES: LegacyCompositionConfigV3 = legacyCompositionConfigV3Schema.parse({
  home: {
    sections: [
      { id: "home-hero", type: "hero", enabled: true, variant: "cinematic" },
      { id: "home-statement", type: "statement", enabled: true, variant: "manifesto" },
      { id: "home-photo-reel", type: "photo-reel", enabled: true, variant: "horizontal" },
      { id: "home-featured-work", type: "featured-work", enabled: true, variant: "editorial-grid" },
      { id: "home-about", type: "about", enabled: true, variant: "portrait" },
      { id: "home-contact", type: "contact", enabled: true, variant: "split-form" },
    ],
  },
});

function defaultConfig(): SiteConfig {
  return siteConfigSchema.parse(PUNCTUM_DEFAULT_SITE_CONFIG);
}

function migrateTheme(theme: LegacyThemeConfigV3): SiteConfig["theme"] {
  const { collage: _collage, background, ...core } = theme;
  void _collage;
  return {
    ...core,
    background: {
      style: background.style,
      assetId: background.assetId,
      imageId: null,
      treatment: "soft",
    },
  };
}

function migrateLegacyConfig(input: {
  identity: z.infer<typeof identityConfigSchema>;
  theme: LegacyThemeConfigV3;
  editorial?: z.infer<typeof editorialConfigSchema>;
  pages?: LegacyCompositionConfigV3;
}): SiteConfig {
  return siteConfigSchema.parse({
    schemaVersion: 4,
    identity: input.identity,
    theme: migrateTheme(input.theme),
    editorial: input.editorial ?? PUNCTUM_DEFAULT_SITE_CONFIG.editorial,
    pages: migrateCompositionV3(
      input.pages ?? LEGACY_DEFAULT_PAGES,
      input.theme.collage.style,
    ),
  });
}

export function safeParseSiteConfig(input: unknown): SiteConfigParseResult {
  const parsed = siteConfigSchema.safeParse(input);
  if (parsed.success) return { config: parsed.data, source: "input", issues: [] };

  const previousV3 = siteConfigV3Schema.safeParse(input);
  if (previousV3.success) {
    return {
      config: migrateLegacyConfig(previousV3.data),
      source: "migrated-v3",
      issues: ["SiteConfig v3 migrado em memória para v4."],
    };
  }
  const previousV2 = siteConfigV2Schema.safeParse(input);
  if (previousV2.success) {
    return {
      config: migrateLegacyConfig(previousV2.data),
      source: "migrated-v2",
      issues: ["SiteConfig v2 migrado em memória para v4."],
    };
  }
  const previousV1 = siteConfigV1Schema.safeParse(input);
  if (previousV1.success) {
    return {
      config: migrateLegacyConfig(previousV1.data),
      source: "migrated-v1",
      issues: ["SiteConfig v1 migrado em memória para v4."],
    };
  }
  return {
    config: defaultConfig(),
    source: "punctum-default",
    issues: parsed.error.issues.map((issue) =>
      [issue.path.join("."), issue.message].filter(Boolean).join(": "),
    ),
  };
}

export function parseSiteConfig(input: unknown): SiteConfig {
  return safeParseSiteConfig(input).config;
}

export function validateSiteConfig(input: unknown): SiteConfig {
  return siteConfigSchema.parse(input);
}
