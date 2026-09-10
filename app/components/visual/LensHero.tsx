"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import type { EditorialConfig, HomeSectionConfig } from "../../../shared/config";
import { homeSectionAttributes } from "../../sections/home/section-attributes";
import { useSceneProgress } from "./useSceneProgress";

export function LensHero({hero, copy, section}: {
  hero: {src:string; alt:string; width:number; height:number};
  copy: EditorialConfig["home"]["hero"];
  section: HomeSectionConfig;
}) {
  const ref = useSceneProgress();
  return <section ref={ref} className="lens-story" aria-labelledby="hero-title" {...homeSectionAttributes(section)}>
    <div className="lens-stage">
      <div className="lens-photograph">
        <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority unoptimized sizes="100vw" />
      </div>
      <div className="lens-housing" aria-hidden="true">
        <div className="lens-barrel"><div className="lens-glass" />
          <svg viewBox="0 0 300 300">
            {Array.from({length:6}, (_, i) => <path key={i} className="lens-blade" style={{rotate:`${i*60}deg`}} d="M150 150 L35 -40 L330 -40 L330 75 Z" />)}
          </svg>
        </div>
      </div>
      <div className="lens-title">
        <p>{copy.eyebrow}</p>
        <h1 id="hero-title"><span>{copy.title}</span><em>{copy.accent}</em></h1>
      </div>
      <div className="lens-caption"><p>{copy.body}</p></div>
      <div className="lens-navigation">
        <a href={`#after-${section.id}`} className="lens-skip">Ver fotografias <ArrowDown size={18}/></a>
        <Link href="/portfolio" className="text-link">{copy.primaryCta} <ArrowUpRight size={18}/></Link>
      </div>
    </div>
    <div id={`after-${section.id}`} className="lens-end" tabIndex={-1}/>
  </section>;
}
