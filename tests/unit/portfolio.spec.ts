import { describe, expect, it } from "vitest";
import {
  EDITORIAL_CAROUSEL_IMAGE_IDS,
  buildEditorialCarousel,
} from "../../app/lib/portfolio";
import type { PublicArchiveImage } from "../../shared/public-content";

function archiveImage(id: string): PublicArchiveImage {
  return {
    id,
    altText: "Fotografia publicada",
    width: 1600,
    height: 1200,
    albumSlug: "ensaio-publicado",
    albumTitle: "Ensaio publicado",
    categories: [{ id: "cat", name: "Documental", slug: "documental" }],
    url: `/media/${id}/gallery`,
    thumbUrl: `/media/${id}/card`,
  };
}

describe("curadoria editorial do portfólio", () => {
  it("mantém somente IDs editoriais, sem duplicar conteúdo de álbuns", () => {
    expect(EDITORIAL_CAROUSEL_IMAGE_IDS).toHaveLength(11);
    expect(new Set(EDITORIAL_CAROUSEL_IMAGE_IDS).size).toBe(11);
  });

  it("monta o carrossel apenas com imagens publicadas resolvidas pelo D1", () => {
    const live = [archiveImage("static-p009"), archiveImage("static-p015")];
    const carousel = buildEditorialCarousel(live);

    expect(carousel.map((image) => image.id)).toEqual([
      "editorial-maria-helena",
      "static-p009",
      "static-p015",
    ]);
    expect(carousel[1]).toMatchObject({
      albumSlug: "ensaio-publicado",
      category: "Documental",
    });
  });
});
