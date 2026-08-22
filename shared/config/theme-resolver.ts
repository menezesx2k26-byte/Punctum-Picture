import {
  BACKGROUND_ASSET_REGISTRY,
  type BackgroundAssetId,
} from "./background-registry";
import { FONT_REGISTRY } from "./font-registry";
import { PALETTE_REGISTRY } from "./palette-registry";
import type { SiteConfig, ThemeConfig } from "./schema";
import { safeParseSiteConfig } from "./site-config";

export const THEME_CSS_VARIABLE_NAMES = [
  "--color-background",
  "--color-surface",
  "--color-surface-soft",
  "--color-foreground",
  "--color-muted",
  "--color-primary",
  "--color-primary-deep",
  "--color-secondary",
  "--color-accent",
  "--color-warm-accent",
  "--color-editorial-accent",
  "--color-mauve",
  "--color-mist",
  "--color-night",
  "--color-border",
  "--color-on-dark",
  "--color-on-dark-muted",
  "--font-heading",
  "--font-body",
  "--font-heading-weight",
  "--font-heading-tracking-display",
  "--font-heading-tracking-page",
  "--font-heading-tracking-card",
  "--font-size-hero",
  "--font-size-page-title",
  "--font-size-section-title",
  "--font-size-contact-title",
  "--font-size-album-title",
  "--font-size-card-title",
  "--font-size-body",
  "--line-height-body",
  "--radius-control",
  "--radius-surface",
  "--radius-card",
  "--radius-pill",
  "--space-section-block",
  "--space-section-inline",
  "--space-content-gap",
  "--container-max",
  "--container-feature-max",
  "--shadow-surface",
  "--shadow-floating",
  "--motion-duration-fast",
  "--motion-duration-base",
  "--motion-duration-slow",
  "--motion-duration-image",
  "--motion-duration-portrait",
  "--motion-duration-feature",
  "--motion-duration-filter",
  "--motion-distance",
  "--motion-image-scale",
  "--motion-image-scale-gentle",
  "--motion-hero-duration",
  "--image-filter",
  "--image-filter-hover",
  "--image-filter-manifesto",
  "--background-page",
  "--background-page-size",
  "--background-site",
  "--background-carousel",
  "--background-manifesto",
  "--background-contact",
  "--background-archive",
  "--background-footer",
  "--background-album-story",
  "--background-lightbox",
  "--collage-style",
] as const;

export type ThemeCssVariableName = (typeof THEME_CSS_VARIABLE_NAMES)[number];
export type ThemeCssVariables = Readonly<Record<ThemeCssVariableName, string>>;

const headingScales = {
  restrained: {
    hero: "clamp(3.5rem, 8.4vw, 8rem)",
    page: "clamp(3.4rem, 7.2vw, 7rem)",
    section: "clamp(2.8rem, 5.4vw, 5.8rem)",
    contact: "clamp(2.9rem, 6.2vw, 5.8rem)",
    album: "clamp(3.6rem, 8.6vw, 8rem)",
    card: "clamp(2rem, 3.8vw, 3.8rem)",
  },
  editorial: {
    hero: "clamp(3.9rem, 9.5vw, 9rem)",
    page: "clamp(3.7rem, 8.2vw, 8rem)",
    section: "clamp(3rem, 6vw, 6.4rem)",
    contact: "clamp(3rem, 7vw, 6.4rem)",
    album: "clamp(4rem, 9.8vw, 9rem)",
    card: "clamp(2.1rem, 4.2vw, 4.2rem)",
  },
  display: {
    hero: "clamp(4.2rem, 10.6vw, 10rem)",
    page: "clamp(4rem, 9vw, 9rem)",
    section: "clamp(3.2rem, 6.7vw, 7rem)",
    contact: "clamp(3.2rem, 8vw, 7rem)",
    album: "clamp(4.3rem, 11vw, 10rem)",
    card: "clamp(2.2rem, 4.7vw, 4.6rem)",
  },
} as const;

const bodyScales = {
  compact: { size: "0.84rem", lineHeight: "1.65" },
  comfortable: { size: "0.9rem", lineHeight: "1.8" },
} as const;

const headingWeights = { regular: "400", medium: "500", semibold: "600" } as const;
const headingTrackings = {
  tight: { display: "-0.055em", page: "-0.06em", card: "-0.045em" },
  normal: { display: "-0.025em", page: "-0.03em", card: "-0.02em" },
} as const;

const radiusStyles = {
  square: { control: "0", surface: "0", card: "0", pill: "999px" },
  soft: { control: "0.35rem", surface: "0.7rem", card: "0.4rem", pill: "999px" },
  rounded: { control: "0.75rem", surface: "1.25rem", card: "0.9rem", pill: "999px" },
} as const;

