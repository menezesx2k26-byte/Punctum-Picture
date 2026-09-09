import { describe, expect, it } from "vitest";
import { albumArtworkSource } from "../../app/lib/album-artwork";
import { IMAGE_PRESETS, isImagePreset } from "../../worker/media/presets";

describe("photographic presentation", () => {
  it("uses a non-cropping preset for a cover managed in D1", () => {
    const source = albumArtworkSource({ coverImageId: "managed-cover", coverUrl: "/media/managed-cover/card" });
    expect(source).toBe("/media/managed-cover/gallery");
    expect(IMAGE_PRESETS.gallery.fit).toBe("scale-down");
  });
  it("retains legacy sources and gracefully represents an absent cover", () => {
    expect(albumArtworkSource({ coverImageId: null, coverUrl: "/legacy-cover.jpg" })).toBe("/legacy-cover.jpg");
    expect(albumArtworkSource({ coverImageId: null, coverUrl: null })).toBeNull();
  });
  it("offers a smaller uncropped contact sheet without changing existing presets", () => {
    expect(isImagePreset("sheet")).toBe(true);
    expect(IMAGE_PRESETS.sheet).toEqual({ width: 640, height: 640, fit: "scale-down", quality: 78 });
    expect(IMAGE_PRESETS.card).toEqual({ width: 800, height: 1000, fit: "cover", quality: 82 });
  });
});
