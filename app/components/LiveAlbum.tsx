import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { PublicAlbum } from "../../shared/public-content";
import type { EditorialConfig } from "../../shared/config";
import { albumArtworkSource } from "../lib/album-artwork";

export function LiveAlbum({ album, editorial, brandName }: {
  album: PublicAlbum; editorial: EditorialConfig["album"]; brandName: string;
}) {
  const cover = album.images.find((image) => image.id === album.coverImageId);
  const source = albumArtworkSource(album);
  return <>
    <header className="album-hero">
      <div className="album-kicker"><p className="eyebrow">{album.categories.map((entry) => entry.name).join(" · ")}</p><span>{String(album.images.length).padStart(2, "0")} fotografias</span></div>
      <h1>{album.title}</h1>
      <div className="album-hero-bottom"><p>{album.subtitle}</p><a href="#sequencia" aria-label="Ver sequência de fotografias"><ArrowDown aria-hidden="true" size={22} /></a></div>
      {source ? <figure className="album-cover"><Image src={source} alt={cover?.altText || `Capa do ensaio ${album.title}`} width={cover?.width || 1600} height={cover?.height || 1200} priority unoptimized sizes="100vw" /></figure> : null}
    </header>
    <section className="section album-story" id="sequencia">
      <div className="section-inner">
        <div className="section-heading"><h2>{editorial.storyTitle}</h2><div><p>{album.description}</p>{album.location ? <p>{album.location}</p> : null}</div></div>
        <div className="album-gallery">
          {album.images.map((image, index) => <figure className={`gallery-frame${image.width && image.height && image.width > image.height ? " landscape" : ""}`} key={image.id}>
            <Image src={image.url} alt={image.altText ?? ""} width={image.width ?? 1600} height={image.height ?? 1200} unoptimized sizes="(max-width: 700px) 100vw, 70vw" />
            <figcaption><span>{String(index + 1).padStart(2, "0")}</span><span>{album.title}</span></figcaption>
          </figure>)}
        </div>
        <div className="album-archive-link"><p>{editorial.archiveNote.replace("Punctum Picture", brandName)}</p><Link href="/arquivo">{editorial.archiveCta}<ArrowUpRight size={17} /></Link></div>
      </div>
    </section>
  </>;
}
