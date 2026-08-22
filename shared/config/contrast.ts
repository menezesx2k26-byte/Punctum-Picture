import { PALETTE_REGISTRY, type PaletteId } from "./palette-registry";

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

function channelLuminance(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex: string): number {
  if (!HEX_COLOR.test(hex)) {
    throw new Error(`A validação de contraste exige uma cor hexadecimal: ${hex}`);
  }
  const red = channelLuminance(Number.parseInt(hex.slice(1, 3), 16));
  const green = channelLuminance(Number.parseInt(hex.slice(3, 5), 16));
  const blue = channelLuminance(Number.parseInt(hex.slice(5, 7), 16));
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(first: string, second: string): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

export function paletteContrastChecks(id: PaletteId) {
  const colors = PALETTE_REGISTRY[id].colors;
  return [
    {
      name: "texto principal / fundo",
      ratio: contrastRatio(colors.foreground, colors.background),
    },
    {
      name: "texto principal / superfície",
      ratio: contrastRatio(colors.foreground, colors.surface),
    },
    {
      name: "texto secundário / fundo",
      ratio: contrastRatio(colors.muted, colors.background),
    },
    {
      name: "cor principal / fundo",
      ratio: contrastRatio(colors.primary, colors.background),
    },
    {
      name: "accent / fundo",
      ratio: contrastRatio(colors.accent, colors.background),
    },
    {
      name: "texto claro / fundo escuro",
      ratio: contrastRatio(colors.onDark, colors.night),
    },
  ] as const;
}

export function assertPaletteContrast(
  id: PaletteId,
  minimumRatio = 4.5,
): void {
  const failed = paletteContrastChecks(id).filter(
    (check) => check.ratio < minimumRatio,
  );
  if (failed.length) {
    throw new Error(
      `Palette ${id} reprovada em contraste: ${failed
        .map((check) => `${check.name} (${check.ratio.toFixed(2)}:1)`)
        .join(", ")}`,
    );
  }
}

