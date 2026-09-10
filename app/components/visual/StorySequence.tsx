"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicAlbumSummary } from "../../../shared/public-content";
import { albumArtworkSource } from "../../lib/album-artwork";
import { useSceneProgress } from "./useSceneProgress";

function Story({album}: {album:PublicAlbumSummary}) {
  const ref = useSceneProgress();
  const source = albumArtworkSource(album);
  return <article ref={ref} className={`sequence-story${source ? "" : " sequence-story-without-cover"}`}>
    <div className="sequence-stage">
      {source && <Link className="sequence-art" href={`/ensaios/${album.slug}`} aria-label={`Ver ensaio ${album.title}`}>
        <Image src={source} alt={`Capa do ensaio ${album.title}`} width={1600} height={1200} unoptimized sizes="(min-width: 900px) 72vw, 100vw"/>
      </Link>}
      <div className="sequence-caption">
        <p>{album.categories.map(c=>c.name).join(" · ")}</p>
        <h3><Link href={`/ensaios/${album.slug}`}>{album.title}</Link></h3>
        {album.subtitle && <p className="sequence-description">{album.subtitle}</p>}
        <Link className="text-link" href={`/ensaios/${album.slug}`}>Ver ensaio <ArrowUpRight size={18}/></Link>
      </div>
    </div>
  </article>;
}

export function StorySequence({albums}: {albums:PublicAlbumSummary[]}) {
  return <div className="story-sequence">{albums.map(album=><Story key={album.id} album={album}/>)}</div>;
}
