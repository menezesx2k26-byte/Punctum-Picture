import type { Metadata } from "next";
import { LiveAlbum } from "../../components/LiveAlbum";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { portfolioAlbums } from "../../lib/portfolio";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = portfolioAlbums.find((entry) => entry.slug === slug);
  const title = album?.title ?? "Ensaio";
  const description =
    album?.description ?? "Ensaio fotográfico da Punctum Picture.";
  return {
    title,
    description,
    alternates: { canonical: `/ensaios/${slug}` },
    openGraph: { title, description },
  };
}

export default async function AlbumPage({ params }: PageProps) {
  const { slug } = await params;
  const initial =
    portfolioAlbums.find((entry) => entry.slug === slug) ?? {
      ...portfolioAlbums[0],
      slug,
      title: "História em imagens",
      subtitle: "Punctum Picture",
      description: "Este ensaio foi publicado recentemente.",
    };
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <LiveAlbum slug={slug} initial={initial} />
      </main>
      <SiteFooter />
    </div>
  );
}
