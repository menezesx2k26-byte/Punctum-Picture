import type { PublicStats } from "../../shared/public-content";
import { loadPublicStats } from "../lib/server-content";

type Variant =
  | "archive-range"
  | "archive-summary"
  | "portfolio-eyebrow"
  | "archive-link"
  | "hero-index"
  | "stories-link";

function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function publicStatText(stats: PublicStats, variant: Variant) {
  const paddedPhotos = Math.max(1, stats.photoCount).toString().padStart(3, "0");
  switch (variant) {
    case "archive-range":
      return `Arquivo completo · 001—${paddedPhotos}`;
    case "archive-summary":
      return `${countLabel(stats.albumCount, "história", "histórias")} · ${countLabel(
        stats.categoryCount,
        "território visual",
        "territórios visuais",
      )}`;
    case "portfolio-eyebrow":
      return `Portfólio · ${countLabel(stats.albumCount, "história", "histórias")}`;
    case "archive-link":
      return `Preferir o arquivo completo — ${countLabel(stats.photoCount, "imagem", "imagens")}`;
    case "hero-index":
      return `001 / ${paddedPhotos}`;
    case "stories-link":
      return `Ver ${stats.albumCount === 1 ? "a" : "as"} ${countLabel(
        stats.albumCount,
        "história",
        "histórias",
      )}`;
  }
}

export async function PublicStatsText({ variant }: { variant: Variant }) {
  const stats = await loadPublicStats();
  return <span className="live-stat">{publicStatText(stats, variant)}</span>;
}
