import { describe, expect, it } from "vitest";
import { IMAGE_PRESETS, isImagePreset } from "../../worker/media/presets";

describe("preset público do Hero enviado", () => {
  it("aceita display como preset de alta resolução para mídia do Studio", () => {
    expect(isImagePreset("display")).toBe(true);
    expect(IMAGE_PRESETS.display).toEqual({
      width: 3840,
      height: 2160,
      fit: "scale-down",
      quality: 90,
    });
  });
});
