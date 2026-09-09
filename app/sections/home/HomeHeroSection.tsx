import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { EditorialConfig, HomeSectionConfig } from "../../../shared/config";
import type { CarouselImage } from "../../lib/portfolio";
import { resolveConfiguredHeroVisual } from "../../lib/public-visuals";
import { homeSectionAttributes } from "./section-attributes";

export function HomeHeroSection({ copy, section, images = [] }: {
  copy: EditorialConfig["home"]["hero"];
  section: HomeSectionConfig;
  images?: readonly CarouselImage[];
}) {
  const hero = resolveConfiguredHeroVisual(
    section.type === "hero" ? section.heroMedia : null,
    section.appearance.backgroundImageId,
    images,
  );
  const counterpoint = images.find((image) => image.albumSlug && image.src !== hero.src);
  return (
    <section className="hero" aria-labelledby="hero-title" {...homeSectionAttributes(section)}>
      <div className="hero-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 id="hero-title"><span>{copy.title}</span><span>{copy.accent}</span></h1>
        <p className="hero-description">{copy.body}</p>
        <div className="hero-links">
          <Link className="text-link" href="/portfolio">{copy.primaryCta}<ArrowDownRight size={18} /></Link>
          <Link className="quiet-link" href="/arquivo">{copy.secondaryCta}<ArrowUpRight size={15} /></Link>
        </div>
        {counterpoint ? (
          <Link className="hero-counterpoint" href={`/ensaios/${counterpoint.albumSlug}`}>
            <Image src={counterpoint.src} alt={counterpoint.alt} width={300} height={400} unoptimized sizes="18vw" />
            <span><small>Do acervo</small>{counterpoint.albumTitle}<ArrowUpRight size={14} /></span>
          </Link>
        ) : null}
      </div>
      <figure className="hero-image">
        <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority unoptimized sizes="(max-width: 700px) 100vw, 52vw" />
        <figcaption><span>Maria Helena</span><span>Punctum Picture — fotografia autoral</span></figcaption>
      </figure>
      <div className="hero-colophon" aria-hidden="true"><span>Presença. Gesto. Movimento.</span><span>Um olhar, muitas histórias ↓</span></div>
    </section>
  );
}
