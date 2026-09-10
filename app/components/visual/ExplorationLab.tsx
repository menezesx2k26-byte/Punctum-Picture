"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Maximize2, Sparkles, Film, Grid, Eye } from "lucide-react";
import type { CarouselImage } from "../../lib/portfolio";
import type { PublicAlbumSummary, PublicSiteSettings } from "../../../shared/public-content";
import { SpatialCarousel } from "./SpatialCarousel";
import { EdgeBlur } from "./EdgeBlur";
import { ExpandableDialog } from "./ExpandableDialog";

type DirectionMode = "mesa-edicao" | "cinema" | "indice-radical";

interface ExplorationLabProps {
  site: PublicSiteSettings;
  images: CarouselImage[];
  albums: PublicAlbumSummary[];
  initialDirection?: DirectionMode;
}

export function ExplorationLab({ site, images, albums, initialDirection = "mesa-edicao" }: ExplorationLabProps) {
  const [activeDirection, setActiveDirection] = useState<DirectionMode>(initialDirection);
  const [selectedPhoto, setSelectedPhoto] = useState<CarouselImage | null>(null);
  const [activeHoverAlbum, setActiveHoverAlbum] = useState<PublicAlbumSummary | null>(
    albums[0] || null
  );

  const heroPhotos = images.slice(0, 12);

  return (
    <div className="exploration-lab-root">
      {/* Header com seletor de direção */}
      <nav className="lab-selector-bar" aria-label="Seletor de Direções do Laboratório">
        <div className="lab-selector-brand">
          <span className="lab-tag">Laboratório do Director</span>
          <h2 className="lab-title">Exploração Visual: Punctum como Acontecimento</h2>
        </div>

        <div className="lab-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeDirection === "mesa-edicao"}
            className={`lab-tab-btn ${activeDirection === "mesa-edicao" ? "is-active" : ""}`}
            onClick={() => setActiveDirection("mesa-edicao")}
          >
            <Grid size={15} />
            <span>1. Mesa de Edição / Arquivo Vivo</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeDirection === "cinema"}
            className={`lab-tab-btn ${activeDirection === "cinema" ? "is-active" : ""}`}
            onClick={() => setActiveDirection("cinema")}
          >
            <Film size={15} />
            <span>2. Sequência Cinematográfica</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeDirection === "indice-radical"}
            className={`lab-tab-btn ${activeDirection === "indice-radical" ? "is-active" : ""}`}
            onClick={() => setActiveDirection("indice-radical")}
          >
            <Eye size={15} />
            <span>3. Índice Editorial Radical</span>
          </button>
        </div>
      </nav>

      {/* ÁREA DE DEMONSTRAÇÃO RENDERIZADA */}
      <main className="lab-display-viewport">
        {/* ========================================================
            DIREÇÃO 1: MESA DE EDIÇÃO / ARQUIVO VIVO
           ======================================================== */}
        {activeDirection === "mesa-edicao" && (
          <section className="lab-scene scene-mesa-edicao" aria-label="Mesa de Edição / Arquivo Vivo">
            <div className="mesa-header">
              <span className="eyebrow">Direção 1 — Profundidade Tridimensional e Tato</span>
              <h1>O arquivo respira no espaço.</h1>
              <p className="mesa-subtitle">
                As ampliações de Maria Helena ganham gravidade física e profundidade tridimensional.
                Arraste horizontalmente para girar o cilindro de negativos; clique em qualquer quadro para aproximá-lo.
              </p>
            </div>

            <div className="mesa-stage-wrapper">
              <EdgeBlur position="top" height={60} />
              <SpatialCarousel
                images={heroPhotos}
                onSelectImage={(img) => setSelectedPhoto(img)}
                autoPlay={false}
              />
              <EdgeBlur position="bottom" height={80} />
            </div>

            <div className="mesa-contact-sheet-strip">
              <div className="strip-heading">
                <span className="eyebrow">Folha de Contato — Negativos Selecionados</span>
                <span>Toque para exame em detalhe</span>
              </div>
              <div className="contact-sheet-grid">
                {images.slice(0, 8).map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    className="contact-frame"
                    onClick={() => setSelectedPhoto(img)}
                  >
                    <span className="frame-marker">#{String(i + 1).padStart(2, "0")}</span>
                    <div className="frame-image-wrapper">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        width={280}
                        height={360}
                        unoptimized
                        sizes="140px"
                      />
                    </div>
                    <span className="frame-category">{img.category}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            DIREÇÃO 2: SEQUÊNCIA CINEMATOGRÁFICA
           ======================================================== */}
        {activeDirection === "cinema" && (
          <section className="lab-scene scene-cinema" aria-label="Sequência Cinematográfica">
            <div className="cinema-hero-monument">
              <div className="cinema-hero-media">
                <Image
                  src={images[0]?.src || "/photos/p001.jpg"}
                  alt={images[0]?.alt || "Fotografia Monumental de Maria Helena"}
                  width={1920}
                  height={1080}
                  priority
                  unoptimized
                  sizes="100vw"
                  className="cinema-hero-image"
                />
                <div className="cinema-hero-vignette" />
                <EdgeBlur position="bottom" height={100} />
              </div>

              <div className="cinema-hero-overlay">
                <span className="eyebrow">Punctum Picture · Maria Helena</span>
                <h1 className="cinema-hero-headline">
                  O tempo não corre.
                  <br />
                  <em>Ele precipita.</em>
                </h1>
                <div className="cinema-hero-colophon">
                  <span>Cena 01 — Presença e Gesto</span>
                  <span>Joinville · Curitiba · Brasil</span>
                </div>
              </div>
            </div>

            <div className="cinema-montage-spread">
              <div className="montage-left">
                <div className="montage-crop-intimate">
                  <Image
                    src={images[1]?.src || "/photos/p002.jpg"}
                    alt="Detalhe de olhar e textura"
                    width={800}
                    height={1000}
                    unoptimized
                    sizes="40vw"
                  />
                  <span className="montage-caption">Corte I — O detalhe involuntário</span>
                </div>
              </div>

              <div className="montage-right">
                <div className="montage-statement">
                  <p className="montage-quote">
                    “Não busco o momento perfeito da pose, mas o segundo imediatamente anterior —
                    quando a pessoa ainda não se armou contra a lente.”
                  </p>
                  <span className="montage-author">— Maria Helena</span>
                </div>

                <div className="montage-counterpoint">
                  <Image
                    src={images[2]?.src || "/photos/p003.jpg"}
                    alt="Contraponto documental"
                    width={900}
                    height={600}
                    unoptimized
                    sizes="45vw"
                  />
                  <span className="montage-caption">Corte II — Luz lateral, palco aberto</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ========================================================
            DIREÇÃO 3: ÍNDICE EDITORIAL RADICAL / PASSAGEM DE LUZ
           ======================================================== */}
        {activeDirection === "indice-radical" && (
          <section className="lab-scene scene-indice-radical" aria-label="Índice Editorial Radical">
            <div className="radical-backdrop">
              {activeHoverAlbum && (
                <div className="radical-backdrop-image-container">
                  <Image
                    src={activeHoverAlbum.coverUrl || images[0]?.src || "/photos/p001.jpg"}
                    alt={activeHoverAlbum.title}
                    fill
                    unoptimized
                    sizes="100vw"
                    className="radical-stage-photo"
                  />
                  <div className="radical-backdrop-overlay" />
                  <EdgeBlur position="bottom" height={120} />
                </div>
              )}
            </div>

            <div className="radical-content-layer">
              <div className="radical-intro">
                <span className="eyebrow">Índice Editorial Vivo</span>
                <p>
                  Passe o cursor ou toque nos ensaios para fazer a fotografia varrer o plano central.
                  O texto atua como monumento estrutural.
                </p>
              </div>

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
                    <Link href={`/ensaios/${album.slug}`} className="radical-project-link">
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
                  <div className="active-detail-card">
                    <span className="active-detail-eyebrow">Em Foco</span>
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
          </section>
        )}
      </main>

      {/* Modal expansível para exame da fotografia */}
      <ExpandableDialog image={selectedPhoto} onClose={() => setSelectedPhoto(null)} />
    </div>
  );
}