const spacingStyles = {
  compact: {
    sectionBlock: "clamp(3.5rem, 8vw, 7rem)",
    sectionInline: "clamp(1rem, 3vw, 3rem)",
    contentGap: "clamp(1.5rem, 4vw, 4rem)",
  },
  balanced: {
    sectionBlock: "clamp(4.5rem, 10vw, 9rem)",
    sectionInline: "clamp(1rem, 4vw, 4rem)",
    contentGap: "clamp(2rem, 6vw, 7rem)",
  },
  spacious: {
    sectionBlock: "clamp(5.5rem, 13vw, 12rem)",
    sectionInline: "clamp(1rem, 5vw, 5rem)",
    contentGap: "clamp(2.5rem, 8vw, 9rem)",
  },
} as const;

const containerStyles = {
  narrow: { standard: "72rem", feature: "78rem" },
  standard: { standard: "82rem", feature: "88rem" },
  wide: { standard: "90rem", feature: "94rem" },
} as const;

const shadowStyles = {
  none: { surface: "none", floating: "none" },
  soft: {
    surface: "0 1.4rem 4rem rgba(89, 31, 111, 0.09)",
    floating: "0 0.9rem 2.6rem rgba(72, 20, 91, 0.2)",
  },
  graphic: {
    surface: "0.8rem 0.8rem 0 rgba(77, 18, 108, 0.18)",
    floating: "0.5rem 0.7rem 0 rgba(77, 18, 108, 0.24)",
  },
} as const;

const motionStyles = {
  none: {
    fast: "0ms",
    base: "0ms",
    slow: "0ms",
    image: "0ms",
    portrait: "0ms",
    feature: "0ms",
    filter: "0ms",
    distance: "0px",
    imageScale: "1",
    imageScaleGentle: "1",
    heroDuration: "0ms",
  },
  subtle: {
    fast: "180ms",
    base: "220ms",
    slow: "700ms",
    image: "900ms",
    portrait: "800ms",
    feature: "1s",
    filter: "300ms",
    distance: "3px",
    imageScale: "1.035",
    imageScaleGentle: "1.025",
    heroDuration: "12s",
  },
  expressive: {
    fast: "220ms",
    base: "320ms",
    slow: "900ms",
    image: "1.1s",
    portrait: "1s",
    feature: "1.2s",
    filter: "360ms",
    distance: "5px",
    imageScale: "1.055",
    imageScaleGentle: "1.04",
    heroDuration: "16s",
  },
} as const;

const imageStyles = {
  natural: {
    filter: "none",
    hover: "saturate(1.07)",
    manifesto: "saturate(0.88) contrast(1.04)",
  },
  soft: {
    filter: "saturate(0.9) contrast(0.97)",
    hover: "saturate(0.96) contrast(0.99)",
    manifesto: "saturate(0.8) contrast(0.98)",
  },
  contrast: {
    filter: "saturate(1.04) contrast(1.08)",
    hover: "saturate(1.12) contrast(1.11)",
    manifesto: "saturate(0.96) contrast(1.12)",
  },
  monochrome: {
    filter: "grayscale(1) contrast(1.04)",
    hover: "grayscale(1) contrast(1.1)",
    manifesto: "grayscale(1) contrast(1.06)",
  },
} as const;

function resolveBackground(theme: ThemeConfig) {
  switch (theme.background.style) {
    case "plain":
      return {
        page: "var(--color-background)",
        pageSize: "auto",
        site: "transparent",
      };
    case "editorial-texture":
      return {
        page:
          "radial-gradient(color-mix(in srgb, var(--color-primary) 12%, transparent) 0.55px, transparent 0.55px), var(--color-background)",
        pageSize: "7px 7px",
        site: "color-mix(in srgb, var(--color-background) 94%, transparent)",
      };
    case "soft-image": {
      const source = theme.background.imageId
        ? `/media/${theme.background.imageId}/hero`
        : BACKGROUND_ASSET_REGISTRY[theme.background.assetId as BackgroundAssetId].path;
      const overlay = {
        soft: ["rgba(35, 15, 43, 0.7)", "rgba(35, 15, 43, 0.82)", "90%"],
        present: ["rgba(35, 15, 43, 0.46)", "rgba(35, 15, 43, 0.64)", "82%"],
        dark: ["rgba(20, 8, 26, 0.82)", "rgba(20, 8, 26, 0.9)", "92%"],
        light: ["rgba(248, 240, 250, 0.58)", "rgba(248, 240, 250, 0.76)", "86%"],
      }[theme.background.treatment];
      return {
        page: `linear-gradient(${overlay[0]}, ${overlay[1]}), url("${source}") center / cover fixed`,
        pageSize: "cover",
        site: `color-mix(in srgb, var(--color-background) ${overlay[2]}, transparent)`,
      };
    }
    case "organic-glow":
      return {
        page:
          "radial-gradient(ellipse at 9% 12%, color-mix(in srgb, var(--color-mauve) 28%, transparent), transparent 34rem), radial-gradient(ellipse at 92% 48%, color-mix(in srgb, var(--color-secondary) 18%, transparent), transparent 42rem), var(--color-background)",
        pageSize: "auto",
        site:
          "radial-gradient(ellipse at 4% 24%, color-mix(in srgb, var(--color-mauve) 24%, transparent), transparent 36rem), radial-gradient(ellipse at 96% 72%, color-mix(in srgb, var(--color-secondary) 16%, transparent), transparent 42rem)",
      };
  }
}

