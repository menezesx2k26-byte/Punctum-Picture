export type DemoAlbum = {
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  cover: string;
  gallery: Array<{ src: string; alt: string }>;
};

export const demoAlbums: DemoAlbum[] = [
  {
    slug: "entre-o-vento-e-o-mar",
    title: "Entre o vento e o mar",
    category: "Ensaio",
    subtitle: "Um fim de tarde à beira d’água",
    description:
      "Uma narrativa sobre presença e movimento. Imagens demonstrativas serão substituídas pelo acervo de Maria Helena antes do lançamento.",
    cover: "/demo/hero.jpg",
    gallery: [
      { src: "/demo/hero.jpg", alt: "Casal caminhando de mãos dadas em um campo" },
      { src: "/demo/details.jpg", alt: "Detalhe de mãos de um casal" },
      { src: "/demo/portrait.jpg", alt: "Retrato ao entardecer junto ao mar" },
      { src: "/demo/wedding.jpg", alt: "Casal em uma celebração ao ar livre" },
    ],
  },
  {
    slug: "luz-de-setembro",
    title: "Luz de setembro",
    category: "Retrato",
    subtitle: "Corpo, luz e horizonte",
    description:
      "Um estudo delicado de luz natural e silêncio, construído em gestos simples.",
    cover: "/demo/portrait.jpg",
    gallery: [
      { src: "/demo/portrait.jpg", alt: "Retrato ao entardecer junto ao mar" },
      { src: "/demo/architecture.jpg", alt: "Casal fotografado em arquitetura geométrica" },
      { src: "/demo/details.jpg", alt: "Detalhe de mãos em preto e branco" },
    ],
  },
  {
    slug: "promessas",
    title: "Promessas",
    category: "Casamento",
    subtitle: "Afeto que atravessa o dia",
    description:
      "Uma celebração observada de perto, com atenção aos pequenos movimentos entre as pessoas.",
    cover: "/demo/wedding.jpg",
    gallery: [
      { src: "/demo/wedding.jpg", alt: "Casal em uma celebração ao ar livre" },
      { src: "/demo/details.jpg", alt: "Detalhe das mãos de um casal" },
      { src: "/demo/architecture.jpg", alt: "Ensaio de casal em arquitetura moderna" },
      { src: "/demo/hero.jpg", alt: "Casal caminhando em uma paisagem aberta" },
    ],
  },
];
