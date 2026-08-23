import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { PublicAlbum } from "../../shared/public-content";
import type { EditorialConfig } from "../../shared/config";
import { MirandaGallery } from "./MirandaGallery";
import { MirandaMotionRoot } from "./MirandaMotion";
import styles from "./MirandaAlbum.module.css";

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
    album.categories.map((entry) => entry.name).join(" · ") || "Ensaio";

  return (
    <MirandaMotionRoot className={styles.root}>
      <section className={styles.hero}>
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
        <div className={styles.heroCopy}>
          <div className={styles.kicker}>
            <span>{category}</span>
            <span>{album.images.length.toString().padStart(2, "0")} fotografias</span>
          </div>
          <h1>{album.title}</h1>
          <div className={styles.heroBottom}>
            <p>{album.subtitle}</p>
            <span>
              Descer <ArrowDown aria-hidden="true" size={16} />
            </span>
          </div>
        </div>
      </section>

      <section className={styles.story}>
        <div className={styles.storyInner}>
          <div className={styles.intro} data-miranda-reveal>
            <h2>{editorial.storyTitle}</h2>
            <p>{album.description}</p>
          </div>

          <MirandaGallery images={album.images} />

          <div className={styles.archiveLink} data-miranda-reveal>
            <p>{editorial.archiveNote.replace("Punctum Picture", brandName)}</p>
            <Link href="/arquivo">
              {editorial.archiveCta} <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </MirandaMotionRoot>
  );
}
