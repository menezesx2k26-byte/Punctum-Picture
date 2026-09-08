import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PortfolioGrid } from "../../components/PortfolioGrid";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { SiteThemeRoot } from "../../components/SiteThemeRoot";
import { loadPortfolioAlbums, loadPublicExperience } from "../../lib/server-content";
import {
  LOCAL_SEO_LOCATIONS,
  LOCAL_SEO_SERVICES,
  localSeoLocationBySlug,
  matchesLocalSeoLocation,
} from "../../../shared/local-seo";
import { SERVICE_SEO_SERVICES } from "../../../shared/service-seo";

type PageProps = { params: Promise<{ cidade: string }> };

export function generateStaticParams() {
  return LOCAL_SEO_LOCATIONS.map((location) => ({ cidade: location.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cidade } = await params;
  const location = localSeoLocationBySlug(cidade);
  if (!location) {
    return { title: "Cidade não encontrada", robots: { index: false, follow: false } };
  }
  const title = location.slug === "sao-bento-do-sul"
    ? `Fotógrafa em ${location.city}, ${location.state}`
    : `Fotógrafa em ${location.city}, ${location.state} | Retratos`;
  return {
    title,
    description: location.seoDescription,
    alternates: { canonical: `/fotografia/${location.slug}` },
    openGraph: { title: `Fotógrafa em ${location.city} | Punctum Picture`, description: location.seoDescription },
  };
}
export default async function CityPhotographyPage({ params }: PageProps) {
  const { cidade } = await params;
  const location = localSeoLocationBySlug(cidade);
  if (!location) notFound();

  const [experience, albums] = await Promise.all([
    loadPublicExperience(),
    loadPortfolioAlbums(),
  ]);
  const { site, config } = experience;
  const localAlbums = albums.filter((album) =>
    matchesLocalSeoLocation(album.location, location),
  );
  const shownAlbums = localAlbums.length > 0 ? localAlbums : albums.slice(0, 6);
  const origin = process.env.PUBLIC_SITE_URL ?? "https://punctumpicture.com";
  const pageUrl = `${origin}/fotografia/${location.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: `Fotografia em ${location.city}`,
        serviceType: LOCAL_SEO_SERVICES.map((service) => `Fotografia de ${service.toLowerCase()}`),
        url: pageUrl,
        provider: {
          "@type": "ProfessionalService",
          name: site.brandName,
          url: origin,
          telephone: site.whatsappE164 ? `+${site.whatsappE164}` : undefined,
        },
        areaServed: {
          "@type": "City",
          name: location.city,
          containedInPlace: { "@type": "State", name: location.stateName },
        },
      },      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: origin },
          { "@type": "ListItem", position: 2, name: "Fotografia", item: `${origin}/fotografia` },
          { "@type": "ListItem", position: 3, name: location.city, item: pageUrl },
        ],
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
      <main id="conteudo">
        <header className="portfolio-hero local-seo-hero">
          <div className="portfolio-hero-copy">
            <nav className="local-breadcrumb" aria-label="Breadcrumb">
              <Link href="/">Início</Link><span>/</span>
              <Link href="/fotografia">Fotografia</Link><span>/</span>
              <span>{location.city}</span>
            </nav>
            <p className="eyebrow">Atendimento em {location.city} · {location.state}</p>
            <h1>Fotógrafa em<br /><em>{location.city}.</em></h1>
            <p>{location.lead}</p>
            <Link className="text-link" href="/contato">
              Pedir orçamento <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>          <div className="portfolio-hero-image">
            <Image
              src={location.image}
              alt="Imagem do portfólio da Punctum Picture"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 46vw"
            />
            <span>Imagem de portfólio · Punctum Picture</span>
          </div>
        </header>

        <section className="section local-service-section" aria-labelledby="service-title">
          <div className="section-inner local-service-grid">
            <div>
              <p className="eyebrow">Como funciona</p>
              <h2 id="service-title">A história vem<br /><em>antes do roteiro.</em></h2>
            </div>
            <div className="local-service-copy">
              <p>{location.detail}</p>
              <ul className="local-service-list" aria-label={`Tipos de fotografia em ${location.city}`}>
                {SERVICE_SEO_SERVICES.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/servicos/${service.slug}`}>
                      {service.name} <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link className="text-link" href="/contato">
                Contar sua ideia <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section portfolio-section" aria-labelledby="local-work-title">
          <div className="section-inner">
            <div className="portfolio-section-header">
              <p id="local-work-title">
                {localAlbums.length > 0
                  ? `Histórias publicadas com localização em ${location.city}.`
                  : "Uma seleção do portfólio para conhecer luz, gesto e movimento antes de conversar sobre a cidade e a ideia."}
              </p>              <Link href="/portfolio">Ver portfólio completo</Link>
            </div>
            <PortfolioGrid albums={shownAlbums} />
          </div>
        </section>

        <section className="section local-area-section" aria-labelledby="other-areas-title">
          <div className="section-inner">
            <div className="section-heading compact-heading">
              <h2 id="other-areas-title">Outras cidades<br /><em>atendidas.</em></h2>
              <p>O mesmo contato atende as cinco áreas de cobertura da Punctum Picture.</p>
            </div>
            <div className="local-area-grid local-area-grid-compact">
              {LOCAL_SEO_LOCATIONS.filter((item) => item.slug !== location.slug).map((item) => (
                <Link key={item.slug} href={`/fotografia/${item.slug}`} className="local-area-card">
                  <span>{item.state}</span>
                  <h2>{item.city}</h2>
                  <strong>Ver cidade <ArrowUpRight size={16} aria-hidden="true" /></strong>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter site={site} editorial={config.editorial} />
    </SiteThemeRoot>
  );
}
