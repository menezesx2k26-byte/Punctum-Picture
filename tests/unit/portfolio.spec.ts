import { describe, expect, it } from "vitest";
import { archiveImages, portfolioAlbums } from "../../app/lib/portfolio";

describe("acervo da Punctum Picture", () => {
  it("inclui as 113 fotografias do material fornecido", () => {
    expect(archiveImages).toHaveLength(113);
    expect(new Set(archiveImages.map((image) => image.number)).size).toBe(113);
    expect(archiveImages.map((image) => image.number)).toEqual(
      Array.from({ length: 113 }, (_, index) => index + 1),
    );
  });

  it("mantém cada fotografia de portfólio em um único ensaio", () => {
    const galleryImages = portfolioAlbums.flatMap((album) => album.gallery);
    expect(galleryImages).toHaveLength(112);
    expect(new Set(galleryImages.map((image) => image.src)).size).toBe(112);
  });
});
