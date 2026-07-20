"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { DemoAlbum } from "../lib/demo";

type Album = DemoAlbum & { coverUrl?: string | null };

export function PortfolioGrid({ initialAlbums }: { initialAlbums: DemoAlbum[] }) {
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
        setAlbums(
          body.albums.map((album) => ({
            slug: album.slug,
            title: album.title,
            subtitle: album.subtitle ?? "",
            description: album.description ?? "",
            category: "Portfólio",
            cover: album.coverUrl ?? "/demo/hero.jpg",
            coverUrl: album.coverUrl,
            gallery: [],
          })),
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="button-row" aria-label="Filtrar portfólio">
        {categories.map((category) => (
          <button
            className={`button small${filter === category ? "" : " ghost"}`}
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            aria-pressed={filter === category}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="editorial-grid" style={{ marginTop: "2rem" }}>
        {visible.map((album) => (
          <Link
            key={album.slug}
            className="story-card"
            href={`/ensaios/${album.slug}`}
          >
            <Image
              src={album.coverUrl ?? album.cover}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
            />
            <div className="story-card-copy">
              <span>{album.category}</span>
              <h2>{album.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
