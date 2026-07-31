"use client";

import { useEffect, useState } from "react";

type Stats = {
  photoCount: number;
  albumCount: number;
  categoryCount: number;
};

type Variant =
  | "archive-range"
  | "archive-summary"
  | "portfolio-eyebrow"
  | "archive-link"
  | "hero-index"
  | "stories-link";

let cachedStats: Stats | null = null;
let statsRequest: Promise<Stats> | null = null;

function loadStats() {
  if (cachedStats) return Promise.resolve(cachedStats);
  if (!statsRequest) {
    statsRequest = fetch("/api/public/stats", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível carregar as estatísticas.");
        const body = (await response.json()) as { stats?: Stats };
        if (!body.stats) throw new Error("Estatísticas ausentes.");
        cachedStats = body.stats;
        return body.stats;
      })
      .finally(() => {
        statsRequest = null;
      });
  }
  return statsRequest;
}

function countLabel(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function statText(stats: Stats, variant: Variant) {
  const paddedPhotos = Math.max(1, stats.photoCount).toString().padStart(3, "0");
  switch (variant) {
    case "archive-range":
      return `Arquivo completo · 001—${paddedPhotos}`;
    case "archive-summary":
      return `${countLabel(stats.albumCount, "história", "histórias")} · ${countLabel(
        stats.categoryCount,
        "território visual",
        "territórios visuais",
      )}`;
    case "portfolio-eyebrow":
      return `Portfólio · ${countLabel(stats.albumCount, "história", "histórias")}`;
    case "archive-link":
      return `Preferir o arquivo completo — ${countLabel(stats.photoCount, "imagem", "imagens")}`;
    case "hero-index":
      return `001 / ${paddedPhotos}`;
    case "stories-link":
      return `Ver ${stats.albumCount === 1 ? "a" : "as"} ${countLabel(
        stats.albumCount,
        "história",
        "histórias",
      )}`;
  }
}

function pendingText(variant: Variant) {
  switch (variant) {
    case "archive-range":
      return "Arquivo completo";
    case "archive-summary":
      return "Arquivo vivo";
    case "portfolio-eyebrow":
      return "Portfólio";
    case "archive-link":
      return "Preferir o arquivo completo";
    case "hero-index":
      return "Arquivo vivo";
    case "stories-link":
      return "Ver histórias";
  }
}

export function PublicStatsText({ variant }: { variant: Variant }) {
  const [stats, setStats] = useState<Stats | null>(cachedStats);

  useEffect(() => {
    let active = true;
    loadStats()
      .then((value) => {
        if (active) setStats(value);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <span className="live-stat" aria-live="polite">
      {stats ? statText(stats, variant) : pendingText(variant)}
    </span>
  );
}
