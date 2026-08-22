import { MessageCircle } from "lucide-react";
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
  return (
    <section
      className="section contact-home"
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
          <MessageCircle aria-hidden="true" size={28} />
        </div>
        <ContactForm site={site} whatsappLabel={whatsappLabel} />
      </div>
    </section>
  );
}
