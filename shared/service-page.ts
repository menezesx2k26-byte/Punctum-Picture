import type { Metadata } from "next";
import { LOCAL_SEO_LOCATIONS } from "./local-seo";
import type { PublicAlbumSummary } from "./public-content";
import type { ServiceSeo } from "./service-seo";
import {
  SERVICE_SEO_SERVICES,
  matchesServiceSeoAlbum,
  serviceSeoBySlug,
} from "./service-seo";

export type ServiceSchemaInput = {
  service: ServiceSeo;
  origin: string;
  brandName: string;
  whatsappE164?: string | null;
};

export function serviceStaticParams() {
  return SERVICE_SEO_SERVICES.map((service) => ({ servico: service.slug }));
}

export function buildServiceMetadata(slug: string): Metadata {
  const service = serviceSeoBySlug(slug);
  if (!service) {
    return {
      title: "Serviço não encontrado",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      title: `${service.name} | Punctum Picture`,
      description: service.seoDescription,
    },
  };
}

export function buildServiceJsonLd({
  service,
  origin,
  brandName,
  whatsappE164,
}: ServiceSchemaInput) {
  const pageUrl = `${origin}/servicos/${service.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.serviceType,
        serviceType: service.serviceType,
        description: service.seoDescription,
        url: pageUrl,
        provider: {
          "@type": "ProfessionalService",
          name: brandName,
          url: origin,
          telephone: whatsappE164 ? `+${whatsappE164}` : undefined,
        },
        areaServed: LOCAL_SEO_LOCATIONS.map((location) => ({
          "@type": "City",
          name: location.city,
          containedInPlace: { "@type": "State", name: location.stateName },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: origin },
          { "@type": "ListItem", position: 2, name: "Serviços", item: `${origin}/servicos` },
          { "@type": "ListItem", position: 3, name: service.name, item: pageUrl },
        ],
      },
    ],
  };
}

export function buildServicePageModel(input: {
  service: ServiceSeo;
  albums: PublicAlbumSummary[];
}) {
  const { service, albums } = input;
  return {
    heading: service.name,
    albums: albums.filter((album) => matchesServiceSeoAlbum(album, service)),
    areaLinks: LOCAL_SEO_LOCATIONS.map((location) => ({
      label: `${location.city} · ${location.state}`,
      href: `/fotografia/${location.slug}`,
    })),
    contactHref: "/contato",
    servicesHref: "/servicos",
  };
}
export function buildServiceHubModel() {
  return SERVICE_SEO_SERVICES.map((service) => ({
    name: service.name,
    href: `/servicos/${service.slug}`,
    lead: service.lead,
    image: service.image,
  }));
}