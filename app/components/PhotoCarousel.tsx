"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CarouselImage } from "../lib/portfolio";

export function PhotoCarousel({
  images,
  hint = "Arraste para atravessar o acervo",
}: {
  images: CarouselImage[];
  hint?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const move = useCallback((direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const distance = Math.max(track.clientWidth * 0.72, 280) * direction;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 24;
    const atStart = track.scrollLeft <= 24;

    if (direction === 1 && atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === -1 && atStart) {
      track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    } else {
      track.scrollBy({ left: distance, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (paused || reducedMotion.matches) return;
    const timer = window.setInterval(() => move(1), 5200);
    return () => window.clearInterval(timer);
  }, [move, paused]);

  return (
    <div
      className="photo-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="photo-carousel-track" ref={trackRef}>
        {images.map((image, index) => (
          <Link
            className={`photo-carousel-slide${index % 4 === 0 ? " wide" : ""}`}
            href={image.albumSlug ? `/ensaios/${image.albumSlug}` : "/#sobre"}
            key={image.id}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              unoptimized
              sizes="(max-width: 720px) 78vw, 34vw"
            />
            <span>
              <small>{image.category}</small>
              {image.albumTitle}
            </span>
          </Link>
        ))}
      </div>
      <div className="carousel-controls" aria-label="Controles do carrossel">
        <button type="button" onClick={() => move(-1)} aria-label="Fotografias anteriores">
          <ArrowLeft size={17} />
        </button>
        <span>{hint}</span>
        <button type="button" onClick={() => move(1)} aria-label="Próximas fotografias">
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}
