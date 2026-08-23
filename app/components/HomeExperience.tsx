import type { SiteConfig } from "../../shared/config";
import type {
  PublicAlbumSummary,
  PublicSiteSettings,
} from "../../shared/public-content";
import type { CarouselImage } from "../lib/portfolio";
import { HomeRenderer } from "../sections/home/HomeRenderer";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { SiteThemeRoot } from "./SiteThemeRoot";
import styles from "./HomeExperience.module.css";

export function HomeExperience({
  site,
  config,
  featuredAlbums,
  carouselImages,
}: {
  site: PublicSiteSettings;
  config: SiteConfig;
  featuredAlbums: PublicAlbumSummary[];
  carouselImages: CarouselImage[];
}) {
  return (
    <SiteThemeRoot config={config}>
      <div className={styles.editorialHome}>
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo
        </a>
        <SiteHeader site={site} editorial={config.editorial} />
        <main id="conteudo">
          <HomeRenderer
            config={config}
            site={site}
            featuredAlbums={featuredAlbums}
            carouselImages={carouselImages}
          />
        </main>
        <SiteFooter site={site} editorial={config.editorial} />
      </div>
    </SiteThemeRoot>
  );
}
