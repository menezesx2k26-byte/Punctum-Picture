import type { Metadata } from "next";
import { PortfolioGrid } from "../components/PortfolioGrid";
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

  return (
    <SiteThemeRoot config={config}>
      <SiteHeader site={site} editorial={config.editorial} />
      <main className={styles.root} data-miranda-layout="collection-index">
        <header className={styles.intro}>
          <p>Punctum / Coleções</p>
          <h1>Coleções</h1>
        </header>
        <PortfolioGrid albums={albums} />
      </main>
      <SiteFooter site={site} editorial={config.editorial} />
    </SiteThemeRoot>
  );
}
