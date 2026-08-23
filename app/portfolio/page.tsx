import type { Metadata } from "next";
import Link from "next/link";
import { PortfolioGrid } from "../components/PortfolioGrid";
import { PublicStatsText } from "../components/PublicStats";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { SiteThemeRoot } from "../components/SiteThemeRoot";
import { loadPortfolioAlbums, loadPublicExperience } from "../lib/server-content";
import styles from "./MirandaPortfolioPage.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await loadPublicExperience();
  return {
    title: config.editorial.portfolio.seo.title,
    description: config.editorial.portfolio.seo.description,
    alternates: { canonical: "/portfolio" },
  };
}

export default async function PortfolioPage() {
  const [experience, albums] = await Promise.all([
    loadPublicExperience(),
    loadPortfolioAlbums(),
  ]);
  const { site, config } = experience;
  const copy = config.editorial.portfolio;

  return (
    <SiteThemeRoot config={config}>
      <SiteHeader dark site={site} editorial={config.editorial} />
      <main className={styles.root}>
        <header className={styles.intro}>
          <div>
            <small><PublicStatsText variant="portfolio-eyebrow" /></small>
            <h1>
              {copy.hero.title}
              <em>{copy.hero.accent}</em>
            </h1>
          </div>
          <div className={styles.aside}>
            <p>{copy.listing.intro}</p>
            <Link href="/arquivo"><PublicStatsText variant="archive-link" /></Link>
          </div>
        </header>
        <PortfolioGrid albums={albums} />
      </main>
      <SiteFooter site={site} editorial={config.editorial} />
    </SiteThemeRoot>
  );
}
