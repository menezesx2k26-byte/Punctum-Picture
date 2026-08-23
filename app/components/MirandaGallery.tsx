"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { PublicAlbum } from "../../shared/public-content";
import styles from "./MirandaGallery.module.css";

type GalleryImage = PublicAlbum["images"][number];

export function MirandaGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
      if (event.key === "ArrowRight") {
        setActive((current) =>
          current === null ? 0 : (current + 1) % images.length,
        );
      }
      if (event.key === "ArrowLeft") {
        setActive((current) =>
          current === null
            ? 0
            : (current - 1 + images.length) % images.length,
        );
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, images.length]);

  return (
    <>
      <div className={styles.masonry} aria-label="Fotografias do ensaio">
        {images.map((image, index) => (
          <figure className={styles.item} data-miranda-reveal key={image.id}>
            <button
              className={styles.imageButton}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Abrir fotografia ${index + 1} em tela cheia`}
            >
              <Image
                src={image.url}
                alt={image.altText ?? ""}
                width={image.width ?? 1600}
                height={image.height ?? 1200}
                unoptimized
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                loading={index < 2 ? "eager" : "lazy"}
              />
            </button>
            <figcaption>{(index + 1).toString().padStart(2, "0")}</figcaption>
          </figure>
        ))}
      </div>

      {active !== null && images[active] ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Visualização ampliada"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setActive(null);
          }}
        >
          <button
            className={styles.close}
            type="button"
            onClick={() => setActive(null)}
            aria-label="Fechar fotografia"
          >
            <X size={22} />
          </button>
          <button
            className={`${styles.nav} ${styles.previous}`}
            type="button"
            onClick={() =>
              setActive((active - 1 + images.length) % images.length)
            }
            aria-label="Fotografia anterior"
          >
            <ChevronLeft size={26} />
          </button>
          <div className={styles.lightboxFrame}>
            <Image
              src={images[active].url}
              alt={images[active].altText ?? ""}
              width={images[active].width ?? 2000}
              height={images[active].height ?? 1400}
              unoptimized
              priority
              sizes="96vw"
            />
            <span>
              {(active + 1).toString().padStart(2, "0")} / {images.length.toString().padStart(2, "0")}
            </span>
          </div>
          <button
            className={`${styles.nav} ${styles.next}`}
            type="button"
            onClick={() => setActive((active + 1) % images.length)}
            aria-label="Próxima fotografia"
          >
            <ChevronRight size={26} />
          </button>
        </div>
      ) : null}
    </>
  );
}
