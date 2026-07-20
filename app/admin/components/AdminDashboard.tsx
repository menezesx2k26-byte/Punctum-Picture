"use client";

import { ArrowRight, CircleAlert, Images, Inbox, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Album = {
  id: string;
  title: string;
  status: string;
  readyImageCount: number;
  updatedAt: string;
};

type DashboardResponse = {
  albums?: Album[];
  inquiries?: { status: string }[];
  error?: { message?: string };
};

export function AdminDashboard() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [contacts, setContacts] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/admin/api/albums").then(
        (response) => response.json() as Promise<DashboardResponse>,
      ),
      fetch("/admin/api/inquiries").then(
        (response) => response.json() as Promise<DashboardResponse>,
      ),
    ])
      .then(([albumBody, inquiryBody]) => {
        if (albumBody.error) throw new Error(albumBody.error.message);
        setAlbums(albumBody.albums ?? []);
        setContacts(
          (inquiryBody.inquiries ?? []).filter(
            (inquiry: { status: string }) => inquiry.status === "new",
          ).length,
        );
      })
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : "Não foi possível carregar."),
      );
  }, []);

  const drafts = albums.filter((album) => album.status === "draft").length;
  const published = albums.filter((album) => album.status === "published").length;

  return (
    <>
      <div className="admin-topbar">
        <div>
          <p className="eyebrow">Olá, Maria Helena</p>
          <h1>Seu trabalho, em ordem.</h1>
        </div>
        <Link className="button" href="/admin/ensaios">
          <Plus size={16} /> Novo ensaio
        </Link>
      </div>
      {error ? (
        <div className="admin-card full" role="alert">
          <CircleAlert size={20} />
          <p>{error}</p>
          <p className="admin-muted">
            No primeiro uso local, aplique as migrations do banco.
          </p>
        </div>
      ) : (
        <div className="admin-grid">
          <section className="admin-card">
            <Images size={19} aria-hidden="true" />
            <span className="admin-metric">{published}</span>
            <span className="admin-muted">ensaios publicados</span>
          </section>
          <section className="admin-card">
            <Images size={19} aria-hidden="true" />
            <span className="admin-metric">{drafts}</span>
            <span className="admin-muted">rascunhos em andamento</span>
          </section>
          <section className="admin-card">
            <Inbox size={19} aria-hidden="true" />
            <span className="admin-metric">{contacts}</span>
            <span className="admin-muted">novos contatos</span>
          </section>
          <section className="admin-card wide">
            <h2>Atualizados recentemente</h2>
            <div className="admin-list">
              {albums.slice(0, 5).map((album) => (
                <Link
                  key={album.id}
                  href={`/admin/ensaios/${album.id}`}
                  className="admin-list-item"
                >
                  <div>
                    <strong>{album.title}</strong>
                    <div className="admin-muted">
                      {album.readyImageCount ?? 0} fotos prontas
                    </div>
                  </div>
                  <span className={`status-pill ${album.status}`}>
                    {album.status === "published"
                      ? "Publicado"
                      : album.status === "archived"
                        ? "Arquivado"
                        : "Rascunho"}
                  </span>
                </Link>
              ))}
              {!albums.length && (
                <p className="admin-muted">Nenhum ensaio criado ainda.</p>
              )}
            </div>
          </section>
          <section className="admin-card">
            <h2>Próximo passo</h2>
            <p className="admin-muted">
              Crie um ensaio, envie as fotos, escolha a capa e publique quando o
              checklist estiver completo.
            </p>
            <Link className="button ghost small" href="/admin/ensaios">
              Começar <ArrowRight size={15} />
            </Link>
          </section>
        </div>
      )}
    </>
  );
}
