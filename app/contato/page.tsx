import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "../components/ContactForm";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Converse com Maria Helena sobre retratos, eventos, família, música e projetos documentais.",
  alternates: { canonical: "/contato" },
};

export default function ContactPage() {
  return (
    <div className="site-shell contact-page">
      <SiteHeader />
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
            <p className="eyebrow">Contato e projetos</p>
            <h1>Antes da fotografia, existe uma conversa.</h1>
            <p>
              Conte a sua história, o lugar e aquilo que não pode passar sem
              memória. Maria Helena responde pessoalmente.
            </p>
          </div>
          <span className="contact-photo-note">Fim de tarde / Arquivo 033</span>
        </header>

        <section className="section contact-form-section">
          <div className="section-inner contact-section">
            <div className="contact-intro reveal">
              <p className="eyebrow">Começar por aqui</p>
              <h2>Com tempo.<br /><em>Com atenção.</em></h2>
              <p>
                Retratos, encontros familiares, eventos, música, esporte ou uma
                ideia ainda sem nome. Cada projeto começa entendendo o que deve
                permanecer verdadeiro.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
