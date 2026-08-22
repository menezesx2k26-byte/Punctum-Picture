"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { PublicAlbumSummary } from "../../shared/public-content";

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
    <>
      <div className="portfolio-filter" aria-label="Filtrar portfólio">
        {categories.map((category) => (
          <button
            className={filter === category ? "active" : ""}
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="portfolio-grid">
        {visible.map((album, index) => (
          <Link
            key={album.id}
            className="story-card"
            href={`/ensaios/${album.slug}`}
          >
            {album.coverUrl ? (
              <Image
                src={album.coverUrl}
                alt={`Capa do ensaio ${album.title}`}
                fill
                unoptimized
                sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 34vw"
              />
            ) : null}
            <div className="story-card-copy">
              <div>
                <span>
                  {album.categories
                    .map((category) => category.name)
                    .join(" · ") || "Sem categoria"}
                </span>
                <small>{(index + 1).toString().padStart(2, "0")}</small>
              </div>
              <h2>{album.title}</h2>
              <p>{album.subtitle}</p>
              <ArrowUpRight aria-hidden="true" size={20} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
