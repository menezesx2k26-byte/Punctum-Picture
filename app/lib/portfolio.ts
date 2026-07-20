export type PortfolioImage = {
  number: number;
  src: string;
  alt: string;
};

export type PortfolioAlbum = {
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  description: string;
  cover: string;
  gallery: PortfolioImage[];
  featured?: boolean;
};

export type ArchiveImage = PortfolioImage & {
  albumSlug: string | null;
  albumTitle: string;
  category: string;
};

function photoPath(number: number) {
  return `/photos/p${number.toString().padStart(3, "0")}.jpg`;
}

function makeSeries(numbers: number[], alt: string): PortfolioImage[] {
  return numbers.map((number, index) => ({
    number,
    src: photoPath(number),
    alt: `${alt} — fotografia ${index + 1} de ${numbers.length}`,
  }));
}

function makeAlbum(input: Omit<PortfolioAlbum, "cover" | "gallery"> & {
  numbers: number[];
  coverNumber?: number;
  imageAlt: string;
}): PortfolioAlbum {
  const { numbers, coverNumber = numbers[0], imageAlt, ...album } = input;
  return {
    ...album,
    cover: photoPath(coverNumber),
    gallery: makeSeries(numbers, imageAlt),
  };
}

export const portfolioAlbums: PortfolioAlbum[] = [
  makeAlbum({
    slug: "ritos-de-luz",
    title: "Fé e Tradição",
    category: "Documental",
    subtitle: "Fé, silêncio e comunidade iluminados por dentro",
    description:
      "Velas, encontros e símbolos de devoção compõem uma narrativa de presença coletiva. A luz pequena atravessa a sombra e transforma o gesto cotidiano em memória.",
    numbers: [2, 3, 4, 9, 21, 22, 32],
    coverNumber: 9,
    imageAlt: "Cena de fé e tradição registrada por Maria Helena",
    featured: true,
  }),
  makeAlbum({
    slug: "velocidade-e-materia",
    title: "Velocidade & matéria",
    category: "Movimento",
    subtitle: "Terra, metal e segundos que não voltam",
    description:
      "Entre a poeira da pista e o brilho de um automóvel antigo, o movimento aparece como textura. Um ensaio sobre força, cor e o prazer de perseguir o instante.",
    numbers: [5, 6, 7, 8, 20],
    coverNumber: 5,
    imageAlt: "Automobilismo e cultura automotiva fotografados por Maria Helena",
  }),
  makeAlbum({
    slug: "intervalos-da-cidade",
    title: "Intervalos da cidade",
    category: "Cotidiano",
    subtitle: "Pequenas pausas entre arquitetura, natureza e caminho",
    description:
      "Fachadas, flores, pássaros e o último brilho do dia revelam uma cidade observada sem pressa. São imagens sobre aquilo que costuma passar despercebido.",
    numbers: [10, 11, 23, 33, 45, 46],
    coverNumber: 33,
    imageAlt: "Paisagem urbana ou detalhe natural fotografado por Maria Helena",
    featured: true,
  }),
  makeAlbum({
    slug: "palco-aceso",
    title: "Palco aceso",
    category: "Música",
    subtitle: "Cor, suor e presença diante do público",
    description:
      "O palco é tratado como um organismo vivo: luzes duras, corpos em movimento e instantes de entrega formam uma sequência elétrica e próxima.",
    numbers: [12, 13, 14, 15, 16, 17, 18],
    coverNumber: 15,
    imageAlt: "Apresentação musical fotografada por Maria Helena",
    featured: true,
  }),
  makeAlbum({
    slug: "personagens-do-campo",
    title: "Personagens do campo",
    category: "Retrato",
    subtitle: "Atitude, humor e invenção de personagem",
    description:
      "Um retrato pode ser também uma brincadeira consciente com roupas, cenário e postura. Nesta série, a personagem encontra liberdade entre árvores, botas e chapéu.",
    numbers: [19, 24, 25, 26, 27, 28, 29, 30, 31],
    coverNumber: 27,
    imageAlt: "Ensaio de retrato com estética country fotografado por Maria Helena",
    featured: true,
  }),
  makeAlbum({
    slug: "entre-nos",
    title: "Entre nós",
    category: "Documental",
    subtitle: "Afeto, convivência e os gestos de um encontro",
    description:
      "A câmera acompanha uma comunidade em seus intervalos: conversas, risos, refeições e pequenas cumplicidades. O acontecimento nasce das relações.",
    numbers: [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
    coverNumber: 34,
    imageAlt: "Encontro comunitário fotografado por Maria Helena",
  }),
  makeAlbum({
    slug: "outono-rubro",
    title: "Outono rubro",
    category: "Retrato",
    subtitle: "Cor, intimidade e presença no cenário urbano",
    description:
      "Vermelhos intensos e gestos tranquilos constroem um ensaio em que a cidade não é fundo: ela participa, enquadra e devolve atmosfera às pessoas.",
    numbers: [47, 48, 49, 50, 51, 52, 53, 54],
    coverNumber: 54,
    imageAlt: "Retrato entre árvores vermelhas fotografado por Maria Helena",
    featured: true,
  }),
  makeAlbum({
    slug: "vermelho-em-cena",
    title: "Vermelho em cena",
    category: "Retrato",
    subtitle: "Teatro, elegância e um personagem que encara a lente",
    description:
      "O figurino, o leque e a arquitetura criam uma pequena cena cinematográfica. A série alterna mistério e humor sem perder a delicadeza do retrato.",
    numbers: [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65],
    coverNumber: 61,
    imageAlt: "Retrato teatral em vestido vermelho fotografado por Maria Helena",
    featured: true,
  }),
  makeAlbum({
    slug: "cinema-de-domingo",
    title: "Cinema de domingo",
    category: "Retrato",
    subtitle: "Uma personagem retrô entre concreto e automóvel",
    description:
      "Preto e branco, vestido de poás e enquadramentos oblíquos transformam um espaço comum em sequência de cinema. O ensaio tem ritmo, jogo e movimento.",
    numbers: [66, 67, 68, 69, 70, 71, 72, 73],
    coverNumber: 67,
    imageAlt: "Ensaio retrô em vestido de poás fotografado por Maria Helena",
  }),
  makeAlbum({
    slug: "corpo-em-jogo",
    title: "Corpo em jogo",
    category: "Esporte",
    subtitle: "Concentração, impulso e o instante decisivo",
    description:
      "Na quadra, cada fotografia precisa antecipar o gesto. A série reúne força, espera, velocidade e a geometria criada por corpos em competição.",
    numbers: [74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84],
    coverNumber: 79,
    imageAlt: "Competição esportiva fotografada por Maria Helena",
    featured: true,
  }),
  makeAlbum({
    slug: "pequenas-celebracoes",
    title: "Pequenas celebrações",
    category: "Família",
    subtitle: "Infância, descoberta e alegria sem direção",
    description:
      "Uma festa infantil é feita de acontecimentos mínimos e enormes: mãos sujas, corridas, sustos, bolo e colo. A câmera acompanha sem interromper a brincadeira.",
    numbers: [85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98],
    coverNumber: 85,
    imageAlt: "Infância e celebração familiar fotografadas por Maria Helena",
    featured: true,
  }),
  makeAlbum({
    slug: "noite-em-voz-alta",
    title: "Noite em voz alta",
    category: "Música",
    subtitle: "Presença cênica atravessada por vermelho e violeta",
    description:
      "O contraste entre luz, sombra e atitude conduz esta sequência. Cada imagem preserva a força individual dos artistas e a vibração coletiva do palco.",
    numbers: [99, 100, 101, 102, 103, 104, 105, 106],
    coverNumber: 102,
    imageAlt: "Show sob luzes vermelhas e violetas fotografado por Maria Helena",
    featured: true,
  }),
  makeAlbum({
    slug: "cancao-eletrica",
    title: "Canção elétrica",
    category: "Música",
    subtitle: "Uma voz entre azul profundo, branco e movimento",
    description:
      "A proximidade com a artista transforma a apresentação em retrato. Expressão, esforço e luz criam uma narrativa intensa do primeiro ao último acorde.",
    numbers: [107, 108, 109, 110, 111, 112, 113],
    coverNumber: 110,
    imageAlt: "Cantora em apresentação ao vivo fotografada por Maria Helena",
    featured: true,
  }),
];

const mariaHelena: ArchiveImage = {
  number: 1,
  src: photoPath(1),
  alt: "Maria Helena fotografando com uma câmera",
  albumSlug: null,
  albumTitle: "Maria Helena",
  category: "Autorretrato",
};

export const archiveImages: ArchiveImage[] = [
  mariaHelena,
  ...portfolioAlbums.flatMap((album) =>
    album.gallery.map((image) => ({
      ...image,
      albumSlug: album.slug,
      albumTitle: album.title,
      category: album.category,
    })),
  ),
].sort((a, b) => a.number - b.number);

const carouselNumbers = [1, 9, 15, 27, 33, 54, 61, 71, 79, 89, 102, 110];

export const carouselImages = carouselNumbers.map(
  (number) => archiveImages.find((image) => image.number === number)!,
);

export const featuredAlbums = portfolioAlbums.filter((album) => album.featured);
