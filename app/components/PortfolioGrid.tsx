"use client";

import { useMemo, useState } from "react";
import type { PublicAlbumSummary } from "../../shared/public-content";
import { EssayLink } from "./EssayLink";

export function PortfolioGrid({ albums }: { albums: PublicAlbumSummary[] }) {
  const [filter, setFilter] = useState("Todos");
  const categories = useMemo(() => ["Todos", ...new Set(albums.flatMap((album) => album.categories.map((category) => category.name)))], [albums]);
  const visible = filter === "Todos" ? albums : albums.filter((album) => album.categories.some((category) => category.name === filter));
  return <>
    {categories.length > 2 ? <label className="portfolio-mobile-filter">Categoria<select value={filter} onChange={(event) => setFilter(event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label> : null}
    {categories.length > 2 ? <div className="portfolio-filter" role="group" aria-label="Filtrar portfólio">{categories.map((category) => <button key={category} type="button" onClick={() => setFilter(category)} aria-pressed={filter === category}>{category}</button>)}</div> : null}
    <p className="visually-hidden" role="status">{visible.length} ensaios{filter !== "Todos" ? ` em ${filter}` : ""}</p>
    {visible.length ? <div className="essay-grid portfolio-grid">{visible.map((album, index) => <EssayLink key={album.id} album={album} index={index} heading="h2" />)}</div> : <p className="empty-state">Novas histórias estão a caminho. Volte em breve ou converse com Maria Helena.</p>}
  </>;
}
