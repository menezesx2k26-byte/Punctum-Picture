import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { PublicAlbum } from "../../shared/public-content";
import type { EditorialConfig } from "../../shared/config";

export function LiveAlbum({
  album,
  editorial,
  brandName,
}: {
  album: PublicAlbum;
  editorial: EditorialConfig["album"];
  brandName: string;
}) {
  const category =
    album.categories.map((entry) => entry.name).join(" · ") || "Sem categoria";

  return (
    <>
      <section className="album-hero">
        {album.coverUrl ? (
          <Image
            src={album.coverUrl}
            alt={`Capa do ensaio ${album.title}`}
            fill
            priority
            unoptimized
            sizes="100vw"
          />
        ) : null}
        <div className="album-hero-copy">
          <div className="album-kicker">
            <p className="eyebrow">{category}</p>
            <span>{album.images.length.toString().padStart(2, "0")} fotografias</span>
          </div>
          <h1>{album.title}</h1>
          <div className="album-hero-bottom">
            <p>{album.subtitle}</p>
            <ArrowDown aria-hidden="true" size={22} />
          </div>
        </div>
      </section>
      <section className="section album-story">
        <div className="section-inner">
          <div className="section-heading">
            <h2>{editorial.storyTitle}</h2>
            <p>{album.description}</p>
          </div>
          <div className="album-gallery">
            {album.images.map((image, index) => (
              <figure className={`gallery-frame frame-${index % 6}`} key={image.id}>
                <Image
                  src={image.url}
                  alt={image.altText ?? ""}
                  width={image.width ?? 1600}
                  height={image.height ?? 1200}
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <figcaption>
                  <span>{(index + 1).toString().padStart(2, "0")}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="album-archive-link">
            <p>{editorial.archiveNote.replace("Punctum Picture", brandName)}</p>
            <Link href="/arquivo">
              {editorial.archiveCta} <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
