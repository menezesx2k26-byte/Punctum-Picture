const PUBLIC_VISUAL_ASSETS = {
  logo: {
    src: "/logo-punctum-transparent.png",
    alt: "",
    width: 1254,
    height: 1254,
  },
  hero: {
    src: "/photos/p001.jpg",
    alt: "Maria Helena fotografando no estádio",
    width: 1024,
    height: 1536,
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
