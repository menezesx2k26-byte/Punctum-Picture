import type { PublicAlbumSummary } from "./public-content";

export type ServiceSeo = {
  slug: string;
  name: string;
  seoTitle: string;
  seoDescription: string;
  lead: string;
  detail: string;
  image: string;
  serviceType: string;
  categorySlugs: readonly string[];
  albumSlugs?: readonly string[];
};

export const SERVICE_SEO_SERVICES: readonly ServiceSeo[] = [
  {
    slug: "retratos",
    name: "Retratos",
    seoTitle: "Fotografia de retratos com olhar autoral",
    seoDescription:
      "Fotografia de retratos com direção leve, atenção à luz e espaço para gestos naturais. Veja ensaios da Punctum Picture e converse com calma sobre a sua ideia.",
    lead:
      "Um retrato não precisa começar por uma pose pronta. A conversa define o clima, o lugar e quanto de direção faz sentido para a pessoa que estará diante da câmera.",
    detail:
      "Maria Helena trabalha com retratos individuais e narrativas pessoais observando expressão, luz e ambiente. Quando a direção ajuda, ela entra de forma simples; quando o gesto já diz o necessário, a câmera acompanha sem interromper.",
    image: "/photos/p054.jpg",
    serviceType: "Fotografia de retratos",
    categorySlugs: ["retrato"],
  },
  {
    slug: "eventos",
    name: "Eventos",
    seoTitle: "Fotografia de eventos com olhar documental",
    seoDescription:
      "Fotografia de eventos com atenção ao que acontece sem interromper a cena. Veja celebrações, shows e encontros já fotografados pela Punctum Picture de perto.",
    lead:
      "Eventos mudam de ritmo o tempo todo. A cobertura precisa perceber encontros, detalhes e reações sem transformar cada momento em uma chamada para a câmera.",
    detail:
      "O portfólio reúne celebrações, apresentações e encontros coletivos em que a fotografia acompanha o acontecimento como ele se desenrola. Antes da data, a conversa serve para entender horários, pessoas importantes e o que não pode passar sem registro.",
    image: "/photos/p110.jpg",
    serviceType: "Fotografia de eventos",
    categorySlugs: [],
    albumSlugs: [
      "pequenas-celebracoes",
      "palco-aceso",
      "noite-em-voz-alta",
      "cancao-eletrica",
      "ritos-de-luz",
      "entre-nos",
    ],
  },
  {
    slug: "musica-e-shows",
    name: "Música e shows",
    seoTitle: "Fotografia de música e shows ao vivo",
    seoDescription:
      "Fotografia de música e shows com foco em palco, luz, gesto e presença. Conheça trabalhos ao vivo da Punctum Picture e converse sobre a cobertura do evento.",
    lead:
      "No palco, luz e movimento mudam rápido. A fotografia precisa antecipar gestos sem afastar a imagem da energia que o público e quem se apresenta realmente viveram.",
    detail:
      "A experiência publicada da Punctum inclui apresentações em que luz dura, sombra, proximidade e movimento fazem parte da narrativa. O planejamento combina acesso, duração da cobertura e momentos importantes sem prometer uma cena que não existe.",
    image: "/photos/p097.jpg",
    serviceType: "Fotografia de música e shows",
    categorySlugs: ["musica"],
  },
  {
    slug: "fotografia-esportiva",
    name: "Fotografia esportiva",
    seoTitle: "Fotografia esportiva e movimento",
    seoDescription:
      "Fotografia esportiva para registrar movimento, concentração e instante decisivo. Veja jogos e provas no portfólio da Punctum Picture e peça um orçamento.",
    lead:
      "Esporte pede leitura de movimento antes do clique. A câmera acompanha concentração, velocidade e decisão para chegar ao instante sem interromper a ação.",
    detail:
      "O portfólio reúne jogos, beach tennis e cenas de movimento em que posição e timing importam mais do que dirigir quem está competindo. A conversa prévia define acesso, duração e quais momentos merecem cobertura prioritária.",
    image: "/photos/p038.jpg",
    serviceType: "Fotografia esportiva",
    categorySlugs: ["esporte", "movimento"],
  },
  {
    slug: "familias",
    name: "Famílias",
    seoTitle: "Fotografia de família com afeto e presença",
    seoDescription:
      "Fotografia de família com espaço para afeto, infância e celebrações sem transformar o encontro em uma sequência de poses. Veja o portfólio da Punctum.",
    lead:
      "Família rende imagens quando as pessoas conseguem continuar sendo elas mesmas. A sessão pode ter alguma direção, mas não precisa controlar cada gesto para funcionar.",
    detail:
      "A fotografia acompanha vínculos, brincadeiras e pequenas celebrações com atenção ao que muda de uma pessoa para outra. Antes do encontro, a conversa ajuda a escolher ritmo e lugar sem montar uma rotina de poses igual para toda família.",
    image: "/photos/p015.jpg",
    serviceType: "Fotografia de família",
    categorySlugs: ["familia"],
  },
  {
    slug: "fotografia-documental",
    name: "Fotografia documental",
    seoTitle: "Fotografia documental de histórias reais",
    seoDescription:
      "Fotografia documental para histórias, comunidades e cenas do cotidiano. Conheça trabalhos da Punctum Picture e converse sobre o que você quer preservar.",
    lead:
      "No trabalho documental, a imagem nasce da atenção ao que já está acontecendo. Pessoas, espaço e tempo entram na narrativa sem precisar parecer uma produção montada.",
    detail:
      "Os ensaios publicados passam por fé, encontros coletivos e cenas do cotidiano. A proposta é entender primeiro o contexto e só então decidir distância, ritmo e presença da câmera, preservando a leitura de quem vive a situação.",
    image: "/photos/p047.jpg",
    serviceType: "Fotografia documental",
    categorySlugs: ["documental", "cotidiano"],
  },
] as const;

export function serviceSeoBySlug(slug: string): ServiceSeo | null {
  return SERVICE_SEO_SERVICES.find((service) => service.slug === slug) ?? null;
}

export function matchesServiceSeoAlbum(
  album: Pick<PublicAlbumSummary, "slug" | "categories">,
  service: ServiceSeo,
): boolean {
  if (service.albumSlugs?.includes(album.slug)) return true;
  return album.categories.some((category) => service.categorySlugs.includes(category.slug));
}
