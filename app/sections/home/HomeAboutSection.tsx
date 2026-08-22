import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { EditorialConfig, HomeSectionConfig } from "../../../shared/config";
import { EditorialText } from "../../components/EditorialText";
import { homeSectionAttributes } from "./section-attributes";

export function HomeAboutSection({
  copy,
  section,
}: {
  copy: EditorialConfig["home"]["about"];
  section: HomeSectionConfig;
}) {
  return (
    <section
      id="sobre"
      className="section manifesto"
      aria-labelledby="sobre-title"
      {...homeSectionAttributes(section)}
    >
      <div className="section-inner manifesto-grid">
        <div className="manifesto-image reveal">
          <Image
            src="/photos/p061.jpg"
            alt="Retrato teatral em vestido vermelho fotografado por Maria Helena"
            width={1800}
            height={2400}
            sizes="(max-width: 900px) 100vw, 42vw"
          />
          <span aria-hidden="true">{copy.imageNote}</span>
        </div>
        <div className="reveal">
          <p className="eyebrow">{copy.eyebrow}</p>
          <blockquote id="sobre-title">
            <EditorialText text={copy.quote} />
          </blockquote>
          <p>{copy.body}</p>
          <Link className="text-link light-link" href="/arquivo">
            {copy.cta} <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
