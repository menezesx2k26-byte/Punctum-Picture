"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ArchiveImage } from "../lib/portfolio";

export function ArchiveGrid({ images }: { images: ArchiveImage[] }) {
  const [filter, setFilter] = useState("Tudo");
  const [selected, setSelected] = useState<number | null>(null);
  const categories = useMemo(
    () => ["Tudo", ...Array.from(new Set(images.map((image) => image.category)))],
    [images],
  );
  const visible = useMemo(
    () => filter === "Tudo" ? images : images.filter((image) => image.category === filter),
    [filter, images],
  );
  const selectedIndex = visible.findIndex((image) => image.number === selected);
  const selectedImage = selectedIndex >= 0 ? visible[selectedIndex] : null;

  const step = useCallback((direction: 1 | -1) => {
    if (!visible.length) return;
    const nextIndex = (selectedIndex + direction + visible.length) % visible.length;
    setSelected(visible[nextIndex].number);
  }, [selectedIndex, visible]);

  useEffect(() => {
    if (!selectedImage) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedImage, step]);

  return (
    <>
      <div className="archive-toolbar">
        <p>{visible.length.toString().padStart(3, "0")} fotografias</p>
        <div className="archive-filters" aria-label="Filtrar arquivo">
          {categories.map((category) => (
            <button
              className={filter === category ? "active" : ""}
              key={category}
              type="button"
              onClick={() => {
                setFilter(category);
                setSelected(null);
              }}
              aria-pressed={filter === category}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="archive-grid">
        {visible.map((image, index) => (
          <button
            className={`archive-card archive-card-${index % 7}`}
            key={image.src}
            type="button"
            onClick={() => setSelected(image.number)}
            aria-label={`Abrir fotografia ${image.number}: ${image.alt}`}
          >
            <span className="archive-image">
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(max-width: 620px) 50vw, (max-width: 1000px) 33vw, 25vw"
              />
            </span>
            <span className="archive-caption">
              <small>{image.number.toString().padStart(3, "0")}</small>
              <span>{image.albumTitle}</span>
            </span>
          </button>
        ))}
      </div>

      {selectedImage ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Fotografia ampliada">
          <button className="lightbox-close" type="button" onClick={() => setSelected(null)} aria-label="Fechar">
            <X size={20} />
          </button>
          <button className="lightbox-arrow previous" type="button" onClick={() => step(-1)} aria-label="Fotografia anterior">
            <ArrowLeft size={22} />
          </button>
          <div className="lightbox-image">
            <Image src={selectedImage.src} alt={selectedImage.alt} fill sizes="95vw" priority />
          </div>
          <div className="lightbox-caption">
            <span>{selectedImage.number.toString().padStart(3, "0")} / 113</span>
            <div>
              <small>{selectedImage.category}</small>
              <p>{selectedImage.alt}</p>
              {selectedImage.albumSlug ? (
                <Link href={`/ensaios/${selectedImage.albumSlug}`}>Ver ensaio completo</Link>
              ) : null}
            </div>
          </div>
          <button className="lightbox-arrow next" type="button" onClick={() => step(1)} aria-label="Próxima fotografia">
            <ArrowRight size={22} />
          </button>
        </div>
      ) : null}
    </>
  );
}
