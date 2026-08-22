export const BACKGROUND_STYLE_IDS = [
  "plain",
  "organic-glow",
  "soft-image",
  "editorial-texture",
] as const;

export const BACKGROUND_ASSET_IDS = ["manifesto-portrait"] as const;

export type BackgroundStyleId = (typeof BACKGROUND_STYLE_IDS)[number];
export type BackgroundAssetId = (typeof BACKGROUND_ASSET_IDS)[number];

export const BACKGROUND_STYLE_REGISTRY = {
  plain: {
    id: "plain",
    label: "Fundo limpo",
    description: "Uma superfície contínua e discreta.",
  },
  "organic-glow": {
    id: "organic-glow",
    label: "Luz orgânica",
    description: "Névoas violetas suaves que preservam o protagonismo das fotos.",
  },
  "soft-image": {
    id: "soft-image",
    label: "Imagem suave",
    description: "Uma fotografia aprovada aparece de forma atmosférica ao fundo.",
  },
  "editorial-texture": {
    id: "editorial-texture",
    label: "Textura editorial",
    description: "Uma trama fina e discreta dá materialidade às superfícies.",
  },
} as const satisfies Record<
  BackgroundStyleId,
  { id: BackgroundStyleId; label: string; description: string }
>;

export const BACKGROUND_ASSET_REGISTRY = {
  "manifesto-portrait": {
    id: "manifesto-portrait",
    label: "Retrato do manifesto",
    path: "/photos/p061.jpg",
  },
} as const satisfies Record<
  BackgroundAssetId,
  { id: BackgroundAssetId; label: string; path: `/${string}` }
>;

