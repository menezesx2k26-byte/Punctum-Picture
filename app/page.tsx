import { HomeExperience } from "./components/HomeExperience";
import {
  loadHomeCarousel,
  loadFeaturedAlbums,
  loadPublicExperience,
} from "./lib/server-content";
import { LOCAL_SEO_LOCATIONS } from "../shared/local-seo";

export default async function Home() {
  const experience = await loadPublicExperience();
  const [featuredAlbums, carouselImages] = await Promise.all([
    loadFeaturedAlbums(),
    loadHomeCarousel(experience.config),
  ]);
  const { site, config } = experience;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.brandName,
    url: process.env.PUBLIC_SITE_URL ?? "https://punctumpicture.com",
    image: `${process.env.PUBLIC_SITE_URL ?? "https://punctumpicture.com"}/photos/p110.jpg`,
    description: site.seoDescription,
    telephone: site.whatsappE164 ? `+${site.whatsappE164}` : undefined,
    areaServed: LOCAL_SEO_LOCATIONS.map((location) => ({
      "@type": "City",
      name: location.city,
      containedInPlace: { "@type": "State", name: location.stateName },
    })),
    founder: { "@type": "Person", name: "Maria Helena" },
    ...(site.instagramUrl ? { sameAs: [site.instagramUrl] } : {}),
    ...(site.contactEmail ? { email: site.contactEmail } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeExperience
        site={site}
        config={config}
        featuredAlbums={featuredAlbums}
        carouselImages={carouselImages}
      />
    </>
  );
}
