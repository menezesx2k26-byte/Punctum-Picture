import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicAlbumSummary } from "../../shared/public-content";
import { albumArtworkSource } from "../lib/album-artwork";
import { EssayLink } from "./EssayLink";

export function FeaturedStories({
  albums,
  variant = "editorial-grid",
}: {
  albums: PublicAlbumSummary[];
  variant?: "editorial-grid" | "gallery" | "collage";
}) {
  if (!albums.length) return null;

  if (variant === "gallery") {
    return (
      <div className="stories-gallery-grid">
        {albums.map((album, index) => {
          const source = albumArtworkSource(album);
          return (
            <Link
              key={album.id}
              href={`/ensaios/${album.slug}`}
              className="gallery-story-card"
            >
              <div className="gallery-story-frame">
                {source ? (
                  <Image
                    src={source}
                    alt={`Capa do ensaio ${album.title}`}
                    width={1400}
                    height={1000}
                    unoptimized
                    sizes="(max-width: 900px) 100vw, 48vw"
                    className="gallery-story-image"
                  />
                ) : (
                  <div className="gallery-story-placeholder">{album.title}</div>
                )}
                <div className="gallery-story-overlay">
                  <span className="gallery-story-num">#{String(index + 1).padStart(2, "0")}</span>
                  <ArrowUpRight size={20} className="gallery-story-arrow" />
                </div>
              </div>
              <div className="gallery-story-meta">
                <span className="gallery-story-cat">
                  {album.categories.map((c) => c.name).join(" · ")}
                </span>
                <h3 className="gallery-story-title">{album.title}</h3>
                {album.subtitle ? (
                  <p className="gallery-story-sub">{album.subtitle}</p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  if (variant === "collage") {
    return (
      <div className="stories-collage-layout">
        {albums.map((album, index) => {
          const source = albumArtworkSource(album);
          return (
            <Link
              key={album.id}
              href={`/ensaios/${album.slug}`}
              className={`collage-story-plate collage-plate-${index + 1}`}
            >
              <div className="collage-photo-frame">
                <span className="collage-tape-mark" aria-hidden="true" />
                {source ? (
                  <Image
                    src={source}
                    alt={`Capa do ensaio ${album.title}`}
                    width={1200}
                    height={900}
                    unoptimized
                    sizes="(max-width: 700px) 90vw, 36vw"
                  />
                ) : null}
              </div>
              <div className="collage-caption">
                <small className="collage-number">PRANCHA {String(index + 1).padStart(2, "0")}</small>
                <h4>{album.title}</h4>
                <p>{album.categories.map((c) => c.name).join(" · ")}</p>
              </div>
            </Link>
          );
        })}
      </div>
    );
  }

  // Default: editorial-grid (dynamic pacing with hero lead and asymmetric pairs)
  return (
    <div className="editorial-stories-layout">
      {/* First story: Grand Hero Spread */}
      {albums[0] ? (
        <Link
          href={`/ensaios/${albums[0].slug}`}
          className="editorial-lead-story"
        >
          <div className="editorial-lead-artwork">
            {albumArtworkSource(albums[0]) ? (
              <Image
                src={albumArtworkSource(albums[0])!}
                alt={`Capa do ensaio ${albums[0].title}`}
                width={1800}
                height={1100}
                unoptimized
                priority
                sizes="(max-width: 900px) 100vw, 85vw"
                className="editorial-lead-image"
              />
            ) : null}
            <div className="editorial-lead-badge">
              <span>DESTAQUE CURATORIAL · ENSAIO 01</span>
            </div>
          </div>
          <div className="editorial-lead-info">
            <div className="editorial-lead-kicker">
              <span className="editorial-lead-category">
                {albums[0].categories.map((c) => c.name).join(" · ")}
              </span>
              <span className="editorial-lead-loc">Joinville & Curitiba</span>
            </div>
            <h3 className="editorial-lead-title">{albums[0].title}</h3>
            {albums[0].subtitle ? (
              <p className="editorial-lead-sub">{albums[0].subtitle}</p>
            ) : null}
            <span className="text-link editorial-lead-cta">
              Abrir ensaio completo <ArrowUpRight size={16} />
            </span>
          </div>
        </Link>
      ) : null}

      {/* Subsequent stories: Alternating asymmetric grid */}
      {albums.length > 1 ? (
        <div className="editorial-secondary-grid">
          {albums.slice(1).map((album, index) => (
            <EssayLink
              key={album.id}
              album={album}
              index={index + 1}
              heading="h3"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
