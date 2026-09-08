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
      <main id="conteudo" className="contact-layout">
        <header className="contact-page-copy">
          <p className="eyebrow">{copy.hero.eyebrow}</p>
          <h1><EditorialText text={copy.hero.title} /></h1>
          <p>{copy.hero.body}</p>
          <figure><Image src="/photos/p033.jpg" alt="Paisagem ao entardecer fotografada por Maria Helena" width={1440} height={960} priority sizes="(max-width: 700px) 75vw, 35vw" /><figcaption>{copy.hero.imageNote}</figcaption></figure>
        </header>
        <section aria-labelledby="contact-form-title">
          <div className="contact-form-heading"><p className="eyebrow">{copy.form.eyebrow}</p><h2 id="contact-form-title">{copy.form.title} {copy.form.accent}</h2><p>{copy.form.body}</p></div>
          <ContactForm site={site} whatsappLabel={config.editorial.chrome.whatsappCta} />
        </section>
      </main>
      <SiteFooter site={site} editorial={config.editorial} />
    </SiteThemeRoot>
  );
}
