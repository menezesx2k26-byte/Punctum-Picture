const PUBLIC_VISUAL_ASSETS = {
  logo: {
    src: "/logo-punctum-transparent.png",
    alt: "",
    width: 1254,
    height: 1254,
  },
  hero: {
    src: "/photos/hero-maria-helena-2026-08-24.webp",
    alt: "Maria Helena fotografando nas arquibancadas de um estádio",
    width: 1536,
    height: 1024,
  },
} as const;

export type PublicVisualAssetRole = keyof typeof PUBLIC_VISUAL_ASSETS;

export function getPublicVisualAsset<Role extends PublicVisualAssetRole>(
  role: Role,
): (typeof PUBLIC_VISUAL_ASSETS)[Role] {
  return PUBLIC_VISUAL_ASSETS[role];
}

export function getSiteHeaderClassName(dark: boolean): string {
  return dark
    ? "site-header dark site-header-transparent"
    : "site-header";
}
