import type { PublicAlbumSummary } from "../../shared/public-content";
import { EssayLink } from "./EssayLink";

export function FeaturedStories({ albums }: { albums: PublicAlbumSummary[] }) {
  return <div className="essay-grid home-stories-grid">{albums.map((album, index) => <EssayLink key={album.id} album={album} index={index} />)}</div>;
}
