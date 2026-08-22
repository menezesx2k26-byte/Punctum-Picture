export const FONT_FAMILY_IDS = [
  "cormorant-garamond",
  "bodoni-moda",
  "playfair-display",
  "dm-serif-display",
  "instrument-serif",
  "newsreader",
  "fraunces",
  "lora",
  "eb-garamond",
  "libre-baskerville",
  "crimson-pro",
  "spectral",
  "manrope",
  "inter",
  "plus-jakarta-sans",
  "dm-sans",
  "outfit",
  "urbanist",
  "jost",
  "albert-sans",
  "league-spartan",
  "archivo-black",
  "bebas-neue",
  "unbounded",
  "space-grotesk",
  "sora",
  "syne",
  "figtree",
  "nunito-sans",
  "karla",
  "rubik",
  "work-sans",
  "caveat",
  "sacramento",
  "allura",
  "parisienne",
  "bricolage-grotesque",
  "gloock",
  "yeseva-one",
  "italiana",
  "georgia-editorial",
  "system-sans",
] as const;

export const HEADING_FONT_FAMILY_IDS = [
  "cormorant-garamond",
  "bodoni-moda",
  "playfair-display",
  "dm-serif-display",
  "instrument-serif",
  "newsreader",
  "fraunces",
  "lora",
  "eb-garamond",
  "libre-baskerville",
  "crimson-pro",
  "spectral",
  "manrope",
  "inter",
  "plus-jakarta-sans",
  "dm-sans",
  "outfit",
  "urbanist",
  "jost",
  "albert-sans",
  "league-spartan",
  "archivo-black",
  "bebas-neue",
  "unbounded",
  "space-grotesk",
  "sora",
  "syne",
  "figtree",
  "nunito-sans",
  "karla",
  "rubik",
  "work-sans",
  "caveat",
  "sacramento",
  "allura",
  "parisienne",
  "bricolage-grotesque",
  "gloock",
  "yeseva-one",
  "italiana",
  "georgia-editorial",
] as const;

export const BODY_FONT_FAMILY_IDS = [
  "newsreader",
  "fraunces",
  "lora",
  "eb-garamond",
  "libre-baskerville",
  "crimson-pro",
  "spectral",
  "manrope",
  "inter",
  "plus-jakarta-sans",
  "dm-sans",
  "outfit",
  "urbanist",
  "jost",
  "albert-sans",
  "space-grotesk",
  "sora",
  "figtree",
  "nunito-sans",
  "karla",
  "rubik",
  "work-sans",
  "bricolage-grotesque",
  "georgia-editorial",
  "system-sans",
] as const;

export type FontFamilyId = (typeof FONT_FAMILY_IDS)[number];
export type HeadingFontFamilyId = (typeof HEADING_FONT_FAMILY_IDS)[number];
export type BodyFontFamilyId = (typeof BODY_FONT_FAMILY_IDS)[number];
export type FontCategoryId =
  | "elegante"
  | "editorial"
  | "classica"
  | "moderna"
  | "minimalista"
  | "marcante"
  | "contemporanea"
  | "aconchegante"
  | "escrita-a-mao"
  | "artistica";

export type FontRegistryEntry = {
  id: FontFamilyId;
  familyName: string;
  label: string;
  description: string;
  category: FontCategoryId;
  kind: "serif" | "sans" | "script" | "display";
  source: "next-font" | "local" | "system";
  cssStack: string;
  availableWeights: readonly number[];
  allowedRoles: readonly ("heading" | "body")[];
};

type CatalogEntry = Omit<FontRegistryEntry, "cssStack"> & {
  fallback: "serif" | "sans" | "script";
};

