import { describe, expect, it } from "vitest";
import { SERVICE_SEO_SERVICES } from "../../shared/service-seo";
import * as servicePage from "../../shared/service-page";
import {
  buildServiceJsonLd,
  buildServicePageModel,
  buildServiceMetadata,
  serviceStaticParams,
} from "../../shared/service-page";

describe("service pages", () => {
  it("gera params estáticos para os seis serviços", () => {
    expect(serviceStaticParams()).toEqual(
      SERVICE_SEO_SERVICES.map((service) => ({ servico: service.slug })),
    );
  });

  it("gera metadata canônica e única a partir do serviço", () => {
    const service = SERVICE_SEO_SERVICES[0];
    const metadata = buildServiceMetadata(service.slug);
    expect(metadata.title).toBe(service.seoTitle);
    expect(metadata.description).toBe(service.seoDescription);
    expect(metadata.alternates).toMatchObject({ canonical: `/servicos/${service.slug}` });
  });

  it("marca slug de serviço inválido como noindex", () => {
    const metadata = buildServiceMetadata("servico-inexistente");
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("gera schema Service e BreadcrumbList com URLs absolutas", () => {
    const service = SERVICE_SEO_SERVICES[0];
    const schema = buildServiceJsonLd({
      service,
      origin: "https://punctumpicture.com",
      brandName: "Punctum Picture",
      whatsappE164: "5547999999999",
    }) as { "@graph": Array<Record<string, unknown>> };

    expect(schema["@graph"].map((entry) => entry["@type"])).toEqual([
      "Service",
      "BreadcrumbList",
    ]);
    expect(schema["@graph"][0]).toMatchObject({
      name: service.serviceType,
      url: `https://punctumpicture.com/servicos/${service.slug}`,
      provider: {
        "@type": "ProfessionalService",
        name: "Punctum Picture",
        url: "https://punctumpicture.com",
        telephone: "+5547999999999",
      },
    });
    expect((schema["@graph"][0].areaServed as unknown[]).length).toBe(5);
    expect(schema["@graph"][1]).toMatchObject({ "@type": "BreadcrumbList" });
  });
});

it("monta um modelo de página com somente ensaios compatíveis e links de cobertura", () => {
  const service = SERVICE_SEO_SERVICES[0];
  const makeAlbum = (slug: string, categorySlug: string) => ({
    id: slug,
    slug,
    title: slug,
    subtitle: null,
    description: null,
    location: null,
    shootDate: null,
    featured: false,
    publishedAt: null,
    seoTitle: null,
    seoDescription: null,
    coverImageId: null,
    coverUrl: null,
    ogImageUrl: null,
    categories: [{ id: categorySlug, name: categorySlug, slug: categorySlug }],
  });

  const model = buildServicePageModel({
    service,
    albums: [
      makeAlbum("cinema-de-domingo", "retrato"),
      makeAlbum("corpo-em-jogo", "esporte"),
    ],
  });

  expect(model.heading).toBe(service.name);
  expect(model.albums.map((album) => album.slug)).toEqual(["cinema-de-domingo"]);
  expect(model.areaLinks).toHaveLength(5);
  expect(model.areaLinks[0].href).toBe("/fotografia/joinville");
  expect(model.contactHref).toBe("/contato");
  expect(model.servicesHref).toBe("/servicos");
});
it("monta o hub com os seis serviços publicados e URLs canônicas", () => {
  const model = (
    servicePage as typeof servicePage & {
      buildServiceHubModel?: () => Array<{ name: string; href: string }>;
    }
  ).buildServiceHubModel?.();

  expect(model).toHaveLength(6);
  expect(model?.[0]).toMatchObject({ name: "Retratos", href: "/servicos/retratos" });
  expect(model?.[5]).toMatchObject({
    name: "Fotografia documental",
    href: "/servicos/fotografia-documental",
  });
});