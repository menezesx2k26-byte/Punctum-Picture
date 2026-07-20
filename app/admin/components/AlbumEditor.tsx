"use client";

import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  CircleAlert,
  Grip,
  Image as ImageIcon,
  Save,
  Star,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

type AlbumImage = {
  id: string;
  status: "pending" | "ready" | "failed";
  altText: string | null;
  thumbUrl: string | null;
  position: number;
};

type Album = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  location: string | null;
  shootDate: string | null;
  status: "draft" | "published" | "archived";
  coverImageId: string | null;
  slug: string;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  images: AlbumImage[];
  categories: Array<{ id: string; name: string }>;
};

type Category = { id: string; name: string };
type UploadState = {
  id: string;
  file: File;
  progress: number;
  status: "waiting" | "uploading" | "done" | "failed";
  error?: string;
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const body = (await response.json()) as T & { error?: { message?: string } };
  if (!response.ok) {
    throw new Error(body.error?.message ?? "Não foi possível concluir.");
  }
  return body;
}

function SortablePhoto({
  image,
  isCover,
  onCover,
  onMove,
  onAltText,
  onDelete,
}: {
  image: AlbumImage;
  isCover: boolean;
  onCover: () => void;
  onMove: (direction: -1 | 1) => void;
  onAltText: (value: string) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: image.id });
  return (
    <article
      ref={setNodeRef}
      className="photo-tile"
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
      }}
    >
      {image.thumbUrl ? (
        <Image src={image.thumbUrl} alt="" width={320} height={320} />
      ) : (
        <div
          style={{
            aspectRatio: 1,
            display: "grid",
            placeItems: "center",
            background: "#e7e2d8",
          }}
        >
          <ImageIcon aria-hidden="true" />
        </div>
      )}
      <div className="photo-tile-actions">
        <button
          className="icon-button"
          type="button"
          aria-label="Arrastar para reordenar"
          {...attributes}
          {...listeners}
        >
          <Grip size={15} />
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label="Mover foto para cima"
          onClick={() => onMove(-1)}
        >
          <ArrowUp size={15} />
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label="Mover foto para baixo"
          onClick={() => onMove(1)}
        >
          <ArrowDown size={15} />
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label={isCover ? "Foto de capa atual" : "Usar como capa"}
          onClick={onCover}
        >
          <Star size={15} fill={isCover ? "currentColor" : "none"} />
        </button>
        <button
          className="icon-button"
          type="button"
          aria-label="Excluir foto"
          onClick={onDelete}
        >
          <Trash2 size={15} />
        </button>
      </div>
      <label style={{ display: "grid", gap: ".3rem", padding: "0 .6rem .7rem" }}>
        <span style={{ fontSize: ".63rem", fontWeight: 700 }}>Texto alternativo</span>
        <input
          className="admin-input"
          defaultValue={image.altText ?? ""}
          maxLength={240}
          onBlur={(event) => onAltText(event.target.value)}
          placeholder="Descreva a foto"
        />
      </label>
      <span
        className={`status-pill ${image.status}`}
        style={{ position: "absolute", top: ".5rem", left: ".5rem" }}
      >
        {image.status === "ready"
          ? "Pronta"
          : image.status === "failed"
            ? "Falhou"
            : "Processando"}
      </span>
    </article>
  );
}

