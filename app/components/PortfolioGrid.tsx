"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { PublicAlbumSummary } from "../../shared/public-content";
import { MirandaMotionRoot } from "./MirandaMotion";
import styles from "./MirandaPortfolio.module.css";

export function PortfolioGrid({ albums }: { albums: PublicAlbumSummary[] }) {
  const [filter, setFilter] = useState("Todos");
  const categories = useMemo(
    () => [
      "Todos",
      ...Array.from(
        new Set(
          albums.flatMap((album) =>
            album.categories.map((category) => category.name),
          ),
        ),
      ),
    ],
    [albums],
  );
  const visible =
    filter === "Todos"
      ? albums
      : albums.filter((album) =>
          album.categories.some((category) => category.name === filter),
        );

  return (
    <MirandaMotionRoot className={styles.root}>
      <div className={styles.filter} aria-label="Filtrar portfólio">
        {categories.map((category) => (
          <button
            className={filter === category ? styles.active : ""}
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
          >
            {category}
          </button>
        ))}
      </div>
      <div className={styles.grid}>
        {visible.map((album, index) => (
          <Link
            key={album.id}
            className={styles.card}
            href={`/ensaios/${album.slug}`}
            data-miranda-reveal
          >
            <div className={styles.image}>
              {album.coverUrl ? (
                <Image
                  src={album.coverUrl}
                  alt={`Capa do ensaio ${album.title}`}
                  fill
                  unoptimized
                  sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw"
                />
              ) : null}
            </div>
            <div className={styles.caption}>
              <span className={styles.index}>
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <div>
                <h2>{album.title}</h2>
                <p>
                  {album.categories.map((category) => category.name).join(" · ") ||
                    "Ensaio"}
                </p>
              </div>
              <ArrowUpRight aria-hidden="true" size={18} />
            </div>
          </Link>
        ))}
      </div>
    </MirandaMotionRoot>
  );
}
