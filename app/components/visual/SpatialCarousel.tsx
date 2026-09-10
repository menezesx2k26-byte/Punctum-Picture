"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CarouselImage } from "../../lib/portfolio";

interface SpatialCarouselProps {
  images: readonly CarouselImage[];
  onSelectImage?: (image: CarouselImage) => void;
  className?: string;
  autoPlay?: boolean;
}

export function SpatialCarousel({
  images,
  onSelectImage,
  className = "",
  autoPlay = false,
}: SpatialCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Interaction tracking refs
  const startXRef = useRef(0);
  const startRotationRef = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const count = images.length;
  const angleStep = count > 0 ? 360 / count : 0;
  const radius = Math.max(380, Math.round((count * 180) / (2 * Math.PI)));

  const reducedMotion = useSyncExternalStore(
    (callback) => {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      mediaQuery.addEventListener("change", callback);
      return () => mediaQuery.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // Momentum decay animation
  const animateMomentum = useCallback(() => {
    function loop() {
      if (Math.abs(velocityRef.current) > 0.05) {
        velocityRef.current *= 0.94; // friction
        setRotation((prev) => prev + velocityRef.current);
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        velocityRef.current = 0;
      }
    }
    animFrameRef.current = requestAnimationFrame(loop);
  }, []);

  const handlePointerDown = (clientX: number) => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    setIsDragging(true);
    startXRef.current = clientX;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    startRotationRef.current = rotation;
    velocityRef.current = 0;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const dx = clientX - lastXRef.current;

    // Drag sensitivity: 0.25 deg per pixel
    const deltaTotal = (clientX - startXRef.current) * 0.25;
    setRotation(startRotationRef.current + deltaTotal);

    velocityRef.current = (dx / dt) * 8;
    lastXRef.current = clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    animFrameRef.current = requestAnimationFrame(animateMomentum);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setRotation((prev) => prev + angleStep);
    } else if (e.key === "ArrowRight") {
      setRotation((prev) => prev - angleStep);
    }
  };

  // Autoplay slow rotation if requested and not interacting
  useEffect(() => {
    if (!autoPlay || isDragging || reducedMotion) return;
    const interval = setInterval(() => {
      setRotation((prev) => prev - 0.2);
    }, 30);
    return () => clearInterval(interval);
  }, [autoPlay, isDragging, reducedMotion]);

  if (!images.length) return null;

  // Reduced motion fallback: elegant responsive gallery reel
  if (reducedMotion) {
    return (
      <div className={`spatial-carousel-fallback ${className}`}>
        <div className="spatial-fallback-grid">
          {images.map((image) => (
            <button
              key={image.id}
              type="button"
              className="spatial-fallback-item"
              onClick={() => onSelectImage?.(image)}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="eager"
                className="spatial-card-image"
              />
              <span className="spatial-fallback-caption">
                {image.category} — {image.albumTitle}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`spatial-carousel-stage ${isDragging ? "is-dragging" : ""} ${className}`}
      onMouseDown={(e) => handlePointerDown(e.clientX)}
      onMouseMove={(e) => handlePointerMove(e.clientX)}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
      onTouchEnd={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Carrossel tridimensional de fotografias. Use as setas esquerda e direita para navegar ou arraste com o mouse/toque."
    >
      <div
        className="spatial-cylinder"
        style={{
          transform: `rotateY(${rotation}deg)`,
        }}
      >
        {images.map((image, index) => {
          const itemAngle = index * angleStep;
          const relativeAngle = ((itemAngle + rotation) % 360 + 360) % 360;
          const isFront = relativeAngle < 70 || relativeAngle > 290;

          return (
            <div
              key={image.id}
              className={`spatial-card ${isFront ? "is-front" : "is-back"}`}
              style={{
                transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
              }}
              onClick={() => {
                if (Math.abs(lastXRef.current - startXRef.current) < 5) {
                  onSelectImage?.(image);
                }
              }}
            >
              <div className="spatial-card-inner">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="eager"
                  className="spatial-card-image"
                />
                <div className="spatial-card-overlay">
                  <span className="spatial-card-category">{image.category}</span>
                  <p className="spatial-card-title">{image.albumTitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="spatial-carousel-hud" aria-hidden="true">
        <span>Arraste ou use ← → para girar</span>
        <span>{images.length} fotografias em cena</span>
      </div>
    </div>
  );
}
