import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, MessageCircle } from "lucide-react";
import { ContactForm } from "./components/ContactForm";
import { PhotoCarousel } from "./components/PhotoCarousel";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { carouselImages, featuredAlbums } from "./lib/portfolio";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Punctum Picture",
    url: "https://punctumpicture.com",
    image: "https://punctumpicture.com/photos/p110.jpg",
    description: "Fotografia autoral de pessoas, ritos, palcos e movimento.",
    areaServed: "Brasil",
    founder: { "@type": "Person", name: "Maria Helena" },
  };

  return (
    <div className="site-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <SiteHeader />
      <main id="conteudo">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-image">
            <Image
              src="/photos/p001.jpg"
              alt="Maria Helena fotografando com uma câmera"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Maria Helena · fotografia documental</p>
            <h1 id="hero-title">
              <span>O que pulsa,</span>
              <em>permanece.</em>
            </h1>
            <div className="hero-bottom">
              <p>
                Pessoas, ritos, palcos e movimento observados com intimidade —
                antes que o instante mude de forma.
              </p>
              <div className="button-row">
                <Link className="button light primary" href="/portfolio">
                  Ver histórias <ArrowDownRight size={16} />
                </Link>
                <Link className="button light" href="/arquivo">
                  Abrir arquivo <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>
          <span className="hero-index" aria-hidden="true">001 / 113</span>
        </section>

        <section className="visual-thesis reveal" aria-labelledby="thesis-title">
          <div>
            <p className="eyebrow">Um arquivo vivo</p>
            <h2 id="thesis-title">
              Entre o íntimo e o elétrico, a vida sempre deixa um vestígio.
            </h2>
          </div>
          <p>
            A Punctum nasce da atenção ao que não se repete: uma mão acesa por
            uma vela, o corpo antes do salto, a pausa entre duas músicas, um
            riso que ninguém dirigiu.
          </p>
        </section>

        <section className="carousel-section" aria-labelledby="carousel-title">
          <div className="carousel-heading reveal">
            <div>
              <p className="eyebrow">Atravessar o acervo</p>
              <h2 id="carousel-title">Muitos ritmos.<br />Um mesmo olhar.</h2>
            </div>
            <p>
              Do silêncio à vibração, cada série preserva a atmosfera do lugar
              e a presença de quem estava ali.
            </p>
          </div>
          <PhotoCarousel images={carouselImages} />
        </section>

        <section className="section stories-section" aria-labelledby="destaques-title">
          <div className="section-inner">
            <div className="section-heading reveal">
              <h2 id="destaques-title">Histórias que<br /><em>respiram.</em></h2>
              <div>
                <p>
                  Ensaios completos, organizados pelo ritmo de cada encontro —
                  sem moldar pessoas diferentes dentro da mesma fórmula.
                </p>
                <Link className="text-link" href="/portfolio">
                  Ver as 13 histórias <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
            <div className="home-stories-grid">
              {featuredAlbums.slice(0, 6).map((album, index) => (
                <Link
                  key={album.slug}
                  className="story-card reveal"
                  href={`/ensaios/${album.slug}`}
                >
                  <Image
                    src={album.cover}
                    alt={`Capa do ensaio ${album.title}`}
                    fill
                    sizes="(max-width: 800px) 100vw, 50vw"
                  />
                  <div className="story-card-copy">
                    <div>
                      <span>{album.category}</span>
                      <small>{(index + 1).toString().padStart(2, "0")}</small>
                    </div>
                    <h3>{album.title}</h3>
                    <p>{album.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="section manifesto" aria-labelledby="sobre-title">
          <div className="section-inner manifesto-grid">
            <div className="manifesto-image reveal">
              <Image
                src="/photos/p061.jpg"
                alt="Retrato teatral em vestido vermelho fotografado por Maria Helena"
                width={1800}
                height={2400}
                sizes="(max-width: 900px) 100vw, 42vw"
              />
              <span aria-hidden="true">Olhar / presença / memória</span>
            </div>
            <div className="reveal">
              <p className="eyebrow">Sobre a Punctum</p>
              <blockquote id="sobre-title">
                Fotografar é reconhecer o que já estava ali.
              </blockquote>
              <p>
                O trabalho de Maria Helena se aproxima sem invadir. Busca a
                textura dos lugares, a verdade dos gestos e o instante em que
                uma pessoa deixa de posar para simplesmente estar.
              </p>
              <Link className="text-link light-link" href="/arquivo">
                Conhecer o olhar por inteiro <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section className="section contact-home" aria-labelledby="contato-title">
          <div className="section-inner contact-section">
            <div className="contact-intro reveal">
              <p className="eyebrow">Vamos conversar</p>
              <h2 id="contato-title">Toda história começa antes da câmera.</h2>
              <p>
                Conte quando, onde e o que você deseja preservar. O retorno é
                pessoal, atento e sem respostas automáticas.
              </p>
              <MessageCircle aria-hidden="true" size={28} />
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