export type ResolvedSiteTheme = {
  config: SiteConfig;
  cssVariables: ThemeCssVariables;
  didFallback: boolean;
  issues: readonly string[];
};

export function resolveSiteTheme(input: unknown): ResolvedSiteTheme {
  const parsed = safeParseSiteConfig(input);
  const { theme } = parsed.config;
  const palette = PALETTE_REGISTRY[theme.palette.id];
  const headingFont = FONT_REGISTRY[theme.typography.headingFamily];
  const bodyFont = FONT_REGISTRY[theme.typography.bodyFamily];
  const headingScale = headingScales[theme.typography.headingScale];
  const bodyScale = bodyScales[theme.typography.bodyScale];
  const headingTracking = headingTrackings[theme.typography.headingTracking];
  const radius = radiusStyles[theme.shape.radius];
  const spacing = spacingStyles[theme.spacing.density];
  const container = containerStyles[theme.container.width];
  const shadow = shadowStyles[theme.shadow.style];
  const motion = motionStyles[theme.motion.intensity];
  const image = imageStyles[theme.image.treatment];
  const background = resolveBackground(theme);

  const cssVariables: ThemeCssVariables = {
    "--color-background": palette.colors.background,
    "--color-surface": palette.colors.surface,
    "--color-surface-soft": palette.colors.surfaceSoft,
    "--color-foreground": palette.colors.foreground,
    "--color-muted": palette.colors.muted,
    "--color-primary": palette.colors.primary,
    "--color-primary-deep": palette.colors.primaryDeep,
    "--color-secondary": palette.colors.secondary,
    "--color-accent": palette.colors.accent,
    "--color-warm-accent": palette.colors.warmAccent,
    "--color-editorial-accent": palette.colors.editorialAccent,
    "--color-mauve": palette.colors.mauve,
    "--color-mist": palette.colors.mist,
    "--color-night": palette.colors.night,
    "--color-border": palette.colors.border,
    "--color-on-dark": palette.colors.onDark,
    "--color-on-dark-muted": palette.colors.onDarkMuted,
    "--font-heading": headingFont.cssStack,
    "--font-body": bodyFont.cssStack,
    "--font-heading-weight": headingWeights[theme.typography.headingWeight],
    "--font-heading-tracking-display": headingTracking.display,
    "--font-heading-tracking-page": headingTracking.page,
    "--font-heading-tracking-card": headingTracking.card,
    "--font-size-hero": headingScale.hero,
    "--font-size-page-title": headingScale.page,
    "--font-size-section-title": headingScale.section,
    "--font-size-contact-title": headingScale.contact,
    "--font-size-album-title": headingScale.album,
    "--font-size-card-title": headingScale.card,
    "--font-size-body": bodyScale.size,
    "--line-height-body": bodyScale.lineHeight,
    "--radius-control": radius.control,
    "--radius-surface": radius.surface,
    "--radius-card": radius.card,
    "--radius-pill": radius.pill,
    "--space-section-block": spacing.sectionBlock,
    "--space-section-inline": spacing.sectionInline,
    "--space-content-gap": spacing.contentGap,
    "--container-max": container.standard,
    "--container-feature-max": container.feature,
    "--shadow-surface": shadow.surface,
    "--shadow-floating": shadow.floating,
    "--motion-duration-fast": motion.fast,
    "--motion-duration-base": motion.base,
    "--motion-duration-slow": motion.slow,
    "--motion-duration-image": motion.image,
    "--motion-duration-portrait": motion.portrait,
    "--motion-duration-feature": motion.feature,
    "--motion-duration-filter": motion.filter,
    "--motion-distance": motion.distance,
    "--motion-image-scale": motion.imageScale,
    "--motion-image-scale-gentle": motion.imageScaleGentle,
    "--motion-hero-duration": motion.heroDuration,
    "--image-filter": image.filter,
    "--image-filter-hover": image.hover,
    "--image-filter-manifesto": image.manifesto,
    "--background-page": background.page,
    "--background-page-size": background.pageSize,
    "--background-site": background.site,
    "--background-carousel": palette.surfaces.carousel,
    "--background-manifesto": palette.surfaces.manifesto,
    "--background-contact": palette.surfaces.contact,
    "--background-archive": palette.surfaces.archive,
    "--background-footer": palette.surfaces.footer,
    "--background-album-story": palette.surfaces.albumStory,
    "--background-lightbox": palette.surfaces.lightbox,
    "--collage-style": "section-driven",
  };

  return {
    config: parsed.config,
    cssVariables,
    didFallback: parsed.source === "punctum-default",
    issues: parsed.issues,
  };
}
