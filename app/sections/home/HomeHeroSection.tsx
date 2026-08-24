import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { EditorialConfig, HomeSectionConfig } from "../../../shared/config";
import { PublicStatsText } from "../../components/PublicStats";
import { getPublicVisualAsset } from "../../lib/public-visuals";
import { homeSectionAttributes } from "./section-attributes";

export function HomeHeroSection({
  copy,
  section,
}: {
  copy: EditorialConfig["home"]["hero"];
  section: HomeSectionConfig;
}) {
  const hero = getPublicVisualAsset("hero");

  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      {...homeSectionAttributes(section)}
    >
      <div className="hero-image">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          unoptimized
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "57% center",
          }}
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
