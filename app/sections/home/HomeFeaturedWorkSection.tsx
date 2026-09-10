import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type {
  EditorialConfig,
  HomeSectionConfig,
} from "../../../shared/config";
import type { PublicAlbumSummary } from "../../../shared/public-content";
import { FeaturedStories } from "../../components/FeaturedStories";
import { PublicStatsText } from "../../components/PublicStats";
import { homeSectionAttributes } from "./section-attributes";

export function HomeFeaturedWorkSection({
  albums,
  copy,
  section,
}: {
  albums: PublicAlbumSummary[];
  copy: EditorialConfig["home"]["featured"];
  section: HomeSectionConfig;
}) {
  if (section.type !== "featured-work") return null;
  const variant = section.variant;

  return (
    <section
      className={`section stories-section stories-section-${variant}`}
      aria-labelledby="destaques-title"
      {...homeSectionAttributes(section)}
    >
      <div className="section-inner">
        <div className="section-heading reveal">
          <div>
            <p className="eyebrow">Trabalhos em Destaque</p>
            <h2 id="destaques-title">
              {copy.title}
              <br />
              <em>{copy.accent}</em>
            </h2>
          </div>
          <div>
            <p>{copy.body}</p>
            <Link className="text-link" href="/portfolio">
              <PublicStatsText variant="stories-link" /> <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        <FeaturedStories
          albums={albums.slice(0, section.itemCount)}
          variant={variant}
        />
      </div>
    </section>
  );
}
