import type { Metadata } from "next";
import { ArchiveGrid } from "../components/ArchiveGrid";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { archiveImages } from "../lib/portfolio";

export const metadata: Metadata = {
  title: "Arquivo completo",
  description:
    "As 113 fotografias do arquivo Punctum Picture, reunidas em um percurso visual completo.",
  alternates: { canonical: "/arquivo" },
};

export default function ArchivePage() {
  return (
    <div className="site-shell archive-page">
      <SiteHeader dark />
      <main>
        <header className="archive-hero">
          <p className="eyebrow">Arquivo completo · 001—113</p>
          <h1>Nenhum instante<br /><em>de fora.</em></h1>
          <div>
            <p>
              Um percurso integral pelas fotografias de Maria Helena. Filtre
              por linguagem ou abra qualquer imagem para observá-la sem pressa.
            </p>
            <span>13 histórias · 9 territórios visuais</span>
          </div>
        </header>
        <section className="archive-section" aria-label="Todas as fotografias">
          <ArchiveGrid images={archiveImages} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
