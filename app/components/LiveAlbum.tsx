import Link from "next/link";
import type { PublicAlbum } from "../../shared/public-content";
import type { EditorialConfig } from "../../shared/config";
import { MirandaGallery } from "./MirandaGallery";
import styles from "./MirandaAlbum.module.css";

function albumYear(album: PublicAlbum): string {
  const value = album.shootDate ?? album.publishedAt;
  return value?.slice(0, 4) ?? "";
}

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
  const locationLine = [album.location, albumYear(album), category]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={styles.root} data-miranda-layout="album-photobook">
      <div className={styles.topline}>
        <Link href="/portfolio">← Coleções</Link>
        <span>{brandName}</span>
      </div>

      <header className={styles.intro}>
        <div>
          <p className={styles.kicker}>{locationLine}</p>
          <h1>{album.title}</h1>
        </div>
        <div className={styles.copy}>
          {album.subtitle ? <p className={styles.subtitle}>{album.subtitle}</p> : null}
          {album.description ? <p>{album.description}</p> : null}
        </div>
      </header>

      <MirandaGallery images={album.images} />

      <footer className={styles.ending}>
        <p>
          {Math.min(album.images.length, 12).toString().padStart(2, "0")} / {album.images.length.toString().padStart(2, "0")} fotografias no gate Miranda
        </p>
        <Link href="/portfolio">
          {editorial.archiveCta || "Voltar às coleções"} <span aria-hidden="true">→</span>
        </Link>
      </footer>
    </div>
  );
}
