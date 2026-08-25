import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { EditorialConfig, HomeSectionConfig } from "../../../shared/config";
import { PublicStatsText } from "../../components/PublicStats";
import {
  getHeroMobileStageHeight,
  getHeroObjectPosition,
  getPublicVisualAsset,
} from "../../lib/public-visuals";
import { homeSectionAttributes } from "./section-attributes";

const HERO_RESPONSIVE_CSS = `
.hero-image img {
  object-position: var(--hero-object-position, 45% 42%) !important;
}

@media (max-width: 680px) {
  .hero {
    display: block;
    min-height: auto;
    padding-top: var(--hero-mobile-stage-height, 50svh);
    overflow: hidden;
    background: #0d1010;
  }

  .hero-image {
    position: absolute;
    inset: 0 0 auto;
    height: var(--hero-mobile-stage-height, 50svh);
    z-index: -2;
  }

  .hero-image img {
    object-position: var(--hero-mobile-object-position, 60% 38%) !important;
  }

  .hero::after {
    inset: 0 0 auto;
    height: var(--hero-mobile-stage-height, 50svh);
    background:
      linear-gradient(180deg, rgba(10, 12, 10, 0.3), transparent 36%),
      linear-gradient(0deg, rgba(13, 16, 16, 0.94), transparent 50%);
  }

  .hero-copy {
    position: relative;
    z-index: 1;
    width: 100%;
    margin: 0;
    padding: 1.35rem 1rem 2.75rem;
    background: #0d1010;
  }

  .hero-copy h1,
  .hero[data-home-section-variant="editorial"] h1,
  .hero[data-home-section-variant="split"] h1 {
    max-width: 9ch;
    font-size: clamp(3.45rem, 15vw, 5.6rem);
    line-height: 0.84;
  }

  .hero-bottom {
    margin-top: 2rem;
    padding-left: 0;
    gap: 1.25rem;
  }

  .hero-bottom p {
    max-width: 32rem;
  }

  .hero .button-row,
  .hero .button {
    width: 100%;
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
    "--hero-mobile-stage-height": getHeroMobileStageHeight(),
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
