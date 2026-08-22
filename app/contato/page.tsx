import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "../components/ContactForm";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { SiteThemeRoot } from "../components/SiteThemeRoot";
import { EditorialText } from "../components/EditorialText";
import { loadPublicExperience } from "../lib/server-content";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = await loadPublicExperience();
  return {
    title: config.editorial.contact.seo.title,
    description: config.editorial.contact.seo.description,
    alternates: { canonical: "/contato" },
  };
}

export default async function ContactPage() {
  const { site, config } = await loadPublicExperience();
  const copy = config.editorial.contact;
  return (
    <SiteThemeRoot className="contact-page" config={config}>
      <SiteHeader site={site} editorial={config.editorial} />
      <main>
        <header className="contact-page-hero">
          <div className="contact-page-image">
            <Image
              src="/photos/p033.jpg"
              alt="Paisagem ao entardecer fotografada por Maria Helena"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="contact-page-copy">
            <p className="eyebrow">{copy.hero.eyebrow}</p>
            <h1><EditorialText text={copy.hero.title} /></h1>
            <p>{copy.hero.body}</p>
          </div>
          <span className="contact-photo-note">{copy.hero.imageNote}</span>
        </header>

        <section className="section contact-form-section">
          <div className="section-inner contact-section">
            <div className="contact-intro reveal">
              <p className="eyebrow">{copy.form.eyebrow}</p>
              <h2>{copy.form.title}<br /><em>{copy.form.accent}</em></h2>
              <p>{copy.form.body}</p>
            </div>
            <ContactForm site={site} whatsappLabel={config.editorial.chrome.whatsappCta} />
          </div>
        </section>
      </main>
      <SiteFooter site={site} editorial={config.editorial} />
    </SiteThemeRoot>
  );
}
