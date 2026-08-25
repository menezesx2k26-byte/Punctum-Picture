import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { EditorialConfig, HomeSectionConfig } from "../../../shared/config";
import { PublicStatsText } from "../../components/PublicStats";
import {
  getHeroMobileMinHeight,
  getHeroObjectPosition,
  getPublicVisualAsset,
} from "../../lib/public-visuals";
import { homeSectionAttributes } from "./section-attributes";

// Mobile reproduces the approved visual: one full-bleed portrait hero with copy over the photo.
const HERO_RESPONSIVE_CSS = `
.hero-image img {
  object-position: var(--hero-object-position, 45% 42%) !important;
}

@media (max-width: 680px) {
  .hero {
    display: flex;
    min-height: var(--hero-mobile-min-height, 100svh);
    align-items: stretch;
    overflow: hidden;
    background: #080b0c;
  }

  .hero-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    overflow: hidden;
  }

  .hero-image img {
    object-fit: cover !important;
    object-position: var(--hero-mobile-object-position, 50% 50%) !important;
  }

  .hero::after {
    display: block;
    inset: 0;
    height: auto;
    background:
      linear-gradient(180deg, rgba(5, 8, 9, 0.22) 0%, rgba(5, 8, 9, 0.06) 30%, rgba(5, 8, 9, 0.34) 58%, rgba(5, 8, 9, 0.82) 100%),
      linear-gradient(90deg, rgba(5, 8, 9, 0.28) 0%, transparent 46%, rgba(5, 8, 9, 0.12) 100%);
  }

  .hero-copy {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: var(--hero-mobile-min-height, 100svh);
    width: 100%;
    margin: 0;
    padding: clamp(28rem, 52svh, 36rem) 1.5rem 3.25rem;
    flex-direction: column;
    justify-content: flex-start;
    background: transparent;
  }

  .hero .eyebrow {
    margin-bottom: 1.15rem;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
  }

  .hero .eyebrow::before {
    display: none;
  }

  .hero-copy h1,
  .hero[data-home-section-variant="editorial"] h1,
  .hero[data-home-section-variant="split"] h1 {
    max-width: 8ch;
    font-size: clamp(3.8rem, 15.5vw, 6.1rem);
    line-height: 0.84;
  }

  .hero-bottom {
    display: flex;
    margin-top: 2rem;
    padding-left: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 1.6rem;
  }

  .hero-bottom p {
    max-width: 30rem;
    font-size: 1rem;
    line-height: 1.7;
  }

  .hero .button-row {
    display: grid;
    width: min(100%, 34rem);
    gap: 0.9rem;
  }

  .hero .button {
    width: 100%;
    min-height: 4.1rem;
    border-color: rgba(255, 255, 255, 0.48);
    background: rgba(8, 10, 11, 0.52);
    color: white;
    backdrop-filter: blur(6px);
  }

  .hero .button.light.primary {
    border-color: rgba(255, 255, 255, 0.6);
    background: rgba(8, 10, 11, 0.64);
    color: white;
  }

  .hero-index {
    display: none;
  }
}
`;

export function HomeHeroSection({
  copy,
  section,
}: {
  copy: EditorialConfig["home"]["hero"];
  section: HomeSectionConfig;
}) {
  const hero = getPublicVisualAsset("hero");
  const heroStyle = {
    "--hero-object-position": getHeroObjectPosition("desktop"),
    "--hero-mobile-object-position": getHeroObjectPosition("mobile"),
    "--hero-mobile-min-height": getHeroMobileMinHeight(),
  } as CSSProperties;

  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      style={heroStyle}
      {...homeSectionAttributes(section)}
    >
      <style>{HERO_RESPONSIVE_CSS}</style>
      <div className="hero-image">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          unoptimized
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="hero-copy">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 id="hero-title">
          <span>{copy.title}</span>
          <em>{copy.accent}</em>
        </h1>
        <div className="hero-bottom">
          <p>{copy.body}</p>
          <div className="button-row">
            <Link className="button light primary" href="/portfolio">
              {copy.primaryCta} <ArrowDownRight size={16} />
            </Link>
            <Link className="button light" href="/arquivo">
              {copy.secondaryCta} <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>
      <span className="hero-index" aria-hidden="true">
        <PublicStatsText variant="hero-index" />
      </span>
    </section>
  );
}
