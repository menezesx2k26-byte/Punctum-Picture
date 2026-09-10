"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Sparkles, Grid, Layers } from "lucide-react";
import type { PublicAlbumSummary } from "../../shared/public-content";
import { albumArtworkSource } from "../lib/album-artwork";
import { EssayLink } from "./EssayLink";
import { EdgeBlur } from "./visual/EdgeBlur";

export function FeaturedStories({
  albums,
  variant = "editorial-grid",
}: {
  albums: PublicAlbumSummary[];
  variant?: "editorial-grid" | "gallery" | "collage";
}) {
  const [mode, setMode] = useState<"projector" | "editorial" | "collage">(
    variant === "collage" ? "collage" : "projector"
  );
  const [activeHoverAlbum, setActiveHoverAlbum] = useState<PublicAlbumSummary | null>(
    albums[0] || null
  );

  if (!albums.length) return null;

  return (
    <div className="featured-stories-container">
      {/* Seletor Curatorial de Visualização */}
      <div className="stories-view-bar" role="group" aria-label="Modo de visualização dos ensaios">
        <span className="view-bar-label">Curadoria Visual:</span>
        <div className="view-bar-buttons">
          <button
            type="button"
            onClick={() => setMode("projector")}
            className={`view-switch-btn ${mode === "projector" ? "is-active" : ""}`}
            aria-pressed={mode === "projector"}
          >
            <Sparkles size={13} />
            <span>Passagem de Luz</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("editorial")}
            className={`view-switch-btn ${mode === "editorial" ? "is-active" : ""}`}
            aria-pressed={mode === "editorial"}
          >
            <Grid size={13} />
            <span>Grade Editorial</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("collage")}
            className={`view-switch-btn ${mode === "collage" ? "is-active" : ""}`}
            aria-pressed={mode === "collage"}
          >
            <Layers size={13} />
            <span>Pranchas</span>
          </button>
        </div>
      </div>

      {/* MODO 1: PASSAGEM DE LUZ (Índice Editorial com Fundo Projetado) */}
      {mode === "projector" && (
        <div className="scene-indice-radical stories-projector-stage">
          <div className="radical-backdrop">
            {activeHoverAlbum && (
              <div className="radical-backdrop-image-container">
                <Image
                  src={albumArtworkSource(activeHoverAlbum) || "/photos/p001.jpg"}
                  alt={activeHoverAlbum.title}
                  fill
                  unoptimized
                  priority
                  sizes="100vw"
                  className="radical-stage-photo"
                />
                <div className="radical-backdrop-overlay" />
                <EdgeBlur position="bottom" height={100} />
              </div>
            )}
          </div>

          <div className="radical-content-layer">
            <ul className="radical-project-list">
              {albums.map((album, idx) => (
                <li
                  key={album.id}
                  className={`radical-project-item ${
                    activeHoverAlbum?.id === album.id ? "is-focused" : ""
                  }`}
                  onMouseEnter={() => setActiveHoverAlbum(album)}
                  onTouchStart={() => setActiveHoverAlbum(album)}
                >
                  <Link
                    href={`/ensaios/${album.slug}`}
                    className="radical-project-link"
                    data-cursor="open"
                  >
                    <span className="radical-idx">{String(idx + 1).padStart(2, "0")}</span>
                    <span className="radical-title">{album.title}</span>
                    <span className="radical-category">
                      {album.categories.map((c) => c.name).join(" · ")}
                    </span>
                    <ArrowUpRight className="radical-arrow" size={24} />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="radical-active-detail">
              {activeHoverAlbum && (
                <div className="active-detail-card" data-cursor="open">
                  <span className="active-detail-eyebrow">Ensaio em Foco</span>
                  <h3 className="active-detail-title">{activeHoverAlbum.title}</h3>
                  {activeHoverAlbum.subtitle && (
                    <p className="active-detail-sub">{activeHoverAlbum.subtitle}</p>
                  )}
                  <Link
                    href={`/ensaios/${activeHoverAlbum.slug}`}
                    className="text-link"
                  >
                    Mergulhar neste ensaio <ArrowUpRight size={16} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODO 2: GRADE EDITORIAL */}
      {mode === "editorial" && (
        <div className="editorial-stories-layout">
          {albums[0] ? (
            <Link
              href={`/ensaios/${albums[0].slug}`}
              className="editorial-lead-story"
              data-cursor="open"
            >
              <div className="editorial-lead-artwork">
                {albumArtworkSource(albums[0]) ? (
                  <Image
                    src={albumArtworkSource(albums[0])!}
                    alt={`Capa do ensaio ${albums[0].title}`}
                    width={1800}
                    height={1100}
                    unoptimized
                    priority
                    sizes="(max-width: 900px) 100vw, 85vw"
                    className="editorial-lead-image"
                  />
                ) : null}
                <div className="editorial-lead-badge">
                  <span>DESTAQUE CURATORIAL · ENSAIO 01</span>
                </div>
              </div>
              <div className="editorial-lead-info">
                <div className="editorial-lead-kicker">
                  <span className="editorial-lead-category">
                    {albums[0].categories.map((c) => c.name).join(" · ")}
                  </span>
                  <span className="editorial-lead-loc">Joinville & Curitiba</span>
                </div>
                <h3 className="editorial-lead-title">{albums[0].title}</h3>
                {albums[0].subtitle ? (
                  <p className="editorial-lead-sub">{albums[0].subtitle}</p>
                ) : null}
                <span className="text-link editorial-lead-cta">
                  Abrir ensaio completo <ArrowUpRight size={16} />
                </span>
              </div>
            </Link>
          ) : null}

          {albums.length > 1 ? (
            <div className="editorial-secondary-grid">
              {albums.slice(1).map((album, index) => (
                <EssayLink
                  key={album.id}
                  album={album}
                  index={index + 1}
                  heading="h3"
                />
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* MODO 3: PRANCHAS DE COLAGEM TÁTIL */}
      {mode === "collage" && (
        <div className="stories-collage-layout">
          {albums.map((album, index) => {
            const source = albumArtworkSource(album);
            return (
              <Link
                key={album.id}
                href={`/ensaios/${album.slug}`}
                className={`collage-story-plate collage-plate-${index + 1}`}
                data-cursor="open"
              >
                <div className="collage-photo-frame">
                  <span className="collage-tape-mark" aria-hidden="true" />
                  {source ? (
                    <Image
                      src={source}
                      alt={`Capa do ensaio ${album.title}`}
                      width={1200}
                      height={900}
                      unoptimized
                      sizes="(max-width: 700px) 90vw, 36vw"
                    />
                  ) : null}
                </div>
                <div className="collage-caption">
                  <small className="collage-number">PRANCHA {String(index + 1).padStart(2, "0")}</small>
                  <h4>{album.title}</h4>
                  <p>{album.categories.map((c) => c.name).join(" · ")}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
