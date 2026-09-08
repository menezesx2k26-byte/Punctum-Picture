import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicAlbumSummary } from "../../shared/public-content";
import { albumArtworkSource } from "../lib/album-artwork";

export function EssayLink({ album, index, heading = "h3" }: {
  album: PublicAlbumSummary;
  index: number;
  heading?: "h2" | "h3";
}) {
  const Heading = heading;
  const source = albumArtworkSource(album);
  return (
    <Link className="essay-link" href={`/ensaios/${album.slug}`}>
      <div className="essay-artwork">
        {source ? <Image src={source} alt={`Capa do ensaio ${album.title}`} width={1200} height={1600} unoptimized sizes="(max-width: 700px) 100vw, 50vw" /> : <span className="artwork-empty">{album.title}</span>}
      </div>
      <div className="essay-caption">
        <span className="essay-number">{String(index + 1).padStart(2, "0")}</span>
        <div><p className="essay-category">{album.categories.map((category) => category.name).join(" · ")}</p><Heading>{album.title}</Heading>{album.subtitle ? <p className="essay-subtitle">{album.subtitle}</p> : null}</div>
        <ArrowUpRight aria-hidden="true" size={20} />
      </div>
    </Link>
  );
}
