import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LiveAlbum } from "../../components/LiveAlbum";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { SiteThemeRoot } from "../../components/SiteThemeRoot";
import { buildAlbumMetadata } from "../../lib/metadata";
import {
  loadPublicExperience,
  loadPublishedAlbum,
} from "../../lib/server-content";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [album, experience] = await Promise.all([
    loadPublishedAlbum(slug),
    loadPublicExperience(),
  ]);
  if (!album) {
    return {
      title: "Ensaio não encontrado",
      robots: { index: false, follow: false },
    };
  }
  return buildAlbumMetadata(album, experience.site);
}

export default async function AlbumPage({ params }: PageProps) {
  const { slug } = await params;
  const [album, experience] = await Promise.all([
    loadPublishedAlbum(slug),
    loadPublicExperience(),
  ]);
  if (!album) notFound();

  return (
    <SiteThemeRoot config={experience.config}>
      <SiteHeader site={experience.site} editorial={experience.config.editorial} />
      <main>
        <LiveAlbum album={album} brandName={experience.site.brandName} />
      </main>
      <SiteFooter site={experience.site} editorial={experience.config.editorial} />
    </SiteThemeRoot>
  );
}