export function AlbumEditor({ albumId }: { albumId: string }) {
  const [album, setAlbum] = useState<Album | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState<null | (() => Promise<void>)>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const load = useCallback(async () => {
    const [albumBody, categoryBody] = await Promise.all([
      api<{ album: Album }>(`/admin/api/albums/${albumId}`),
      api<{ categories: Category[] }>("/admin/api/categories"),
    ]);
    setAlbum(albumBody.album);
    setCategories(categoryBody.categories);
  }, [albumId]);

  useEffect(() => {
    load().catch((reason) =>
      setError(reason instanceof Error ? reason.message : "Não foi possível carregar."),
    );
  }, [load]);

  const checklist = useMemo(
    () => ({
      title: Boolean(album?.title.trim()),
      slug: Boolean(album?.slug.trim()),
      cover: Boolean(album?.coverImageId),
      photos: Boolean(album?.images.some((image) => image.status === "ready")),
      url: Boolean(album?.slug.trim()),
    }),
    [album],
  );
  const canPublish = Object.values(checklist).every(Boolean);
  const totalUploadProgress = useMemo(
    () =>
      uploads.length
        ? Math.round(
            uploads.reduce((total, item) => total + item.progress, 0) /
              uploads.length,
          )
        : 0,
    [uploads],
  );

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    if (!album) return;
    try {
      const body = await api<{ album: Album }>(`/admin/api/albums/${albumId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: album.title,
          subtitle: album.subtitle,
          description: album.description,
          location: album.location,
          shootDate: album.shootDate,
          featured: album.featured,
          seoTitle: album.seoTitle,
          seoDescription: album.seoDescription,
          categoryIds: album.categories.map((category) => category.id),
        }),
      });
      setAlbum((current) => (current ? { ...current, ...body.album } : current));
      showToast("Ensaio salvo.");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Não foi possível salvar.");
    }
  }

  async function persistOrder(images: AlbumImage[]) {
    await api(`/admin/api/albums/${albumId}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageIds: images.map((image) => image.id) }),
    });
  }

  async function onDragEnd(event: DragEndEvent) {
    if (!album || !event.over || event.active.id === event.over.id) return;
    const oldIndex = album.images.findIndex((image) => image.id === event.active.id);
    const newIndex = album.images.findIndex((image) => image.id === event.over?.id);
    const images = arrayMove(album.images, oldIndex, newIndex);
    setAlbum({ ...album, images });
    try {
      await persistOrder(images);
      showToast("Ordem atualizada.");
    } catch {
      await load();
      setError("Não foi possível salvar a nova ordem.");
    }
  }

  async function moveImage(index: number, direction: -1 | 1) {
    if (!album) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= album.images.length) return;
    const images = arrayMove(album.images, index, nextIndex);
    setAlbum({ ...album, images });
    await persistOrder(images);
  }

  async function chooseCover(imageId: string) {
    await api(`/admin/api/albums/${albumId}/cover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });
    setAlbum((current) => (current ? { ...current, coverImageId: imageId } : current));
    showToast("Capa atualizada.");
  }

  async function updateAlt(imageId: string, altText: string) {
    await api(`/admin/api/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ altText }),
    });
    showToast("Texto alternativo salvo.");
  }

  async function deleteImage(imageId: string) {
    await api(`/admin/api/images/${imageId}`, { method: "DELETE" });
    await load();
    showToast("Foto removida.");
  }

  const uploadFile = useCallback(async (item: UploadState): Promise<void> => {
    setUploads((current) =>
      current.map((entry) =>
        entry.id === item.id ? { ...entry, status: "uploading", progress: 0 } : entry,
      ),
    );
    try {
      const intent = await api<{
        intentId: string;
        uploadUrl: string;
        requiredHeaders: Record<string, string>;
      }>("/admin/api/uploads/intents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          albumId,
          filename: item.file.name,
          mimeType: item.file.type,
          sizeBytes: item.file.size,
        }),
      });
      const etag = await new Promise<string | null>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", intent.uploadUrl);
        for (const [name, value] of Object.entries(intent.requiredHeaders)) {
          xhr.setRequestHeader(name, value);
        }
        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          setUploads((current) =>
            current.map((entry) =>
              entry.id === item.id
                ? { ...entry, progress: Math.round((event.loaded / event.total) * 100) }
                : entry,
            ),
          );
        };
        xhr.onerror = () => reject(new Error("A conexão foi interrompida."));
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.getResponseHeader("etag"));
          } else {
            reject(new Error(`O envio retornou ${xhr.status}.`));
          }
        };
        xhr.send(item.file);
      });
      await api(`/admin/api/uploads/${intent.intentId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etag: etag ?? undefined }),
      });
      setUploads((current) =>
        current.map((entry) =>
          entry.id === item.id ? { ...entry, status: "done", progress: 100 } : entry,
        ),
      );
    } catch (reason) {
      setUploads((current) =>
        current.map((entry) =>
          entry.id === item.id
            ? {
                ...entry,
                status: "failed",
                error: reason instanceof Error ? reason.message : "Falha no envio.",
              }
            : entry,
        ),
      );
    }
  }, [albumId]);

  const onDrop = useCallback(
    async (files: File[]) => {
      const items = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        progress: 0,
        status: "waiting" as const,
      }));
      setUploads((current) => [...current, ...items]);
      for (let index = 0; index < items.length; index += 3) {
        await Promise.all(items.slice(index, index + 3).map(uploadFile));
      }
      await load();
      showToast("Envios concluídos.");
    },
    [load, showToast, uploadFile],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 26_214_400,
    multiple: true,
  });

  async function publish() {
    const body = await api<{ status: Album["status"] }>(
      `/admin/api/albums/${albumId}/publish`,
      { method: "POST" },
    );
    setAlbum((current) => (current ? { ...current, status: body.status } : current));
    showToast("Ensaio publicado.");
  }

  async function archive() {
    await api(`/admin/api/albums/${albumId}/archive`, { method: "POST" });
    setAlbum((current) => (current ? { ...current, status: "archived" } : current));
    setConfirm(null);
    showToast("Ensaio arquivado.");
  }

  if (error && !album) {
    return (
      <div className="admin-card full" role="alert">
        <CircleAlert />
        <p>{error}</p>
        <Link className="button ghost small" href="/admin/ensaios">
          Voltar
        </Link>
      </div>
    );
  }
  if (!album) return <p className="admin-muted">Carregando ensaio…</p>;

  return (
    <>
      <div className="admin-topbar">
        <div>
          <Link className="eyebrow" href="/admin/ensaios">
            <ArrowLeft size={14} /> Ensaios
          </Link>
          <h1>{album.title}</h1>
          <span className={`status-pill ${album.status}`}>
            {album.status === "published"
              ? "Publicado"
              : album.status === "archived"
                ? "Arquivado"
                : "Rascunho"}
          </span>
        </div>
        <div className="button-row">
          <button className="button ghost" type="button" onClick={() => setConfirm(() => archive)}>
            Arquivar
          </button>
          <button className="button" type="button" onClick={publish} disabled={!canPublish}>
            Publicar
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="admin-card full">
          <CircleAlert size={16} /> {error}
        </p>
      )}

      <form className="admin-grid" onSubmit={save}>
        <section className="admin-card wide">
          <h2>Informações do ensaio</h2>
          <div className="admin-form">
            <label>
              <span>Título</span>
              <input
                className="admin-input"
                value={album.title}
                onChange={(event) => setAlbum({ ...album, title: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Subtítulo</span>
              <input
                className="admin-input"
                value={album.subtitle ?? ""}
                onChange={(event) => setAlbum({ ...album, subtitle: event.target.value })}
              />
            </label>
            <label>
              <span>Descrição</span>
              <textarea
                className="admin-input"
                value={album.description ?? ""}
                onChange={(event) => setAlbum({ ...album, description: event.target.value })}
              />
            </label>
            <div className="admin-form-row">
              <label>
                <span>Local</span>
                <input
                  className="admin-input"
                  value={album.location ?? ""}
                  onChange={(event) => setAlbum({ ...album, location: event.target.value })}
                />
              </label>
              <label>
                <span>Data do ensaio</span>
                <input
                  className="admin-input"
                  type="date"
                  value={album.shootDate ?? ""}
                  onChange={(event) => setAlbum({ ...album, shootDate: event.target.value })}
                />
              </label>
            </div>
            <fieldset style={{ border: 0, padding: 0 }}>
              <legend>Categorias</legend>
              <div className="button-row">
                {categories.map((category) => {
                  const checked = album.categories.some((item) => item.id === category.id);
                  return (
                    <label key={category.id} className="status-pill">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          setAlbum({
                            ...album,
                            categories: checked
                              ? album.categories.filter((item) => item.id !== category.id)
                              : [...album.categories, category],
                          })
                        }
                      />
                      {category.name}
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <button className="button" type="submit">
              <Save size={15} /> Salvar informações
            </button>
          </div>
        </section>

        <aside className="admin-card">
          <h2>Checklist de publicação</h2>
          <div className="checklist">
            {[
              ["title", "Título definido"],
              ["slug", "Slug válido"],
              ["cover", "Capa selecionada"],
              ["photos", "Pelo menos 1 foto pronta"],
              ["url", "URL disponível"],
            ].map(([key, label]) => (
              <div
                className={`check-item${checklist[key as keyof typeof checklist] ? " done" : ""}`}
                key={key}
              >
                {checklist[key as keyof typeof checklist] ? (
                  <Check size={16} />
                ) : (
                  <CircleAlert size={16} />
                )}
                {label}
              </div>
            ))}
          </div>
        </aside>

        <section className="admin-card full">
          <h2>Enviar fotos</h2>
          <div
            {...getRootProps({
              className: `dropzone${isDragActive ? " active" : ""}`,
            })}
          >
            <input {...getInputProps()} />
            <UploadCloud size={28} />
            <strong>Solte as fotos aqui ou toque para escolher</strong>
            <span className="admin-muted">
              JPG, PNG ou WebP · até 25 MB · 3 envios por vez
            </span>
          </div>
          {uploads.length > 0 && (
            <div className="upload-total" aria-live="polite">
              <div className="admin-form-row">
                <strong>Progresso total</strong>
                <span>{totalUploadProgress}%</span>
              </div>
              <div className="progress" aria-hidden="true">
                <span style={{ width: `${totalUploadProgress}%` }} />
              </div>
            </div>
          )}
          <div className="upload-list">
            {uploads.map((item) => (
              <div className="upload-row" key={item.id}>
                <div>
                  <strong>{item.file.name}</strong>
                  <div className="progress">
                    <span style={{ width: `${item.progress}%` }} />
                  </div>
                  {item.error && <span className="admin-muted">{item.error}</span>}
                </div>
                {item.status === "failed" ? (
                  <button className="button small ghost" type="button" onClick={() => uploadFile(item)}>
                    Tentar de novo
                  </button>
                ) : (
                  <span className={`status-pill ${item.status}`}>
                    {item.status === "done"
                      ? "Concluído"
                      : item.status === "uploading"
                        ? `${item.progress}%`
                        : "Na fila"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      </form>

      <section className="admin-card full" style={{ marginTop: "1rem" }}>
        <h2>Fotos do ensaio</h2>
        {album.images.length ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={album.images.map((image) => image.id)} strategy={rectSortingStrategy}>
              <div className="photo-manager">
                {album.images.map((image, index) => (
                  <SortablePhoto
                    key={image.id}
                    image={image}
                    isCover={album.coverImageId === image.id}
                    onCover={() => chooseCover(image.id)}
                    onMove={(direction) => moveImage(index, direction)}
                    onAltText={(value) => updateAlt(image.id, value)}
                    onDelete={() => setConfirm(() => () => deleteImage(image.id).then(() => setConfirm(null)))}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <p className="admin-muted">Envie as primeiras fotos para começar.</p>
        )}
      </section>

      {confirm && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <h2 id="confirm-title">Confirmar esta ação?</h2>
            <p className="admin-muted">
              O item sairá do site, mas será mantido com segurança para recuperação.
            </p>
            <div className="button-row">
              <button className="button ghost" type="button" onClick={() => setConfirm(null)}>
                Cancelar
              </button>
              <button className="button" type="button" onClick={() => void confirm()}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
