"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PortfolioAlbum } from "../lib/portfolio";

type Album = PortfolioAlbum & { coverUrl?: string | null };

export function PortfolioGrid({ initialAlbums }: { initialAlbums: PortfolioAlbum[] }) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [filter, setFilter] = useState("Todos");
  const categories = useMemo(
    () => ["Todos", ...Array.from(new Set(albums.map((album) => album.category)))],
    [albums],
  );
  const visible = filter === "Todos" ? albums : albums.filter((album) => album.category === filter);

  useEffect(() => {
    let active = true;
    fetch("/api/public/albums?limit=24")
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as {
          albums?: Array<{
            slug: string;
            title: string;
            subtitle?: string | null;
            description?: string | null;
            coverUrl?: string | null;
          }>;
        };
      })
      .then((body) => {
        if (!active || !body?.albums?.length) return;
        const remoteAlbums = body.albums.map((album) => {
          const original = initialAlbums.find((entry) => entry.slug === album.slug);
          return {
            ...original,
            slug: album.slug,
            title: album.title,
            subtitle: album.subtitle ?? "",
            description: album.description ?? "",
            category: original?.category ?? "Portfólio",
            cover: album.coverUrl ?? "/photos/p001.jpg",
            coverUrl: album.coverUrl,
            gallery: original?.gallery ?? [],
          };
        });
        setAlbums([
          ...initialAlbums.map(
            (album) => remoteAlbums.find((remote) => remote.slug === album.slug) ?? album,
          ),
          ...remoteAlbums.filter((remote) => !initialAlbums.some((album) => album.slug === remote.slug)),
        ]);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [initialAlbums]);

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
            key={album.slug}
            className="story-card"
            href={`/ensaios/${album.slug}`}
          >
            <Image
              src={album.coverUrl ?? album.cover}
              alt={`Capa do ensaio ${album.title}`}
              fill
              sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 34vw"
            />
            <div className="story-card-copy">
              <div>
                <span>{album.category}</span>
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
