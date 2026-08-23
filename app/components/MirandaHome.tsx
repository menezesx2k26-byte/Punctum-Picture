import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "../../shared/config";
import type {
  PublicAlbumSummary,
  PublicSiteSettings,
} from "../../shared/public-content";
import type { CarouselImage } from "../lib/portfolio";
import { MirandaMotionRoot } from "./MirandaMotion";
import styles from "./MirandaHome.module.css";

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
  const hero = config.editorial.home.hero;
  const statement = config.editorial.home.statement;
  const featured = featuredAlbums.slice(0, 6);
  const stream = carouselImages.slice(0, 11);
  const leadImage =
    featured[0]?.coverUrl ?? carouselImages[0]?.src ?? "/photos/p001.jpg";

  return (
    <MirandaMotionRoot className={styles.root}>
      <section className={styles.hero} aria-labelledby="miranda-home-title">
        <Image
          className={styles.heroImage}
          src={leadImage}
          alt=""
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <div className={styles.heroVeil} />
        <div className={styles.heroMeta}>
          <span>{hero.eyebrow}</span>
          <span>{featured.length.toString().padStart(2, "0")} coleções</span>
        </div>
        <div className={styles.heroCopy}>
          <h1 id="miranda-home-title">
            <span>{hero.title}</span>
            <em>{hero.accent}</em>
          </h1>
          <div className={styles.heroBottom}>
            <p>{hero.body}</p>
            <a href="#colecoes" className={styles.heroCue}>
              Ver coleções <ArrowDownRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section className={styles.statement} data-miranda-reveal>
        <p className={styles.eyebrow}>{statement.eyebrow}</p>
        <h2>{statement.title}</h2>
      </section>

      <section className={styles.collections} id="colecoes" aria-labelledby="colecoes-title">
        <div className={styles.sectionHead} data-miranda-reveal>
          <div>
            <p className={styles.eyebrow}>Coleções</p>
            <h2 id="colecoes-title">Histórias, não cartões.</h2>
          </div>
          <Link href="/portfolio">
            Ver todas <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className={styles.collectionList}>
          {featured.map((album, index) => (
            <Link
              className={styles.collection}
              data-miranda-reveal
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
                    sizes="(max-width: 800px) 100vw, 72vw"
                  />
                ) : null}
              </div>
              <div className={styles.collectionCaption}>
                <span>{(index + 1).toString().padStart(2, "0")}</span>
                <div>
                  <h3>{album.title}</h3>
                  <p>
                    {album.categories.map((category) => category.name).join(" · ") ||
                      "Ensaio"}
                  </p>
                </div>
                <ArrowUpRight size={20} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.stream} aria-labelledby="fluxo-title">
        <div className={styles.streamIntro} data-miranda-reveal>
          <p className={styles.eyebrow}>{config.editorial.home.carousel.eyebrow}</p>
          <h2 id="fluxo-title">{config.editorial.home.carousel.title}</h2>
        </div>
        <div className={styles.masonry}>
          {stream.map((image, index) => {
            const content = (
              <figure className={styles.masonryItem}>
                <div className={styles.masonryFrame}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    unoptimized
                    sizes="(max-width: 720px) 94vw, (max-width: 1100px) 46vw, 31vw"
                  />
                </div>
                <figcaption>
                  <span>{(index + 1).toString().padStart(2, "0")}</span>
                  <span>{image.albumTitle}</span>
                </figcaption>
              </figure>
            );

            return image.albumSlug ? (
              <Link
                href={`/ensaios/${image.albumSlug}`}
                key={image.id}
                className={styles.masonryLink}
                data-miranda-reveal
              >
                {content}
              </Link>
            ) : (
              <div
                key={image.id}
                className={styles.masonryLink}
                data-miranda-reveal
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className={styles.closing} data-miranda-reveal>
        <div>
          <p className={styles.eyebrow}>{config.editorial.home.about.eyebrow}</p>
          <h2>{config.editorial.home.about.quote}</h2>
        </div>
        <div className={styles.closingAside}>
          <p>{site.brandName}</p>
          <Link href="/contato">
            {config.editorial.chrome.navigation.contact} <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    </MirandaMotionRoot>
  );
}
