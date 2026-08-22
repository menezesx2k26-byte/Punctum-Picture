import type { Metadata } from "next";
import { ArchiveGrid } from "../components/ArchiveGrid";
import { PublicStatsText } from "../components/PublicStats";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { SiteThemeRoot } from "../components/SiteThemeRoot";
import {
  loadPublicExperience,
  loadPublishedArchive,
} from "../lib/server-content";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await loadPublicExperience();
  return {
    title: config.editorial.archive.seo.title,
    description: config.editorial.archive.seo.description,
    alternates: { canonical: "/arquivo" },
  };
}

export default async function ArchivePage() {
  const [experience, archiveImages] = await Promise.all([
    loadPublicExperience(),
    loadPublishedArchive(),
  ]);
  const { site, config } = experience;
  const copy = config.editorial.archive;
  return (
    <SiteThemeRoot className="archive-page" config={config}>
      <SiteHeader dark site={site} editorial={config.editorial} />
      <main>
        <header className="archive-hero">
          <p className="eyebrow"><PublicStatsText variant="archive-range" /></p>
          <h1>{copy.hero.title}<br /><em>{copy.hero.accent}</em></h1>
          <div>
            <p>{copy.hero.body}</p>
            <span><PublicStatsText variant="archive-summary" /></span>
          </div>
        </header>
        <section className="archive-section" aria-label="Todas as fotografias">
          <ArchiveGrid images={archiveImages} />
        </section>
      </main>
      <SiteFooter site={site} editorial={config.editorial} />
    </SiteThemeRoot>
  );
}