const LOCAL_FONT_CATALOG = [
  { id: "cormorant-garamond", familyName: "Cormorant Garamond", label: "Cormorant", description: "Delicada, editorial e expressiva.", category: "elegante", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading"], fallback: "serif" },
  { id: "bodoni-moda", familyName: "Bodoni Moda", label: "Bodoni", description: "Elegância de alto contraste e presença.", category: "elegante", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading"], fallback: "serif" },
  { id: "playfair-display", familyName: "Playfair Display", label: "Playfair", description: "Clássica com um gesto editorial marcante.", category: "elegante", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading"], fallback: "serif" },
  { id: "dm-serif-display", familyName: "DM Serif Display", label: "DM Serif", description: "Serifa generosa para frases curtas.", category: "elegante", kind: "display", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "serif" },
  { id: "instrument-serif", familyName: "Instrument Serif", label: "Instrument", description: "Editorial, fluida e com personalidade.", category: "editorial", kind: "display", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "serif" },
  { id: "newsreader", familyName: "Newsreader", label: "Newsreader", description: "Leitura calma com espírito de revista.", category: "editorial", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "serif" },
  { id: "fraunces", familyName: "Fraunces", label: "Fraunces", description: "Expressiva, calorosa e contemporânea.", category: "editorial", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "serif" },
  { id: "lora", familyName: "Lora", label: "Lora", description: "Literária sem perder leveza na tela.", category: "editorial", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "serif" },
  { id: "eb-garamond", familyName: "EB Garamond", label: "Garamond", description: "Tradição editorial e ritmo humano.", category: "classica", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "serif" },
  { id: "libre-baskerville", familyName: "Libre Baskerville", label: "Baskerville", description: "Clássica, firme e muito legível.", category: "classica", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "serif" },
  { id: "crimson-pro", familyName: "Crimson Pro", label: "Crimson", description: "Serifa suave para textos e títulos.", category: "classica", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "serif" },
  { id: "spectral", familyName: "Spectral", label: "Spectral", description: "Séria, refinada e confortável de ler.", category: "classica", kind: "serif", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "serif" },
  { id: "manrope", familyName: "Manrope", label: "Manrope", description: "Limpa, contemporânea e muito legível.", category: "moderna", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "inter", familyName: "Inter", label: "Inter", description: "Clara e neutra para qualquer tamanho.", category: "moderna", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "plus-jakarta-sans", familyName: "Plus Jakarta Sans", label: "Jakarta", description: "Moderna com curvas acolhedoras.", category: "moderna", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "dm-sans", familyName: "DM Sans", label: "DM Sans", description: "Direta, leve e contemporânea.", category: "moderna", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "outfit", familyName: "Outfit", label: "Outfit", description: "Geométrica e minimalista.", category: "minimalista", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "urbanist", familyName: "Urbanist", label: "Urbanist", description: "Minimalismo com um toque urbano.", category: "minimalista", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "jost", familyName: "Jost", label: "Jost", description: "Geométrica, calma e organizada.", category: "minimalista", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "albert-sans", familyName: "Albert Sans", label: "Albert", description: "Discreta, aberta e funcional.", category: "minimalista", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "league-spartan", familyName: "League Spartan", label: "Spartan", description: "Títulos firmes e de grande impacto.", category: "marcante", kind: "display", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading"], fallback: "sans" },
  { id: "archivo-black", familyName: "Archivo Black", label: "Archivo Black", description: "Peso visual forte para poucas palavras.", category: "marcante", kind: "display", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "sans" },
  { id: "bebas-neue", familyName: "Bebas Neue", label: "Bebas", description: "Alta, condensada e cinematográfica.", category: "marcante", kind: "display", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "sans" },
  { id: "unbounded", familyName: "Unbounded", label: "Unbounded", description: "Futurista e impossível de ignorar.", category: "marcante", kind: "display", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading"], fallback: "sans" },
  { id: "space-grotesk", familyName: "Space Grotesk", label: "Space Grotesk", description: "Contemporânea com tensão editorial.", category: "contemporanea", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "sora", familyName: "Sora", label: "Sora", description: "Digital, precisa e amigável.", category: "contemporanea", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "syne", familyName: "Syne", label: "Syne", description: "Artística e contemporânea para títulos.", category: "contemporanea", kind: "display", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading"], fallback: "sans" },
  { id: "figtree", familyName: "Figtree", label: "Figtree", description: "Natural, atual e muito clara.", category: "contemporanea", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "nunito-sans", familyName: "Nunito Sans", label: "Nunito", description: "Acolhedora sem ficar infantil.", category: "aconchegante", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "karla", familyName: "Karla", label: "Karla", description: "Humana, simples e espontânea.", category: "aconchegante", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "rubik", familyName: "Rubik", label: "Rubik", description: "Curvas suaves e presença amigável.", category: "aconchegante", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "work-sans", familyName: "Work Sans", label: "Work Sans", description: "Leve, prática e próxima.", category: "aconchegante", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "caveat", familyName: "Caveat", label: "Caveat", description: "Gesto manuscrito espontâneo.", category: "escrita-a-mao", kind: "script", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading"], fallback: "script" },
  { id: "sacramento", familyName: "Sacramento", label: "Sacramento", description: "Assinatura delicada e contínua.", category: "escrita-a-mao", kind: "script", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "script" },
  { id: "allura", familyName: "Allura", label: "Allura", description: "Caligrafia leve e elegante.", category: "escrita-a-mao", kind: "script", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "script" },
  { id: "parisienne", familyName: "Parisienne", label: "Parisienne", description: "Manuscrita romântica e refinada.", category: "escrita-a-mao", kind: "script", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "script" },
  { id: "bricolage-grotesque", familyName: "Bricolage Grotesque", label: "Bricolage", description: "Criativa, viva e surpreendente.", category: "artistica", kind: "sans", source: "local", availableWeights: [400, 500, 600, 700], allowedRoles: ["heading", "body"], fallback: "sans" },
  { id: "gloock", familyName: "Gloock", label: "Gloock", description: "Serifa artística de alto contraste.", category: "artistica", kind: "display", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "serif" },
  { id: "yeseva-one", familyName: "Yeseva One", label: "Yeseva", description: "Decorativa sem perder estrutura.", category: "artistica", kind: "display", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "serif" },
  { id: "italiana", familyName: "Italiana", label: "Italiana", description: "Fina, teatral e sofisticada.", category: "artistica", kind: "display", source: "local", availableWeights: [400], allowedRoles: ["heading"], fallback: "serif" },
] as const satisfies readonly CatalogEntry[];

const systemEntries = [
  { id: "georgia-editorial", familyName: "Georgia", label: "Georgia", description: "Clássica e disponível em praticamente todos os dispositivos.", category: "classica", kind: "serif", source: "system", cssStack: 'Georgia, "Times New Roman", serif', availableWeights: [400, 700], allowedRoles: ["heading", "body"] },
  { id: "system-sans", familyName: "Sistema", label: "Essencial", description: "A escrita neutra do próprio dispositivo.", category: "minimalista", kind: "sans", source: "system", cssStack: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', availableWeights: [400, 500, 600, 700], allowedRoles: ["body"] },
] as const satisfies readonly FontRegistryEntry[];

function localCssStack(entry: CatalogEntry): string {
  const fallback =
    entry.fallback === "serif"
      ? 'Georgia, "Times New Roman", serif'
      : entry.fallback === "script"
        ? '"Segoe Print", "Bradley Hand", cursive'
        : 'Arial, Helvetica, sans-serif';
  return `"${entry.familyName}", ${fallback}`;
}

const registryEntries: FontRegistryEntry[] = [
  ...LOCAL_FONT_CATALOG.map((entry) => ({
    ...entry,
    cssStack: localCssStack(entry),
  })),
  ...systemEntries,
];

export const FONT_REGISTRY = Object.freeze(
  Object.fromEntries(registryEntries.map((entry) => [entry.id, entry])) as Record<
    FontFamilyId,
    FontRegistryEntry
  >,
);

export const FONT_CATEGORY_LABELS: Readonly<Record<FontCategoryId, string>> = {
  elegante: "Elegantes",
  editorial: "Editoriais",
  classica: "Clássicas",
  moderna: "Modernas",
  minimalista: "Minimalistas",
  marcante: "Marcantes",
  contemporanea: "Contemporâneas",
  aconchegante: "Aconchegantes",
  "escrita-a-mao": "Escritas à mão",
  artistica: "Artísticas",
};
