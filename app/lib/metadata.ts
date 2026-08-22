import type { Metadata } from "next";
import type {
  PublicAlbum,
  PublicSiteSettings,
} from "../../shared/public-content";

export function buildSiteMetadata(
  site: PublicSiteSettings,
  origin: string,
): Metadata {
  return {
    metadataBase: new URL(origin),
    title: {
      default: site.seoTitle,
      template: `%s — ${site.brandName}`,
    },
    description: site.seoDescription,
    applicationName: site.brandName,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: site.brandName,
      title: site.seoTitle,
      description: site.seoDescription,
      images: [
        {
          url: "/photos/p110.jpg",
          width: 2400,
          height: 1600,
          alt: "Fotografia de espetáculo por Maria Helena",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.seoTitle,
      description: site.seoDescription,
      images: ["/photos/p110.jpg"],
    },
  };
}

export function albumSeoDescription(album: PublicAlbum): string {
  return (
    album.seoDescription?.trim() ||
    album.description?.trim() ||
    album.subtitle?.trim() ||
    `${album.title}, ensaio fotográfico da Punctum Picture.`
  );
}

export function buildAlbumMetadata(
  album: PublicAlbum,
  site: PublicSiteSettings,
): Metadata {
  const title = album.seoTitle?.trim() || album.title;
  const description = albumSeoDescription(album);
  const images = album.ogImageUrl
    ? [
        {
          url: album.ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Capa do ensaio ${album.title}`,
        },
      ]
    : [];

  return {
    title,
    description,
    alternates: { canonical: `/ensaios/${album.slug}` },
    openGraph: {
      type: "article",
      siteName: site.brandName,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}
