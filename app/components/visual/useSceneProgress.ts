"use client";

import { useEffect, useRef } from "react";

/** One active scene, one scheduled paint. Content is visible before hydration. */
export function useSceneProgress() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let active = false;
    const paint = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const viewport = document.documentElement.clientHeight;
      const travel = Math.max(1, rect.height - viewport);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      scene.style.setProperty("--scene-progress", String(progress));
      scene.style.setProperty("--arrival", String(Math.max(0, Math.min(1, (viewport - rect.top) / viewport))));
    };
    const request = () => { if (active && !frame && !media.matches) frame = requestAnimationFrame(paint); };
    const preference = () => {
      scene.dataset.motion = media.matches ? "reduced" : "ready";
      paint();
    };
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; request(); }, {rootMargin:"100px"});
    observer.observe(scene);
    const resize = new ResizeObserver(request);
    resize.observe(scene);
    addEventListener("scroll", request, {passive:true});
    addEventListener("resize", request);
    media.addEventListener("change", preference);
    preference();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect(); resize.disconnect();
      removeEventListener("scroll", request); removeEventListener("resize", request);
      media.removeEventListener("change", preference);
      delete scene.dataset.motion;
    };
  }, []);
  return ref;
}
