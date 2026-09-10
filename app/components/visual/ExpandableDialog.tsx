"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, ArrowUpRight } from "lucide-react";
import type { CarouselImage } from "../../lib/portfolio";

interface ExpandableDialogProps {
  image: CarouselImage | null;
  onClose: () => void;
}

export function ExpandableDialog({ image, onClose }: ExpandableDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (image) {
      const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const previousOverflow = document.body.style.overflow;
      if (!dialog.open) {
        dialog.showModal();
      }
      document.body.style.overflow = "hidden";
      return () => {
        dialog.close();
        document.body.style.overflow = previousOverflow;
        if (previousFocus?.isConnected) previousFocus.focus({preventScroll:true});
      };
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [image]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && image) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <dialog
      ref={dialogRef}
      className="expandable-dialog"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label={`Visualização ampliada de ${image.albumTitle || "Fotografia"}`}
    >
      <div className="expandable-dialog-content">
        <button
          type="button"
          className="expandable-dialog-close"
          onClick={onClose}
          aria-label="Fechar visualização ampliada"
        >
          <X size={24} />
        </button>

        <figure className="expandable-dialog-figure">
          <Image
            src={image.src}
            alt={image.alt}
            width={1600}
            height={1200}
            unoptimized
            priority
            sizes="90vw"
            className="expandable-dialog-image"
          />
          <figcaption className="expandable-dialog-caption">
            <div className="expandable-meta">
              <span className="expandable-category">{image.category}</span>
              <h3 className="expandable-title">{image.albumTitle}</h3>
            </div>

            {image.albumSlug ? (
              <Link
                href={`/ensaios/${image.albumSlug}`}
                className="expandable-essay-link text-link"
                onClick={onClose}
              >
                Ver ensaio completo <ArrowUpRight size={16} />
              </Link>
            ) : null}
          </figcaption>
        </figure>
      </div>
    </dialog>
  );
}
