export const HOME_SECTION_VARIANTS = {
  hero: ["cinematic", "editorial", "fullscreen", "split"],
  statement: ["manifesto", "centered"],
  "photo-reel": ["horizontal", "filmstrip", "patch"],
  "featured-work": ["editorial-grid", "gallery", "collage"],
  about: ["portrait", "side-portrait", "centered", "editorial"],
  contact: ["split-form", "minimal"],
} as const;

export const SECTION_SURFACE_IDS = [
  "default",
  "light",
  "dark",
  "accent",
  "photo",
] as const;

export const SECTION_DENSITY_IDS = ["compact", "balanced", "spacious"] as const;
export const SECTION_ALIGNMENT_IDS = ["start", "center"] as const;

export type SectionSurfaceId = (typeof SECTION_SURFACE_IDS)[number];
export type SectionDensityId = (typeof SECTION_DENSITY_IDS)[number];
export type SectionAlignmentId = (typeof SECTION_ALIGNMENT_IDS)[number];

export type SectionType = keyof typeof HOME_SECTION_VARIANTS;

export type SectionVariantByType = {
  [Type in SectionType]: (typeof HOME_SECTION_VARIANTS)[Type][number];
};

export type SectionVariantId = SectionVariantByType[SectionType];

export type SectionDefinition<Type extends SectionType = SectionType> = {
  type: Type;
  label: string;
  description: string;
  canonicalId: string;
  required: boolean;
  allowMultiple: boolean;
  futureCanRepeat: boolean;
  defaultVariant: SectionVariantByType[Type];
  allowedVariants: readonly SectionVariantByType[Type][];
  variants: Readonly<
    Record<
      SectionVariantByType[Type],
      { label: string; description: string }
    >
  >;
  allowedSurfaces: readonly SectionSurfaceId[];
};

export const SECTION_TYPES = Object.freeze(
  Object.keys(HOME_SECTION_VARIANTS) as SectionType[],
);

export const SECTION_REGISTRY = {
  hero: {
    type: "hero",
    label: "Capa",
    description: "Abre o site com a fotografia e a frase principal.",
    canonicalId: "home-hero",
    required: true,
    allowMultiple: false,
    futureCanRepeat: false,
    defaultVariant: "cinematic",
    allowedVariants: HOME_SECTION_VARIANTS.hero,
    variants: {
      cinematic: { label: "Original", description: "Fotografia ampla e título em primeiro plano." },
      editorial: { label: "Editorial", description: "Texto com mais respiro e imagem como abertura de revista." },
      fullscreen: { label: "Tela cheia", description: "Uma entrada imersiva, silenciosa e fotográfica." },
      split: { label: "Dividida", description: "Imagem e palavras ocupam lados complementares." },
    },
    allowedSurfaces: ["default", "dark", "photo"],
  },
  statement: {
    type: "statement",
    label: "Frase de abertura",
    description: "Apresenta o olhar e a intenção do seu trabalho.",
    canonicalId: "home-statement",
    required: false,
    allowMultiple: false,
    futureCanRepeat: true,
    defaultVariant: "manifesto",
    allowedVariants: HOME_SECTION_VARIANTS.statement,
    variants: {
      manifesto: { label: "Manifesto", description: "Frase e texto em tensão editorial." },
      centered: { label: "Centralizada", description: "Uma pausa serena com a frase no centro." },
    },
    allowedSurfaces: ["default", "light", "dark", "accent"],
  },
  "photo-reel": {
    type: "photo-reel",
    label: "Percurso de fotografias",
    description: "Convida a percorrer uma sequência viva do acervo.",
    canonicalId: "home-photo-reel",
    required: false,
    allowMultiple: false,
    futureCanRepeat: true,
    defaultVariant: "horizontal",
    allowedVariants: HOME_SECTION_VARIANTS["photo-reel"],
    variants: {
      horizontal: { label: "Original", description: "Percurso horizontal com movimento suave." },
      filmstrip: { label: "Filme", description: "Uma sequência contínua, densa e cinematográfica." },
      patch: { label: "Patch", description: "Fotografias em uma composição editorial assimétrica." },
    },
    allowedSurfaces: ["default", "light", "dark", "accent"],
  },
  "featured-work": {
    type: "featured-work",
    label: "Trabalhos em destaque",
    description: "Mostra alguns dos seus ensaios principais.",
    canonicalId: "home-featured-work",
    required: false,
    allowMultiple: false,
    futureCanRepeat: true,
    defaultVariant: "editorial-grid",
    allowedVariants: HOME_SECTION_VARIANTS["featured-work"],
    variants: {
      "editorial-grid": { label: "Original", description: "Projetos em ritmo editorial alternado." },
      gallery: { label: "Galeria", description: "Capas grandes, limpas e silenciosas." },
      collage: { label: "Colagem editorial", description: "Projetos sobrepostos em composição controlada." },
    },
    allowedSurfaces: ["default", "light", "dark", "accent"],
  },
  about: {
    type: "about",
    label: "Sobre mim",
    description: "Conta quem você é e como se aproxima de cada história.",
    canonicalId: "home-about",
    required: false,
    allowMultiple: false,
    futureCanRepeat: false,
    defaultVariant: "portrait",
    allowedVariants: HOME_SECTION_VARIANTS.about,
    variants: {
      portrait: { label: "Original", description: "Retrato e manifesto em duas presenças equilibradas." },
      "side-portrait": { label: "Retrato lateral", description: "Imagem mais estreita e texto com ritmo de perfil." },
      centered: { label: "Centralizada", description: "Apresentação íntima e concentrada." },
      editorial: { label: "Editorial", description: "Retrato dominante e texto em composição de revista." },
    },
    allowedSurfaces: ["default", "light", "dark", "accent", "photo"],
  },
  contact: {
    type: "contact",
    label: "Contato",
    description: "Abre o caminho para pedidos e novas conversas.",
    canonicalId: "home-contact",
    required: false,
    allowMultiple: false,
    futureCanRepeat: false,
    defaultVariant: "split-form",
    allowedVariants: HOME_SECTION_VARIANTS.contact,
    variants: {
      "split-form": { label: "Original", description: "Convite e formulário lado a lado." },
      minimal: { label: "Essencial", description: "Fechamento mais compacto e direto." },
    },
    allowedSurfaces: ["default", "light", "dark", "accent", "photo"],
  },
} as const satisfies {
  [Type in SectionType]: SectionDefinition<Type>;
};

export function isSectionType(value: string): value is SectionType {
  return Object.prototype.hasOwnProperty.call(SECTION_REGISTRY, value);
}

export function isAllowedSectionVariant<Type extends SectionType>(
  type: Type,
  variant: string,
): variant is SectionVariantByType[Type] {
  return (SECTION_REGISTRY[type].allowedVariants as readonly string[]).includes(
    variant,
  );
}
