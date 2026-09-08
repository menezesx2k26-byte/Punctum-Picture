import type { Metadata } from "next";
import Image from "next/image";
import { albumArtworkSource } from "../../lib/album-artwork";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { PortfolioGrid } from "../../components/PortfolioGrid";
import { SiteFooter, SiteHeader } from "../../components/SiteChrome";
import { SiteThemeRoot } from "../../components/SiteThemeRoot";
import { loadPortfolioAlbums, loadPublicExperience } from "../../lib/server-content";
import {
  buildServiceJsonLd,
  buildServiceMetadata,
  buildServicePageModel,
  serviceStaticParams,
} from "../../../shared/service-page";
import { serviceSeoBySlug } from "../../../shared/service-seo";

export { buildServiceJsonLd } from "../../../shared/service-page";

type PageProps = { params: Promise<{ servico: string }> };

export function generateStaticParams() {
  return serviceStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { servico } = await params;
  return buildServiceMetadata(servico);
}

export default async function ServicePage({ params }: PageProps) {
  const { servico } = await params;
  const service = serviceSeoBySlug(servico);
  if (!service) notFound();

  const [experience, albums] = await Promise.all([
    loadPublicExperience(),
    loadPortfolioAlbums(),
  ]);
  const { site, config } = experience;
  const model = buildServicePageModel({ service, albums });
  const origin = process.env.PUBLIC_SITE_URL ?? "https://punctumpicture.com";
  const jsonLd = buildServiceJsonLd({
    service,
    origin,
    brandName: site.brandName,
    whatsappE164: site.whatsappE164,
  });

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
              <Link href={model.servicesHref}>Serviços</Link><span>/</span>
              <span>{service.name}</span>
            </nav>
            <p className="eyebrow">Serviço · Punctum Picture</p>
            <h1>{model.heading}<br /><em>sem fórmula pronta.</em></h1>
            <p>{service.lead}</p>
            <Link className="text-link" href={model.contactHref}>
              Pedir orçamento <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="portfolio-hero-image">
            <Image
              src={(model.albums[0] && albumArtworkSource(model.albums[0])) || service.image}
              alt={`Imagem do portfólio para ${service.name.toLowerCase()}`}
              fill
              unoptimized
              priority
              sizes="(max-width: 820px) 100vw, 46vw"
            />
            <span>Imagem de portfólio · Punctum Picture</span>
          </div>
        </header>

        <section className="section local-service-section" aria-labelledby="approach-title">
          <div className="section-inner local-service-grid">
            <div>
              <p className="eyebrow">Como funciona</p>
              <h2 id="approach-title">A abordagem vem<br /><em>antes da pose.</em></h2>
            </div>
            <div className="local-service-copy">
              <p>{service.detail}</p>
              <Link className="text-link" href={model.contactHref}>
                Contar sua ideia <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="section portfolio-section" aria-labelledby="service-work-title">
          <div className="section-inner">
            <div className="portfolio-section-header">
              <p id="service-work-title">
                Um pouco desse olhar, em histórias completas.
              </p>
              <Link href="/portfolio">Ver portfólio completo</Link>
            </div>
            {model.albums.length > 0 ? (
              <PortfolioGrid albums={model.albums} />
            ) : (
              <p className="service-empty-copy">
                Novas histórias estão a caminho. Converse com Maria sobre sua ideia.
              </p>
            )}
          </div>
        </section>

        <section className="section local-area-section" aria-labelledby="service-areas-title">
          <div className="section-inner">
            <div className="section-heading compact-heading">
              <h2 id="service-areas-title">Onde esse trabalho<br /><em>pode acontecer.</em></h2>
              <p>Veja o atendimento local e converse sobre deslocamento, data e formato.</p>
            </div>
            <div className="local-area-grid local-area-grid-compact">
              {model.areaLinks.map((area) => (
                <Link key={area.href} href={area.href} className="local-area-card">
                  <span>Área atendida</span>
                  <h2>{area.label}</h2>
                  <strong>Ver cidade <ArrowUpRight size={16} aria-hidden="true" /></strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section local-seo-cta" aria-labelledby="service-contact-title">
          <div className="section-inner local-seo-cta-inner">
            <p className="eyebrow">Conversa antes do orçamento</p>
            <h2 id="service-contact-title">Conte o que você quer preservar.</h2>
            <p>Informe a cidade, a data e o que você imagina para o registro.</p>
            <Link className="text-link" href={model.contactHref}>
              Conversar com Maria Helena <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter site={site} editorial={config.editorial} />
    </SiteThemeRoot>
  );
}
