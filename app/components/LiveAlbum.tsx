"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { DemoAlbum } from "../lib/demo";

type LiveAlbumData = {
  title: string;
  subtitle: string | null;
  description: string | null;
  location: string | null;
  coverUrl: string | null;
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
  initial: DemoAlbum;
}) {
  const [album, setAlbum] = useState<LiveAlbumData | null>(null);

  useEffect(() => {
    let active = true;
    fetch(`/api/public/albums/${encodeURIComponent(slug)}`)
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
  const images =
    album?.images?.length
      ? album.images.map((image) => ({
          src: image.url,
          alt: image.altText ?? "",
          width: image.width ?? 1600,
          height: image.height ?? 1200,
        }))
      : initial.gallery.map((image, index) => ({
          src: image.src,
          alt: image.alt,
          width: index % 2 === 0 ? 1600 : 1200,
          height: index % 2 === 0 ? 1200 : 1600,
        }));

  return (
    <>
      <section className="album-hero">
        <Image src={cover} alt="" fill priority sizes="100vw" />
        <div className="album-hero-copy">
          <p className="eyebrow">{album?.location ?? initial.category}</p>
          <h1>{title}</h1>
          <p style={{ maxWidth: "34rem", lineHeight: 1.7 }}>{subtitle}</p>
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <div className="section-heading">
            <h2>A história</h2>
            <p>{description}</p>
          </div>
          <div className="album-gallery">
            {images.map((image, index) => (
              <figure key={`${image.src}-${index}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
