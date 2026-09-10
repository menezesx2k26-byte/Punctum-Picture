"use client";

import { useEffect, useState, useRef } from "react";

type CursorMode = "drag" | "examine" | "open" | null;

const LABELS: Record<NonNullable<CursorMode>, string> = {
  drag: "ARRASTAR · 3D",
  examine: "EXAMINAR",
  open: "ABRIR ENSAIO ↗",
};

/**
 * GalleryCursor: Cursor magnético contextual para experiência desktop de galeria.
 * Reage a elementos com `data-cursor="drag"`, `data-cursor="examine"`, `data-cursor="open"`.
 * Desativa-se automaticamente em telas de toque (smartphones/tablets) e sob `prefers-reduced-motion`.
 * Possui pointer-events: none e nunca interfere com cliques, foco ou acessibilidade.
 */
export function GalleryCursor() {
  const [activeMode, setActiveMode] = useState<CursorMode>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Apenas em desktops com ponteiro preciso e sem preferência de redução de movimento
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };

      // Detecta elemento com atributo data-cursor
      const target = e.target as HTMLElement | null;
      const cursorTarget = target?.closest("[data-cursor]") as HTMLElement | null;

      if (cursorTarget) {
        const mode = cursorTarget.getAttribute("data-cursor") as CursorMode;
        if (mode && mode in LABELS) {
          setActiveMode(mode);
          return;
        }
      }

      setActiveMode(null);
    };

    const handlePointerLeave = () => {
      setActiveMode(null);
    };

    // Loop de renderização suave com interpolação linear (LERP)
    const animate = () => {
      const speed = 0.22;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * speed;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * speed;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <aside
      ref={cursorRef}
      aria-hidden="true"
      className={`gallery-cursor-badge ${activeMode ? "is-visible" : ""}`}
    >
      <span className="gallery-cursor-text">
        {activeMode ? LABELS[activeMode] : ""}
      </span>
    </aside>
  );
}
