"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, X } from "lucide-react";
import {
  SECTION_REGISTRY,
  siteConfigSchema,
  type SiteConfig,
} from "../../../../shared/config";

export type StudioPhoto = {
  id: string;
  altText: string | null;
  width: number | null;
  height: number | null;
  albumTitle: string;
  thumbUrl: string;
};

type PhotoTarget = "global" | "patch" | `section:${string}`;

export function StudioPhotosPanel({
  config,
  photos,
  loading,
  error,
  onLoad,
  onChange,
}: {
  config: SiteConfig;
  photos: StudioPhoto[];
  loading: boolean;
  error: string | null;
  onLoad: () => void;
  onChange: (next: SiteConfig, message: string) => void;
}) {
  const [target, setTarget] = useState<PhotoTarget>("global");
  const [query, setQuery] = useState("");

  useEffect(() => {
    onLoad();
  }, [onLoad]);

  const reel = config.pages.home.sections.find((section) => section.type === "photo-reel");
  const photoSections = config.pages.home.sections.filter((section) =>
    (SECTION_REGISTRY[section.type].allowedSurfaces as readonly string[]).includes("photo"),
  );
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("pt-BR");
    if (!normalized) return photos;
    return photos.filter((photo) =>
      `${photo.albumTitle} ${photo.altText ?? ""}`.toLocaleLowerCase("pt-BR").includes(normalized),
    );
  }, [photos, query]);

  function selectedIds(): string[] {
    if (target === "global") return config.theme.background.imageId ? [config.theme.background.imageId] : [];
    if (target === "patch") return reel?.type === "photo-reel" ? reel.photoIds : [];
    const id = target.slice("section:".length);
    const section = config.pages.home.sections.find((candidate) => candidate.id === id);
    return section?.appearance.backgroundImageId ? [section.appearance.backgroundImageId] : [];
  }

  const selected = selectedIds();

  function choose(photoId: string) {
    const next = structuredClone(config);
    if (target === "global") {
      next.theme.background = {
        ...next.theme.background,
        style: "soft-image",
        assetId: null,
        imageId: photoId,
      };
      onChange(siteConfigSchema.parse(next), "Fotografia de fundo escolhida.");
      return;
    }
    if (target === "patch") {
      const targetReel = next.pages.home.sections.find((section) => section.type === "photo-reel");
      if (!targetReel || targetReel.type !== "photo-reel") return;
      if (targetReel.photoIds.includes(photoId)) {
        const withoutPhoto = targetReel.photoIds.filter((id) => id !== photoId);
        targetReel.photoIds = withoutPhoto.length >= 3 ? withoutPhoto : [];
      } else {
        const candidates = [
          ...targetReel.photoIds,
          photoId,
          ...photos.map((photo) => photo.id),
        ].filter((id, index, all) => all.indexOf(id) === index);
        if (candidates.length < 3) return;
        targetReel.photoIds = candidates.slice(0, Math.max(3, targetReel.photoIds.length + 1)).slice(0, 6);
      }
      onChange(siteConfigSchema.parse(next), "Fotografias do Patch atualizadas.");
      return;
    }
    const sectionId = target.slice("section:".length);
    const section = next.pages.home.sections.find((candidate) => candidate.id === sectionId);
    if (!section) return;
    section.appearance.surface = "photo";
    section.appearance.backgroundImageId = photoId;
    onChange(siteConfigSchema.parse(next), "Fotografia desta parte escolhida.");
  }

  function clearSelection() {
    const next = structuredClone(config);
    if (target === "global") {
      next.theme.background = {
        ...next.theme.background,
        style: "soft-image",
        assetId: "manifesto-portrait",
        imageId: null,
      };
    } else if (target === "patch") {
      const targetReel = next.pages.home.sections.find((section) => section.type === "photo-reel");
      if (targetReel?.type === "photo-reel") targetReel.photoIds = [];
    } else {
      const sectionId = target.slice("section:".length);
      const section = next.pages.home.sections.find((candidate) => candidate.id === sectionId);
      if (section) {
        section.appearance.surface = "default";
        section.appearance.backgroundImageId = null;
      }
    }
    onChange(siteConfigSchema.parse(next), "Seleção de fotografias restaurada.");
  }

  return (
    <section className="studio-panel studio-photos-panel" aria-labelledby="studio-photos-title">
      <div className="studio-panel-heading">
        <p className="eyebrow">Seu próprio acervo</p>
        <h2 id="studio-photos-title">Fotos</h2>
        <p>Escolha vendo. O Studio usa somente fotografias publicadas e prontas.</p>
      </div>

      <div className="studio-photo-targets" role="group" aria-label="Onde usar as fotografias">
        <button type="button" aria-pressed={target === "global"} onClick={() => setTarget("global")}>
          Fundo do site
        </button>
        {reel ? (
          <button type="button" aria-pressed={target === "patch"} onClick={() => setTarget("patch")}>
            Fotos do Patch
          </button>
        ) : null}
        {photoSections.map((section) => (
          <button type="button" aria-pressed={target === `section:${section.id}`} onClick={() => setTarget(`section:${section.id}`)} key={section.id}>
            Fundo · {SECTION_REGISTRY[section.type].label}
          </button>
        ))}
      </div>

      <div className="studio-photo-guidance">
        <div>
          <strong>
            {target === "patch" ? "Escolha de 3 a 6 fotos." : "Escolha uma fotografia."}
          </strong>
          <span>{selected.length ? `${selected.length} selecionada${selected.length > 1 ? "s" : ""}` : "Nenhuma foto do acervo escolhida"}</span>
        </div>
        {selected.length ? (
          <button type="button" onClick={clearSelection}><X size={16} aria-hidden="true" /> Limpar escolha</button>
        ) : null}
      </div>

      <label className="studio-photo-search">
        <span>Encontrar pelo ensaio</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: Fé e Tradição" />
      </label>

      {loading ? <div className="studio-photo-state" role="status"><ImageIcon aria-hidden="true" /> Preparando suas fotografias…</div> : null}
      {error ? <div className="studio-photo-state error" role="alert">{error}<button type="button" onClick={onLoad}>Tentar novamente</button></div> : null}
      {!loading && !error ? (
        <div className="studio-photo-grid">
          {filtered.map((photo) => {
            const active = selected.includes(photo.id);
            return (
              <button type="button" className={active ? "selected" : ""} aria-pressed={active} onClick={() => choose(photo.id)} key={photo.id}>
                <Image
                  src={photo.thumbUrl}
                  alt={photo.altText || `Fotografia do ensaio ${photo.albumTitle}`}
                  width={photo.width ?? 600}
                  height={photo.height ?? 750}
                  sizes="(max-width: 640px) 42vw, 12rem"
                  unoptimized
                />
                <span>{photo.albumTitle}</span>
                <i aria-hidden="true">{active ? "✓" : ""}</i>
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
