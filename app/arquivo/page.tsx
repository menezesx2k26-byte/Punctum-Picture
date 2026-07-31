import type { Metadata } from "next";
import { ArchiveGrid } from "../components/ArchiveGrid";
import { PublicStatsText } from "../components/PublicStats";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { archiveImages } from "../lib/portfolio";

export const metadata: Metadata = {
  title: "Arquivo completo",
  description:
    "As fotografias do arquivo Punctum Picture, reunidas em um percurso visual completo e sempre atualizado.",
  alternates: { canonical: "/arquivo" },
};

export default function ArchivePage() {
  return (
    <div className="site-shell archive-page">
      <SiteHeader dark />
      <main>
        <header className="archive-hero">
          <p className="eyebrow"><PublicStatsText variant="archive-range" /></p>
          <h1>Nenhum instante<br /><em>de fora.</em></h1>
          <div>
            <p>
              Um percurso integral pelas fotografias de Maria Helena. Filtre
              por linguagem ou abra qualquer imagem para observá-la sem pressa.
            </p>
            <span><PublicStatsText variant="archive-summary" /></span>
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
