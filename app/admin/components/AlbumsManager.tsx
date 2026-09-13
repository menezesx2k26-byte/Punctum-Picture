"use client";

import { Archive, CircleAlert, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Album = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  readyImageCount: number;
  coverUrl: string | null;
};

type AlbumsResponse = {
  albums?: Album[];
  album?: Album;
  error?: { message?: string };
};

export function AlbumsManager() {
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/admin/api/albums");
    const body = (await response.json()) as AlbumsResponse;
    if (!response.ok) throw new Error(body.error?.message ?? "Falha ao carregar.");
    setAlbums(body.albums ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve()
      .then(load)
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : "Falha ao carregar.");
        setLoading(false);
      });
  }, [load]);

  async function create(event: FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/admin/api/albums", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const body = (await response.json()) as AlbumsResponse;
    if (!response.ok) {
      setError(body.error?.message ?? "Não foi possível criar.");
      return;
    }
    if (!body.album) {
      setError("A resposta não trouxe o ensaio criado.");
      return;
    }
    router.push(`/admin/ensaios/${body.album.id}`);
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <p className="eyebrow">Biblioteca</p>
          <h1>Ensaios</h1>
        </div>
      </div>
      <section className="admin-card full">
        <h2>Novo ensaio</h2>
        <form className="admin-form-row" onSubmit={create}>
          <input
            className="admin-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex.: Ana e Lucas em Paraty"
            minLength={2}
            maxLength={120}
            required
            aria-label="Título do novo ensaio"
          />
          <button className="button" type="submit">
            <Plus size={16} /> Criar rascunho
          </button>
        </form>
        {error && (
          <p role="alert" className="admin-muted">
            <CircleAlert size={15} /> {error}
          </p>
        )}
      </section>
      <section style={{ marginTop: "1rem" }}>
        <div className="admin-list">
          {loading && <p className="admin-muted">Carregando ensaios…</p>}
          {albums.map((album) => (
            <div className="admin-list-item" key={album.id}>
              <div>
                <strong>{album.title}</strong>
                <div className="admin-muted">
                  {album.readyImageCount ?? 0} fotos · /ensaios/{album.slug}
                </div>
              </div>
              <div className="button-row">
                <span className={`status-pill ${album.status}`}>
                  {album.status === "published"
                    ? "Publicado"
                    : album.status === "archived"
                      ? "Arquivado"
                      : "Rascunho"}
                </span>
                {album.status === "published" && (
                  <Link
                    className="icon-button"
                    href={`/ensaios/${album.slug}`}
                    aria-label={`Abrir ${album.title} no site`}
                  >
                    <ExternalLink size={15} />
                  </Link>
                )}
                <Link className="button small ghost" href={`/admin/ensaios/${album.id}`}>
                  {album.status === "archived" ? <Archive size={15} /> : null}
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
