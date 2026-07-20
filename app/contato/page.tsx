import type { Metadata } from "next";
import { ContactForm } from "../components/ContactForm";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "Contato",
  description: "Converse com a Punctum Picture sobre seu casamento ou ensaio.",
  alternates: { canonical: "/contato" },
};

export default function ContactPage() {
  return (
    <div className="site-shell">
      <SiteHeader dark />
      <main>
        <header className="inner-hero">
          <p className="eyebrow">Contato e orçamento</p>
          <h1>Vamos imaginar juntos.</h1>
          <p>
            Conte um pouco da sua história, da data e do lugar. Maria Helena
            responderá pessoalmente com os próximos passos.
          </p>
        </header>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-inner contact-section">
            <div className="contact-intro">
              <p className="eyebrow">Primeiro contato</p>
              <h2>Sem pressa, com atenção.</h2>
              <p>
                Para respostas mais rápidas, o WhatsApp definitivo será
                configurado por Maria Helena no painel antes do lançamento.
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
