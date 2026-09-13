import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { SiteThemeRoot } from "../components/SiteThemeRoot";
import { loadPublicExperience } from "../lib/server-content";
import { buildServiceHubModel } from "../../shared/service-page";

export const metadata: Metadata = {
  title: "Serviços de fotografia autoral",
  description:
    "Conheça os serviços de retratos, eventos, música, esporte, famílias e fotografia documental da Punctum Picture, com trabalhos reais do portfólio.",
  alternates: { canonical: "/servicos" },
};

export default async function ServicesPage() {
  const { site, config } = await loadPublicExperience();
  const services = buildServiceHubModel();
  const origin = process.env.PUBLIC_SITE_URL ?? "https://punctumpicture.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Serviços de fotografia da Punctum Picture",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.name,
      url: `${origin}${service.href}`,
    })),
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
            <p className="eyebrow">Serviços · portfólio real</p>
            <h1>Fotografia para<br /><em>histórias diferentes.</em></h1>
            <p>
              Seis caminhos para chegar ao trabalho da Punctum sem transformar
              pessoas, eventos ou lugares em uma fórmula pronta.
            </p>
          </div>
          <div className="portfolio-hero-image">
            <Image
              src="/photos/p110.jpg"
              alt="Fotografia de espetáculo do portfólio da Punctum Picture"
              fill
              priority
              sizes="(max-width: 820px) 100vw, 46vw"
            />
            <span>Portfólio · Punctum Picture</span>
          </div>
        </header>

        <section className="section local-area-section" aria-labelledby="services-title">
          <div className="section-inner">
            <div className="section-heading">
              <h2 id="services-title">Escolha pelo que<br /><em>você quer preservar.</em></h2>
              <p>
                Dos retratos aos palcos, o ponto de partida é o encontro.
                Conheça cada abordagem e veja as histórias que ela produziu.
              </p>
            </div>
            <div className="local-area-grid service-hub-grid">
              {services.map((service) => (
                <Link key={service.href} href={service.href} className="local-area-card">
                  <Image src={service.image} alt="" width={128} height={171} sizes="128px" className="service-index-image" />
                  <h2>{service.name}</h2>
                  <p>{service.lead}</p>
                  <strong>
                    Ver serviço <ArrowUpRight size={16} aria-hidden="true" />
                  </strong>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section local-seo-cta" aria-labelledby="services-contact-title">
          <div className="section-inner local-seo-cta-inner">
            <p className="eyebrow">Não precisa caber numa categoria</p>
            <h2 id="services-contact-title">Conte a ideia antes de escolher o formato.</h2>
            <p>
              Cidade, data e o que você quer preservar já bastam para começar a conversa.
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
