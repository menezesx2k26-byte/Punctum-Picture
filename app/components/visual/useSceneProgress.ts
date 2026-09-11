"use client";

import { useEffect, useRef } from "react";
import { motionPreference, subscribeMotion } from "./motion-preference";

/** One active scene, one scheduled paint. Content is visible before hydration. */
export function useSceneProgress() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const scene = ref.current;
    if (!scene) return;
    let frame = 0;
    let fitFrame = 0;
    let active = false;
    let reduced = false;
    const paint = () => {
      frame = 0;
      const rect = scene.getBoundingClientRect();
      const viewport = document.documentElement.clientHeight;
      const travel = Math.max(1, rect.height - viewport);
      const progress = Math.max(0, Math.min(1, -rect.top / travel));
      scene.style.setProperty("--scene-progress", String(progress));
      scene.style.setProperty("--arrival", String(Math.max(0, Math.min(1, (viewport - rect.top) / viewport))));
    };
    const request = () => { if (active && !frame && !reduced) frame = requestAnimationFrame(paint); };
    const preference = () => {
      reduced = motionPreference() !== "full";
      scene.dataset.motion = reduced ? "reduced" : "ready";
      paint();
    };
    const observer = new IntersectionObserver(([entry]) => { active = entry.isIntersecting; request(); }, {rootMargin:"100px"});
    observer.observe(scene);
    const resize = new ResizeObserver(request);
    resize.observe(scene);
    const stage = scene.firstElementChild;
    const checkFit = () => {
      fitFrame = 0;
      if (stage) {
        const tall = String(stage.scrollHeight > innerHeight - 24);
        if (scene.dataset.tall !== tall) scene.dataset.tall = tall;
      }
      const title = scene.querySelector<HTMLElement>(".lens-title");
      const navigation = scene.querySelector<HTMLElement>(".lens-navigation");
      if (title && navigation) {
        const overflow = String(title.scrollHeight + navigation.scrollHeight + 120 > innerHeight * .55);
        if (scene.dataset.textOverflow !== overflow) scene.dataset.textOverflow = overflow;
      }
      request();
    };
    const requestFit = () => { if (!fitFrame) fitFrame = requestAnimationFrame(checkFit); };
    const fit = new ResizeObserver(requestFit);
    if (stage) fit.observe(stage);
    const title = scene.querySelector(".lens-title");
    if (title) fit.observe(title);
    const navigation = scene.querySelector(".lens-navigation");
    if (navigation) fit.observe(navigation);
    addEventListener("scroll", request, {passive:true});
    addEventListener("resize", requestFit);
    const unsubscribe = subscribeMotion(preference);
    preference();
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(fitFrame);
      observer.disconnect(); resize.disconnect(); fit.disconnect();
      removeEventListener("scroll", request); removeEventListener("resize", requestFit);
      unsubscribe();
      delete scene.dataset.motion;
    };
  }, []);
  return ref;
}
