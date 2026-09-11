"use client";

import { useSceneProgress } from "../../components/visual/useSceneProgress";
import type { EditorialConfig, HomeSectionConfig } from "../../../shared/config";
import type { PublicSiteSettings } from "../../../shared/public-content";
import { ContactForm } from "../../components/ContactForm";
import { EditorialText } from "../../components/EditorialText";
import { homeSectionAttributes } from "./section-attributes";

export function HomeContactSection({
  copy,
  section,
  site,
  whatsappLabel,
}: {
  copy: EditorialConfig["home"]["contact"];
  section: HomeSectionConfig;
  site: PublicSiteSettings;
  whatsappLabel: string;
}) {
  const variant = section.variant;
  const scene = useSceneProgress();

  return (
    <section
      ref={scene}
      className={`section contact-home contact-variant-${variant}`}
      aria-labelledby="contato-title"
      {...homeSectionAttributes(section)}
    >
      <div className="section-inner contact-section">
        <div className="contact-intro reveal">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="contato-title">
            <EditorialText text={copy.title} />
          </h2>
          <p>{copy.body}</p>
          <div className="contact-service-regions">
            <span className="contact-region-badge">Joinville</span>
            <span className="contact-region-badge">Curitiba</span>
            <span className="contact-region-badge">São Bento do Sul</span>
            <span className="contact-region-badge">Campo Alegre</span>
          </div>
          <div className="contact-aperture" aria-hidden="true" />
        </div>
        <ContactForm site={site} whatsappLabel={whatsappLabel} />
      </div>
    </section>
  );
}
