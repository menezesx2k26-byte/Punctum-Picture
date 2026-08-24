import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "../../shared/config";
import type {
  PublicAlbumSummary,
  PublicSiteSettings,
} from "../../shared/public-content";
import type { CarouselImage } from "../lib/portfolio";
import styles from "./MirandaHome.module.css";

function albumYear(album: PublicAlbumSummary): string {
  const value = album.shootDate ?? album.publishedAt;
  return value?.slice(0, 4) ?? "—";
}

function albumCategory(album: PublicAlbumSummary): string {
  return album.categories[0]?.name ?? "Ensaio";
}

export function MirandaHome({
  site,
  config,
  featuredAlbums,
  carouselImages,
}: {
  site: PublicSiteSettings;
  config: SiteConfig;
  featuredAlbums: PublicAlbumSummary[];
  carouselImages: CarouselImage[];
}) {
  const featured = featuredAlbums.slice(0, 5);
  const portfolioLabel = config.editorial.chrome.navigation.portfolio;

  if (!featured.length) {
    return (
      <div className={styles.emptyState} data-miranda-layout="compression">
        <p>{site.brandName}</p>
        <h1>{site.tagline}</h1>
        <Link href="/portfolio">{portfolioLabel}</Link>
      </div>
    );
  }

  return (
    <div className={styles.root} data-miranda-layout="compression">
      <section
        className={styles.compressionTrack}
        aria-label="Coleções fotográficas em destaque"
      >
        {featured.map((album, index) => {
          const fallback = carouselImages.find(
            (image) => image.albumSlug === album.slug,
          );
          const imageSrc = album.coverUrl ?? fallback?.src ?? "/photos/p001.jpg";
          const titleId = `miranda-panel-${index + 1}`;

          return (
            <article className={styles.panel} key={album.id}>
              <Link
                className={styles.panelLink}
                href={`/ensaios/${album.slug}`}
                aria-labelledby={titleId}
              >
                <div className={styles.panelBackground} aria-hidden="true">
                  <Image
                    src={imageSrc}
                    alt=""
                    fill
                    priority={index === 0}
                    unoptimized
                    sizes="(max-width: 900px) 100vw, 72vw"
                  />
                </div>

                <span className={styles.panelIndex}>
                  {(index + 1).toString().padStart(2, "0")} / {featured.length
                    .toString()
                    .padStart(2, "0")}
                </span>

                <h2 className={styles.spine} id={titleId}>
                  {album.title}
                </h2>

                <div className={styles.details}>
                  <p className={styles.category}>{albumCategory(album)}</p>
                  <h3>{album.title}</h3>

                  <dl className={styles.meta}>
                    <div>
                      <dt>Lugar</dt>
                      <dd>{album.location ?? "—"}</dd>
                    </div>
                    <div>
                      <dt>Ano</dt>
                      <dd>{albumYear(album)}</dd>
                    </div>
                  </dl>

                  <p className={styles.description}>
                    {album.description ?? album.subtitle ?? site.tagline}
                  </p>

                  <span className={styles.panelCta}>
                    Abrir ensaio <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </section>

      <div className={styles.bottomStrip} aria-hidden="true">
        <span>{site.brandName}</span>
        <span>Fotografia autoral</span>
      </div>
    </div>
  );
}
