import type { SiteConfig } from "./schema";
import type { BodyFontFamilyId, HeadingFontFamilyId } from "./font-registry";

export const FONT_PAIR_IDS = [
  "elegante",
  "editorial",
  "delicada",
  "moderna",
  "classica",
  "marcante",
  "acolhedora",
  "manuscrita",
] as const;
export type FontPairId = (typeof FONT_PAIR_IDS)[number];

export type FontPair = {
  id: FontPairId;
  label: string;
  description: string;
  sample: string;
  headingFamily: HeadingFontFamilyId;
  bodyFamily: BodyFontFamilyId;
  headingScale: SiteConfig["theme"]["typography"]["headingScale"];
  headingWeight: SiteConfig["theme"]["typography"]["headingWeight"];
  headingTracking: SiteConfig["theme"]["typography"]["headingTracking"];
};

export const FONT_PAIR_REGISTRY: Readonly<Record<FontPairId, FontPair>> = {
  elegante: {
    id: "elegante",
    label: "Elegante",
    description: "Delicada nos títulos e limpa nos textos.",
    sample: "Histórias que permanecem",
    headingFamily: "cormorant-garamond",
    bodyFamily: "manrope",
    headingScale: "display",
    headingWeight: "regular",
    headingTracking: "tight",
  },
  editorial: {
    id: "editorial",
    label: "Editorial",
    description: "Refinada, calma e com ritmo de revista.",
    sample: "Histórias que permanecem",
    headingFamily: "newsreader",
    bodyFamily: "manrope",
    headingScale: "display",
    headingWeight: "regular",
    headingTracking: "normal",
  },
  delicada: {
    id: "delicada",
    label: "Delicada",
    description: "Fina, luminosa e muito sensível.",
    sample: "Histórias que permanecem",
    headingFamily: "italiana",
    bodyFamily: "manrope",
    headingScale: "editorial",
    headingWeight: "regular",
    headingTracking: "normal",
  },
  moderna: {
    id: "moderna",
    label: "Moderna",
    description: "Direta, contemporânea e muito clara.",
    sample: "Histórias que permanecem",
    headingFamily: "manrope",
    bodyFamily: "manrope",
    headingScale: "editorial",
    headingWeight: "medium",
    headingTracking: "tight",
  },
  classica: {
    id: "classica",
    label: "Clássica",
    description: "Serena e atemporal, com leitura leve.",
    sample: "Histórias que permanecem",
    headingFamily: "georgia-editorial",
    bodyFamily: "manrope",
    headingScale: "editorial",
    headingWeight: "regular",
    headingTracking: "normal",
  },
  marcante: {
    id: "marcante",
    label: "Marcante",
    description: "Contemporânea e expressiva, para poucas palavras fortes.",
    sample: "Histórias que permanecem",
    headingFamily: "syne",
    bodyFamily: "figtree",
    headingScale: "display",
    headingWeight: "medium",
    headingTracking: "tight",
  },
  acolhedora: {
    id: "acolhedora",
    label: "Aconchegante",
    description: "Humana, calorosa e confortável de ler.",
    sample: "Histórias que permanecem",
    headingFamily: "fraunces",
    bodyFamily: "nunito-sans",
    headingScale: "editorial",
    headingWeight: "regular",
    headingTracking: "normal",
  },
  manuscrita: {
    id: "manuscrita",
    label: "Manuscrita",
    description: "Um gesto espontâneo nos títulos, com leitura limpa nos textos.",
    sample: "Histórias que permanecem",
    headingFamily: "caveat",
    bodyFamily: "manrope",
    headingScale: "display",
    headingWeight: "regular",
    headingTracking: "normal",
  },
};

export function fontPairIdForConfig(config: SiteConfig): FontPairId | null {
  const typography = config.theme.typography;
  for (const pair of Object.values(FONT_PAIR_REGISTRY)) {
    if (
      pair.headingFamily === typography.headingFamily &&
      pair.bodyFamily === typography.bodyFamily &&
      pair.headingScale === typography.headingScale &&
      pair.headingWeight === typography.headingWeight &&
      pair.headingTracking === typography.headingTracking
    ) {
      return pair.id;
    }
  }
  return null;
}

export function applyFontPair(config: SiteConfig, pairId: FontPairId): SiteConfig {
  const pair = FONT_PAIR_REGISTRY[pairId];
  return {
    ...config,
    theme: {
      ...config.theme,
      typography: {
        ...config.theme.typography,
        headingFamily: pair.headingFamily,
        bodyFamily: pair.bodyFamily,
        headingScale: pair.headingScale,
        headingWeight: pair.headingWeight,
        headingTracking: pair.headingTracking,
      },
    },
  };
}
