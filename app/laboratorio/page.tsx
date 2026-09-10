import { ExplorationLab } from "../components/visual/ExplorationLab";
import { SiteThemeRoot } from "../components/SiteThemeRoot";
import {
  loadHomeCarousel,
  loadPortfolioAlbums,
  loadPublicExperience,
} from "../lib/server-content";

export const metadata = {
  title: "Laboratório Visual — Punctum Picture",
  description: "Exploração visual comparativa com fotografias reais de Maria Helena.",
  robots: "noindex, nofollow",
};

export default async function LaboratorioPage({
  searchParams,
}: {
  searchParams?: Promise<{ dir?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const initialDirection = (params?.dir === "cinema" || params?.dir === "indice-radical")
    ? params.dir
    : "mesa-edicao";

  const experience = await loadPublicExperience();
  const [albums, carouselImages] = await Promise.all([
    loadPortfolioAlbums(),
    loadHomeCarousel(experience.config),
  ]);

  return (
    <SiteThemeRoot config={experience.config}>
      <ExplorationLab
        site={experience.site}
        images={carouselImages}
        albums={albums}
        initialDirection={initialDirection}
      />
    </SiteThemeRoot>
  );
}
