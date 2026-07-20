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
    slug: "palco-e-presenca",
    title: "Palco e presença",
    category: "Música",
    subtitle: "Luz, ritmo e presença ao vivo",
    description:
      "Um registro construído entre luzes, gestos e a energia que atravessa o palco.",
    cover: "/portfolio/music-cover.jpg",
    gallery: [
      { src: "/portfolio/music-cover.jpg", alt: "Cantora sob luzes azuis no palco" },
      { src: "/portfolio/music-stage.jpg", alt: "Cantora se apresentando diante da banda" },
      { src: "/portfolio/music-profile.jpg", alt: "Cantora de perfil durante uma apresentação" },
      { src: "/portfolio/music-close.jpg", alt: "Cantora em um momento intenso do espetáculo" },
    ],
  },
  {
    slug: "retratos-de-outono",
    title: "Retratos de outono",
    category: "Retrato",
    subtitle: "Cor e intimidade no cenário urbano",
    description:
      "Um ensaio atento à cor, ao gesto e à delicadeza dos encontros em meio à cidade.",
    cover: "/portfolio/portraits-cover.jpg",
    gallery: [
      { src: "/portfolio/portraits-cover.jpg", alt: "Retrato diante de árvores vermelhas" },
      { src: "/portfolio/portrait-camera.jpg", alt: "Retrato com câmera em um jardim urbano" },
      { src: "/portfolio/portrait-seated.jpg", alt: "Retrato sentado entre folhas de outono" },
      { src: "/portfolio/portrait-couple.jpg", alt: "Casal diante de árvores vermelhas" },
    ],
  },
  {
    slug: "corpo-em-movimento",
    title: "Corpo em movimento",
    category: "Esporte",
    subtitle: "O instante decisivo dentro da quadra",
    description:
      "Força, concentração e velocidade registradas no exato momento em que a ação acontece.",
    cover: "/portfolio/sports-cover.jpg",
    gallery: [
      { src: "/portfolio/sports-cover.jpg", alt: "Jogadora de vôlei durante o saque" },
      { src: "/portfolio/sports-team.jpg", alt: "Atletas de futsal celebrando em quadra" },
      { src: "/portfolio/sports-basket.jpg", alt: "Jogadora de basquete saltando para arremessar" },
      { src: "/portfolio/sports-goalkeeper.jpg", alt: "Goleira concentrada diante da rede" },
    ],
  },
];
