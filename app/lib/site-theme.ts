import type { CSSProperties } from "react";
import {
  PUNCTUM_DEFAULT_SITE_CONFIG,
  resolveSiteTheme,
} from "../../shared/config";

export function siteThemeRootProps(
  config: unknown = PUNCTUM_DEFAULT_SITE_CONFIG,
) {
  const resolved = resolveSiteTheme(config);
  return {
    style: resolved.cssVariables as CSSProperties,
    "data-theme-preset": resolved.config.identity.sourcePresetId,
    "data-theme-palette": resolved.config.theme.palette.id,
    "data-theme-mode": resolved.config.theme.palette.mode,
    "data-theme-motion": resolved.config.theme.motion.intensity,
    "data-theme-image": resolved.config.theme.image.treatment,
    "data-theme-background": resolved.config.theme.background.style,
    ...(resolved.didFallback ? { "data-theme-fallback": "true" } : {}),
  };
}
