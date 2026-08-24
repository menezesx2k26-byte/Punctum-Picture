import Image from "next/image";
import Link from "next/link";
import type { PublicAlbumSummary } from "../../shared/public-content";
import styles from "./MirandaPortfolio.module.css";

function albumYear(album: PublicAlbumSummary): string {
  const value = album.shootDate ?? album.publishedAt;
  return value?.slice(0, 4) ?? "";
}

export function PortfolioGrid({ albums }: { albums: PublicAlbumSummary[] }) {
  return (
    <div className={styles.root}>
      <div className={styles.grid} aria-label="Coleções publicadas">
        {albums.map((album, index) => (
          <Link
            key={album.id}
            className={styles.collection}
            href={`/ensaios/${album.slug}`}
          >
            <div className={styles.image}>
              {album.coverUrl ? (
                <Image
                  src={album.coverUrl}
                  alt={`Capa do ensaio ${album.title}`}
                  fill
                  unoptimized
                  sizes="(max-width: 599px) 100vw, (max-width: 899px) 50vw, 48vw"
                />
              ) : null}
            </div>
            <div className={styles.caption}>
              <div>
                <h2>{album.title}</h2>
                <p>
                  {[album.location, album.categories[0]?.name]
                    .filter(Boolean)
                    .join(" · ") || "Ensaio"}
                </p>
              </div>
              <span>{albumYear(album) || (index + 1).toString().padStart(2, "0")}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
