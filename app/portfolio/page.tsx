import type { Metadata } from "next";
import { PortfolioGrid } from "../components/PortfolioGrid";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { demoAlbums } from "../lib/demo";

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "Conheça histórias de casamento, retratos e ensaios fotografados pela Punctum Picture.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <div className="site-shell">
      <SiteHeader dark />
      <main>
        <header className="inner-hero">
          <p className="eyebrow">Portfólio</p>
          <h1>Histórias vistas de perto.</h1>
          <p>
            Ensaios construídos como narrativas — com espaço para o inesperado,
            para o silêncio e para aquilo que não se repete.
          </p>
        </header>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-inner">
            <PortfolioGrid initialAlbums={demoAlbums} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
