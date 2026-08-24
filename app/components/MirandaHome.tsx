import Image from "next/image";
import Link from "next/link";
import type { SiteConfig } from "../../shared/config";
import type {
  PublicAlbumSummary,
  PublicSiteSettings,
} from "../../shared/public-content";
import type { CarouselImage } from "../lib/portfolio";
import styles from "./MirandaHome.module.css";

function albumYear(album: PublicAlbumSummary | undefined): string {
  const value = album?.shootDate ?? album?.publishedAt;
  return value?.slice(0, 4) ?? "";
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
  const leadAlbum = featured[0];
  const leadImage = carouselImages[0]?.src ?? leadAlbum?.coverUrl ?? "/photos/p001.jpg";
  const leadAlt = carouselImages[0]?.alt || (leadAlbum ? `Fotografia do ensaio ${leadAlbum.title}` : "");
  const portfolioLabel = config.editorial.chrome.navigation.portfolio;

  return (
    <div className={styles.root} data-miranda-layout="photobook">
      <section className={styles.hero} aria-label="Abertura fotográfica">
        <div className={styles.heroFrame}>
          <Image
            className={styles.heroImage}
            src={leadImage}
            alt={leadAlt}
            fill
            priority
            unoptimized
            sizes="100vw"
          />
          <div className={styles.heroShade} aria-hidden="true" />
          <div className={styles.heroMeta}>
            <span>{leadAlbum?.title ?? site.brandName}</span>
            <span>
              {[leadAlbum?.location, albumYear(leadAlbum)].filter(Boolean).join(" · ")}
            </span>
          </div>
        </div>
      </section>

      <section className={styles.collections} id="colecoes" aria-labelledby="colecoes-title">
        <header className={styles.sectionHead}>
          <p>Selecionados</p>
          <h1 id="colecoes-title">Coleções</h1>
        </header>

        <div className={styles.collectionList}>
          {featured.map((album, index) => (
            <Link
              className={styles.collection}
              href={`/ensaios/${album.slug}`}
              key={album.id}
            >
              <div className={styles.collectionImage}>
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
              <div className={styles.collectionCaption}>
                <div>
                  <h2>{album.title}</h2>
                  <p>
                    {[album.location, album.categories[0]?.name]
                      .filter(Boolean)
                      .join(" · ") || "Ensaio"}
                  </p>
                </div>
                <span>{albumYear(album)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.manifesto} aria-label="Sobre o trabalho">
        <p>{site.tagline}</p>
      </section>

      <section className={styles.more}>
        <Link href="/portfolio" aria-label={`${portfolioLabel}: ver todas as coleções`}>
          Ver todas as coleções <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
