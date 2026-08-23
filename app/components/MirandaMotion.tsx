"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function MirandaMotionRoot({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const revealImmediately = (item: HTMLElement) =>
      item.setAttribute("data-miranda-state", "visible");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      root
        .querySelectorAll<HTMLElement>("[data-miranda-reveal]")
        .forEach(revealImmediately);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          revealImmediately(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    const observe = (item: HTMLElement) => {
      if (item.getAttribute("data-miranda-state") === "visible") return;
      observer.observe(item);
    };

    root
      .querySelectorAll<HTMLElement>("[data-miranda-reveal]")
      .forEach(observe);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-miranda-reveal]")) observe(node);
          node
            .querySelectorAll<HTMLElement>("[data-miranda-reveal]")
            .forEach(observe);
        });
      }
    });
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div className={className} ref={rootRef}>
      {children}
    </div>
  );
}
