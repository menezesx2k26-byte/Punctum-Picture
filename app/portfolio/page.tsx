import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { PhotoCarousel } from "../components/PhotoCarousel";
import { PortfolioGrid } from "../components/PortfolioGrid";
import { PublicStatsText } from "../components/PublicStats";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { SiteThemeRoot } from "../components/SiteThemeRoot";
import { EditorialText } from "../components/EditorialText";
import {
  loadEditorialCarousel,
  loadPortfolioAlbums,
  loadPublicExperience,
} from "../lib/server-content";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await loadPublicExperience();
  return {
    title: config.editorial.portfolio.seo.title,
    description: config.editorial.portfolio.seo.description,
    alternates: { canonical: "/portfolio" },
  };
}

export default async function PortfolioPage() {
  const [experience, albums, carouselImages] = await Promise.all([
    loadPublicExperience(),
    loadPortfolioAlbums(),
    loadEditorialCarousel(),
  ]);
  const { site, config } = experience;
  const copy = config.editorial.portfolio;
  return (
    <SiteThemeRoot config={config}>
      <SiteHeader dark site={site} editorial={config.editorial} />
      <main>
        <header className="portfolio-hero">
          <div className="portfolio-hero-copy">
            <p className="eyebrow"><PublicStatsText variant="portfolio-eyebrow" /></p>
            <h1>{copy.hero.title}<br /><em>{copy.hero.accent}</em></h1>
            <p>{copy.hero.body}</p>
            <Link className="text-link" href="#historias">
              {copy.hero.cta} <ArrowDownRight size={16} />
            </Link>
          </div>
          <div className="portfolio-hero-image">
            <Image
              src="/photos/p054.jpg"
              alt="Retrato entre árvores vermelhas fotografado por Maria Helena"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 46vw"
            />
            <span>{copy.hero.imageNote}</span>
          </div>
        </header>

        <section className="section portfolio-section" id="historias">
          <div className="section-inner">
            <div className="portfolio-section-header">
              <p>{copy.listing.intro}</p>
              <Link href="/arquivo"><PublicStatsText variant="archive-link" /></Link>
            </div>
            <PortfolioGrid albums={albums} />
          </div>
        </section>
        <section className="carousel-section portfolio-reel" aria-labelledby="portfolio-reel-title">
          <div className="carousel-heading reveal">
            <div>
              <p className="eyebrow">{copy.reel.eyebrow}</p>
              <h2 id="portfolio-reel-title"><EditorialText text={copy.reel.title} /></h2>
            </div>
            <p>{copy.reel.body}</p>
          </div>
          <PhotoCarousel images={[...carouselImages].reverse()} hint={copy.reel.hint} />
        </section>
      </main>
      <SiteFooter site={site} editorial={config.editorial} />
    </SiteThemeRoot>
  );
}
