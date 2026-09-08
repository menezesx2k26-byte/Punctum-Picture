"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { CarouselImage } from "../lib/portfolio";

export function PhotoCarousel({ images, hint = "Arraste para atravessar o acervo" }: { images: CarouselImage[]; hint?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  function move(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: Math.max(track.clientWidth * .72, 280) * direction, behavior: reduced ? "instant" : "smooth" });
  }
  if (!images.length) return null;
  return <div className="photo-carousel">
    <div className="photo-carousel-track" ref={trackRef} tabIndex={0} role="region" aria-label="Seleção de fotografias">
      {images.map((image, index) => <Link className={`photo-carousel-slide${index % 4 === 3 ? " wide" : ""}`} href={image.albumSlug ? `/ensaios/${image.albumSlug}` : "/#sobre"} key={image.id}>
        <div className="reel-image"><Image src={image.src} alt={image.alt} fill unoptimized sizes="(max-width: 720px) 78vw, 34vw" /></div>
        <span><small>{image.category}</small>{image.albumTitle}</span>
      </Link>)}
    </div>
    <div className="carousel-controls" aria-label="Controles do carrossel">
      <button type="button" onClick={() => move(-1)} aria-label="Fotografias anteriores"><ArrowLeft size={18} /></button>
      <span>{hint}</span>
      <button type="button" onClick={() => move(1)} aria-label="Próximas fotografias"><ArrowRight size={18} /></button>
    </div>
  </div>;
}
