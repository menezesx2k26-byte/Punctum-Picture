import { describe, expect, it } from "vitest";
import { siteThemeRootProps } from "../../app/lib/site-theme";
import {
  PUNCTUM_DEFAULT_SITE_CONFIG,
  THEME_CSS_VARIABLE_NAMES,
  applyFontPair,
  resolveSiteTheme,
} from "../../shared/config";

function cloneDefault(): Record<string, unknown> {
  return JSON.parse(JSON.stringify(PUNCTUM_DEFAULT_SITE_CONFIG)) as Record<
    string,
    unknown
  >;
}

describe("ThemeResolver", () => {
  it("resolve o preset atual para tokens semânticos determinísticos", () => {
    const first = resolveSiteTheme(PUNCTUM_DEFAULT_SITE_CONFIG);
    const second = resolveSiteTheme(PUNCTUM_DEFAULT_SITE_CONFIG);

    expect(first).toEqual(second);
    expect(first.didFallback).toBe(false);
    expect(Object.keys(first.cssVariables).sort()).toEqual(
      [...THEME_CSS_VARIABLE_NAMES].sort(),
    );
    expect(first.cssVariables["--color-background"]).toBe("#f8f0fa");
    expect(first.cssVariables["--font-heading"]).toContain("Cormorant Garamond");
    expect(first.cssVariables["--background-carousel"]).toContain(
      "linear-gradient",
    );
    expect(first.cssVariables["--collage-style"]).toBe("section-driven");
  });

  it("não converte valores livres em CSS e cai no default seguro", () => {
    const invalid = cloneDefault();
    const theme = invalid.theme as Record<string, unknown>;
    theme.palette = {
      id: "red;position:fixed;inset:0",
      mode: "light",
    };
    invalid.customCss = "url(https://example.com/evil.css)";

    const resolved = resolveSiteTheme(invalid);
    const emitted = Object.values(resolved.cssVariables).join(" ");

    expect(resolved.didFallback).toBe(true);
    expect(resolved.config).toEqual(PUNCTUM_DEFAULT_SITE_CONFIG);
    expect(emitted).not.toContain("position:fixed");
    expect(emitted).not.toContain("evil.css");
  });

  it("aceita fundo fotográfico somente por asset interno aprovado", () => {
    const input = cloneDefault();
    const theme = input.theme as Record<string, unknown>;
    theme.background = {
      style: "soft-image",
      assetId: "manifesto-portrait",
      imageId: null,
      treatment: "soft",
    };

    const resolved = resolveSiteTheme(input);
    expect(resolved.didFallback).toBe(false);
    expect(resolved.cssVariables["--background-page"]).toContain(
      'url("/photos/p061.jpg")',
    );
    expect(resolved.cssVariables["--background-page"]).not.toContain("http");
  });

  it("transforma os pares tipográficos em tokens allowlisted", () => {
    const modern = applyFontPair(PUNCTUM_DEFAULT_SITE_CONFIG, "moderna");
    const resolved = resolveSiteTheme(modern);
    expect(resolved.didFallback).toBe(false);
    expect(resolved.cssVariables["--font-heading"]).toContain("Manrope");
    expect(resolved.cssVariables["--font-body"]).toContain("Manrope");

    const classic = resolveSiteTheme(
      applyFontPair(PUNCTUM_DEFAULT_SITE_CONFIG, "classica"),
    );
    expect(classic.cssVariables["--font-heading"]).toContain("Georgia");
  });
});

describe("wrapper público de identidade", () => {
  it("aplica o default e os tokens no conjunto único de props do wrapper", () => {
    const props = siteThemeRootProps();

    expect(props["data-theme-preset"]).toBe("punctum-default");
    expect(props["data-theme-background"]).toBe("organic-glow");
    expect(props.style["--color-background" as keyof typeof props.style]).toBe(
      "#f8f0fa",
    );
    expect("data-theme-fallback" in props).toBe(false);
  });

  it("marca fallback seguro quando recebe configuração inválida", () => {
    const props = siteThemeRootProps({ schemaVersion: 999 });

    expect(props["data-theme-fallback"]).toBe("true");
    expect(props.style["--color-primary" as keyof typeof props.style]).toBe(
      "#7a25b5",
    );
  });
});
