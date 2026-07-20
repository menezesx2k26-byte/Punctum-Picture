import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { PhotoCarousel } from "../components/PhotoCarousel";
import { PortfolioGrid } from "../components/PortfolioGrid";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { carouselImages, portfolioAlbums } from "../lib/portfolio";

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "Treze histórias de música, retrato, esporte, família e vida documental fotografadas por Maria Helena.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <div className="site-shell">
      <SiteHeader dark />
      <main>
        <header className="portfolio-hero">
          <div className="portfolio-hero-copy">
            <p className="eyebrow">Portfólio · 13 histórias</p>
            <h1>Um olhar,<br /><em>muitos pulsos.</em></h1>
            <p>
              Do recolhimento de um rito à energia de uma quadra, cada ensaio
              preserva sua própria temperatura, voz e maneira de ocupar o tempo.
            </p>
            <Link className="text-link" href="#historias">
              Percorrer histórias <ArrowDownRight size={16} />
            </Link>
          </div>
          <div className="portfolio-hero-image">
            <Image
              src="/photos/p054.jpg"
              alt="Retrato entre árvores vermelhas fotografado por Maria Helena"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 46vw"
            />
            <span>Retrato / Outono rubro</span>
          </div>
        </header>

        <section className="section portfolio-section" id="historias">
          <div className="section-inner">
            <div className="portfolio-section-header">
              <p>
                Cada história abaixo reúne todas as fotografias de uma série,
                na ordem e no ritmo em que ela pede para ser vista.
              </p>
              <Link href="/arquivo">Preferir o arquivo completo — 113 imagens</Link>
            </div>
            <PortfolioGrid initialAlbums={portfolioAlbums} />
          </div>
        </section>
        <section className="carousel-section portfolio-reel" aria-labelledby="portfolio-reel-title">
          <div className="carousel-heading reveal">
            <div>
              <p className="eyebrow">Outro modo de olhar</p>
              <h2 id="portfolio-reel-title">Sem categorias.<br />Só presença.</h2>
            </div>
            <p>
              Um percurso livre aproxima imagens de universos diferentes e
              deixa que cor, gesto e luz criem novas relações entre elas.
            </p>
          </div>
          <PhotoCarousel images={[...carouselImages].reverse()} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
