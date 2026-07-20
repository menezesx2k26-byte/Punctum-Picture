import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, MessageCircle } from "lucide-react";
import { ContactForm } from "./components/ContactForm";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { demoAlbums } from "./lib/demo";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Punctum Picture",
    url: "https://punctumpicture.com",
    image: "https://punctumpicture.com/portfolio/music-cover.jpg",
    description: "Fotografia autoral de música, retratos, eventos e esporte.",
    areaServed: "Brasil",
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
              src="/maria-helena.jpg"
              alt="Maria Helena fotografando com uma câmera"
              fill
              priority
              sizes="100vw"
            />
          </div>
          <div className="hero-copy">
            <p className="eyebrow">Fotografia de presença</p>
            <h1 id="hero-title">O instante que permanece.</h1>
            <div className="hero-bottom">
              <p>
                Histórias observadas com delicadeza, luz natural e atenção ao
                que acontece entre um gesto e outro.
              </p>
              <div className="button-row">
                <Link className="button light primary" href="/portfolio">
                  Ver portfólio <ArrowDownRight size={16} />
                </Link>
                <Link className="button light" href="/contato">
                  Pedir orçamento <MessageCircle size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="destaques-title">
          <div className="section-inner">
            <div className="section-heading">
              <h2 id="destaques-title">Histórias em destaque</h2>
              <p>
                Cada ensaio é construído com tempo, escuta e espaço para que a
                história apareça sem excesso de direção.
              </p>
            </div>
            <div className="editorial-grid">
              {demoAlbums.map((album) => (
                <Link
                  key={album.slug}
                  className="story-card"
                  href={`/ensaios/${album.slug}`}
                >
                  <Image
                    src={album.cover}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 55vw"
                  />
                  <div className="story-card-copy">
                    <span>{album.category}</span>
                    <h3>{album.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="sobre" className="section manifesto" aria-labelledby="sobre-title">
          <div className="section-inner manifesto-grid">
            <div className="manifesto-image">
              <Image
                src="/portfolio/portrait-about.jpg"
                alt="Retrato em vestido vermelho fotografado por Maria Helena"
                width={3072}
                height={4096}
                sizes="(max-width: 900px) 100vw, 42vw"
              />
            </div>
            <div>
              <p className="eyebrow">Sobre a Punctum</p>
              <blockquote id="sobre-title">
                Fotografar é reconhecer o que já estava ali.
              </blockquote>
              <p>
                A Punctum Picture busca imagens honestas, táteis e
                cinematográficas. O texto definitivo de apresentação e a
                biografia de Maria Helena serão adicionados antes da publicação
                oficial.
              </p>
            </div>
          </div>
        </section>

        <section className="section" aria-labelledby="contato-title">
          <div className="section-inner contact-section">
            <div className="contact-intro">
              <p className="eyebrow">Vamos conversar</p>
              <h2 id="contato-title">Sua história começa aqui.</h2>
              <p>
                Conte quando, onde e como você imagina esse encontro. O retorno
                é pessoal, sem respostas automáticas.
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
