import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { SiteThemeRoot } from "../components/SiteThemeRoot";
import { loadPublicExperience } from "../lib/server-content";
import { LOCAL_SEO_LOCATIONS } from "../../shared/local-seo";

export const metadata: Metadata = {
  title: "Fotógrafa em Santa Catarina e Paraná",
  description:
    "Punctum Picture atende Joinville, Curitiba, São Bento do Sul, Rio Negrinho e Campo Alegre com retratos, eventos e fotografia documental. Veja o portfólio.",
  alternates: { canonical: "/fotografia" },
};

export default async function PhotographyAreasPage() {
  const { site, config } = await loadPublicExperience();
  const origin = process.env.PUBLIC_SITE_URL ?? "https://punctumpicture.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: "Fotografia autoral",
        provider: { "@type": "ProfessionalService", name: site.brandName, url: origin },
        areaServed: LOCAL_SEO_LOCATIONS.map((location) => ({
          "@type": "City",
          name: location.city,
          containedInPlace: { "@type": "State", name: location.stateName },
        })),
      },      {
        "@type": "ItemList",
        name: "Áreas atendidas pela Punctum Picture",
        itemListElement: LOCAL_SEO_LOCATIONS.map((location, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: location.city,
          url: `${origin}/fotografia/${location.slug}`,
        })),
      },
    ],
  };

  return (
    <SiteThemeRoot config={config}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader dark site={site} editorial={config.editorial} />
      <main>
        <header className="portfolio-hero local-seo-hero">
          <div className="portfolio-hero-copy">
            <p className="eyebrow">Atendimento em Santa Catarina e Paraná</p>
            <h1>Fotografia em<br /><em>SC e PR.</em></h1>
            <p>
              A Punctum Picture atende cinco cidades com retratos, famílias, eventos,
              música, esporte e projetos documentais. Escolha a cidade para ver como o
              atendimento funciona e conhecer o portfólio.
            </p>
          </div>          <div className="portfolio-hero-image">
            <Image
              src="/photos/p001.jpg"
              alt="Maria Helena fotografando com uma câmera"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 46vw"
            />
            <span>Maria Helena · Punctum Picture</span>
          </div>
        </header>

        <section className="section local-area-section" aria-labelledby="areas-title">
          <div className="section-inner">
            <div className="section-heading">
              <h2 id="areas-title">Onde a Punctum<br /><em>fotografa.</em></h2>
              <p>
                As páginas abaixo foram feitas para responder a buscas locais sem
                esconder o portfólio atrás de texto genérico. Cada uma leva ao contato
                e passa a destacar trabalhos da cidade quando o ensaio tem o local cadastrado.
              </p>
            </div>
            <div className="local-area-grid">
              {LOCAL_SEO_LOCATIONS.map((location) => (
                <Link key={location.slug} href={`/fotografia/${location.slug}`} className="local-area-card">
                  <span>{location.state}</span>
                  <h2>{location.city}</h2>
                  <p>{location.lead}</p>
                  <strong>Ver atendimento <ArrowUpRight size={16} aria-hidden="true" /></strong>
                </Link>
              ))}
            </div>          </div>
        </section>

        <section className="section local-seo-cta" aria-labelledby="local-contact-title">
          <div className="section-inner local-seo-cta-inner">
            <p className="eyebrow">Sua ideia vem primeiro</p>
            <h2 id="local-contact-title">Conte o que você quer preservar.</h2>
            <p>
              Informe a cidade, a data e o tipo de registro. A conversa começa por aí.
            </p>
            <Link className="text-link" href="/contato">
              Conversar com Maria Helena <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter site={site} editorial={config.editorial} />
    </SiteThemeRoot>
  );
}
