import type { PublicAlbumSummary } from "../../shared/public-content";

/** The gallery preset preserves the photographer's frame; card crops to 4:5. */
export function albumArtworkSource(album: Pick<PublicAlbumSummary, "coverImageId" | "coverUrl">): string | null {
  return album.coverImageId ? `/media/${album.coverImageId}/gallery` : album.coverUrl;
}
