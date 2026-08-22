import Image from "next/image";
import Link from "next/link";
import type { PublicAlbumSummary } from "../../shared/public-content";

export function FeaturedStories({
  albums,
}: {
  albums: PublicAlbumSummary[];
}) {
  return (
    <div className="home-stories-grid">
      {albums.slice(0, 6).map((album, index) => (
        <Link
          key={album.id}
          className="story-card reveal"
          href={`/ensaios/${album.slug}`}
        >
          {album.coverUrl ? (
            <Image
              src={album.coverUrl}
              alt={`Capa do ensaio ${album.title}`}
              fill
              unoptimized
              sizes="(max-width: 800px) 100vw, 50vw"
            />
          ) : null}
          <div className="story-card-copy">
            <div>
              <span>
                {album.categories.map((category) => category.name).join(" · ") ||
                  "Sem categoria"}
              </span>
              <small>{(index + 1).toString().padStart(2, "0")}</small>
            </div>
            <h3>{album.title}</h3>
            <p>{album.subtitle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
