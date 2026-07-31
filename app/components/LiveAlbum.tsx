"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { PortfolioAlbum } from "../lib/portfolio";

type LiveAlbumData = {
  title: string;
  subtitle: string | null;
  description: string | null;
  location: string | null;
  coverUrl: string | null;
  categories: Array<{ id: string; name: string; slug: string }>;
  images: Array<{
    id: string;
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  }>;
};

export function LiveAlbum({
  slug,
  initial,
}: {
  slug: string;
  initial: PortfolioAlbum;
}) {
  const [album, setAlbum] = useState<LiveAlbumData | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/public/albums/${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return (await response.json()) as { album?: LiveAlbumData };
      })
      .then((body) => {
        if (active && body?.album) setAlbum(body.album);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [slug]);

  const title = album?.title ?? initial.title;
  const subtitle = album?.subtitle ?? initial.subtitle;
  const description = album?.description ?? initial.description;
  const cover = album?.coverUrl ?? initial.cover;
  const category = album
    ? album.categories.map((entry) => entry.name).join(" · ") || "Sem categoria"
    : initial.category;
  const images =
    album?.images?.length
      ? album.images.map((image) => ({
          src: image.url,
          alt: image.altText ?? "",
          width: image.width ?? 1600,
          height: image.height ?? 1200,
          number: null,
        }))
      : initial.gallery.map((image) => ({
          src: image.src,
          alt: image.alt,
          width: 1800,
          height: 2400,
          number: image.number,
        }));

  return (
    <>
      <section className="album-hero">
        <Image src={cover} alt={`Capa do ensaio ${title}`} fill priority sizes="100vw" />
        <div className="album-hero-copy">
          <div className="album-kicker">
            <p className="eyebrow">{category}</p>
            <span>{images.length.toString().padStart(2, "0")} fotografias</span>
          </div>
          <h1>{title}</h1>
          <div className="album-hero-bottom">
            <p>{subtitle}</p>
            <ArrowDown aria-hidden="true" size={22} />
          </div>
        </div>
      </section>
      <section className="section album-story">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Sobre a história</h2>
            <p>{description}</p>
          </div>
          <div className="album-gallery">
            {images.map((image, index) => (
              <figure className={`gallery-frame frame-${index % 6}`} key={`${image.src}-${index}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading={index < 2 ? "eager" : "lazy"}
                />
                <figcaption>
                  <span>{(index + 1).toString().padStart(2, "0")}</span>
                  {image.number ? <small>Arquivo {image.number.toString().padStart(3, "0")}</small> : null}
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="album-archive-link">
            <p>Esta história faz parte do arquivo completo da Punctum Picture.</p>
            <Link href="/arquivo">
              Percorrer todas as fotografias <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
