"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PortfolioAlbum } from "../lib/portfolio";

type Story = PortfolioAlbum & {
  coverUrl?: string | null;
  categories: string[];
};

export function FeaturedStories({ initialAlbums }: { initialAlbums: PortfolioAlbum[] }) {
  const [albums, setAlbums] = useState<Story[]>(() =>
    initialAlbums.map((album) => ({ ...album, categories: [album.category] })),
  );

  useEffect(() => {
    let active = true;
    fetch("/api/public/albums?featured=true&limit=6", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as {
          albums?: Array<{
            slug: string;
            title: string;
            subtitle?: string | null;
            description?: string | null;
            coverUrl?: string | null;
            categories?: Array<{ name: string }>;
          }>;
        };
      })
      .then((body) => {
        if (!active || !body?.albums?.length) return;
        setAlbums(
          body.albums.map((album) => {
            const original = initialAlbums.find((entry) => entry.slug === album.slug);
            const categoryNames = album.categories?.map((category) => category.name) ?? [];
            const categories = categoryNames.length ? categoryNames : ["Sem categoria"];
            return {
              ...original,
              slug: album.slug,
              title: album.title,
              subtitle: album.subtitle ?? "",
              description: album.description ?? "",
              category: categories.join(" · "),
              categories,
              cover: album.coverUrl ?? original?.cover ?? "/photos/p001.jpg",
              coverUrl: album.coverUrl,
              gallery: original?.gallery ?? [],
              featured: true,
            };
          }),
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [initialAlbums]);

  return (
    <div className="home-stories-grid">
      {albums.slice(0, 6).map((album, index) => (
        <Link
          key={album.slug}
          className="story-card reveal"
          href={`/ensaios/${album.slug}`}
        >
          <Image
            src={album.coverUrl ?? album.cover}
            alt={`Capa do ensaio ${album.title}`}
            fill
            sizes="(max-width: 800px) 100vw, 50vw"
          />
          <div className="story-card-copy">
            <div>
              <span>{album.categories.join(" · ")}</span>
              <small>{(index + 1).toString().padStart(2, "0")}</small>
            </div>
            <h3>{album.title}</h3>
            <p>{album.subtitle}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
