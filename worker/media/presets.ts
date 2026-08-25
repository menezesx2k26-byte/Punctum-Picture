export const IMAGE_PRESETS = {
  thumb: { width: 320, height: 320, fit: "cover", quality: 78 },
  card: { width: 800, height: 1000, fit: "cover", quality: 82 },
  gallery: { width: 1600, height: 1600, fit: "scale-down", quality: 82 },
  hero: { width: 2000, height: 1400, fit: "cover", quality: 85 },
  display: { width: 3840, height: 2160, fit: "scale-down", quality: 90 },
  og: { width: 1200, height: 630, fit: "cover", quality: 85 },
} as const satisfies Record<
  string,
  { width: number; height: number; fit: "cover" | "scale-down"; quality: number }
>;

export type ImagePreset = keyof typeof IMAGE_PRESETS;

export function isImagePreset(value: string): value is ImagePreset {
  return Object.hasOwn(IMAGE_PRESETS, value);
}

export function negotiateImageFormat(
  accept: string | null,
): "image/avif" | "image/webp" | "image/jpeg" {
  const normalized = accept?.toLowerCase() ?? "";
  if (normalized.includes("image/avif")) {
    return "image/avif";
  }
  if (normalized.includes("image/webp")) {
    return "image/webp";
  }
  return "image/jpeg";
}

export function resolveGravity(
  focalX: number | null,
  focalY: number | null,
): ImageTransform["gravity"] {
  if (focalX !== null && focalY !== null) {
    return { x: focalX, y: focalY, mode: "box-center" };
  }
  return "auto";
}
