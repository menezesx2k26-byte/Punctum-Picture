export type LocalSeoLocation = {
  slug: string;
  city: string;
  state: "SC" | "PR";
  stateName: string;
  seoDescription: string;
  lead: string;
  detail: string;
  image: string;
};

export const LOCAL_SEO_LOCATIONS: readonly LocalSeoLocation[] = [
  {
    slug: "joinville",
    city: "Joinville",
    state: "SC",
    stateName: "Santa Catarina",
    seoDescription:
      "Fotógrafa em Joinville para retratos, famílias, eventos, música, esporte e projetos documentais. Conheça a fotografia autoral e o portfólio da Punctum Picture.",
    lead:
      "Em Joinville, a Punctum atende retratos, famílias, eventos, música, esporte e projetos documentais. A fotografia parte do gesto, do ambiente e do que acontece de verdade diante da câmera.",
    detail:
      "A proposta funciona tanto para uma sessão pensada com antecedência quanto para acontecimentos em que o melhor resultado depende de observar sem interromper. A conversa inicial define o tipo de registro, a data e o lugar.",
    image: "/photos/p054.jpg",
  },  {
    slug: "curitiba",
    city: "Curitiba",
    state: "PR",
    stateName: "Paraná",
    seoDescription:
      "Fotógrafa em Curitiba para retratos, eventos e fotografia documental com linguagem autoral. Conheça o portfólio da Punctum Picture e converse com Maria Helena.",
    lead:
      "Em Curitiba, a Punctum atende quem procura retratos, eventos e projetos com uma linguagem menos padronizada. O foco está na presença das pessoas, na luz disponível e na relação entre o corpo e o espaço.",
    detail:
      "Antes de fotografar, Maria Helena entende o que você quer preservar e o que não combina com a ideia. Isso ajuda a escolher o ritmo do ensaio e evita transformar pessoas diferentes no mesmo roteiro de poses.",
    image: "/photos/p061.jpg",
  },
  {
    slug: "sao-bento-do-sul",
    city: "São Bento do Sul",
    state: "SC",
    stateName: "Santa Catarina",
    seoDescription:
      "Fotógrafa em São Bento do Sul para retratos, famílias, eventos, esporte e projetos documentais. Conheça a fotografia autoral e o portfólio da Punctum Picture.",
    lead:
      "Em São Bento do Sul, a Punctum fotografa retratos, famílias, eventos, esporte e projetos documentais sem depender de uma fórmula única. O trabalho procura o instante em que a cena deixa de parecer montada.",
    detail:
      "O ponto de partida é simples: você conta a ideia, a data e onde pretende fotografar. A partir disso, a conversa define se o registro pede mais observação, alguma direção ou uma mistura dos dois.",
    image: "/photos/p027.jpg",
  },  {
    slug: "rio-negrinho",
    city: "Rio Negrinho",
    state: "SC",
    stateName: "Santa Catarina",
    seoDescription:
      "Fotógrafa em Rio Negrinho para retratos, famílias, eventos e fotografia documental. Conheça o trabalho de Maria Helena e o portfólio da Punctum Picture.",
    lead:
      "Em Rio Negrinho, a Punctum atende retratos, famílias, eventos e projetos documentais com uma fotografia baseada em observação. A direção aparece quando ajuda, sem apagar os gestos que já existem.",
    detail:
      "Cada trabalho começa pela conversa sobre quem será fotografado, o que está acontecendo e qual lembrança precisa ficar. Local e horário entram como parte da imagem, não apenas como fundo.",
    image: "/photos/p033.jpg",
  },
  {
    slug: "campo-alegre",
    city: "Campo Alegre",
    state: "SC",
    stateName: "Santa Catarina",
    seoDescription:
      "Fotógrafa em Campo Alegre para retratos, famílias, eventos e ensaios externos. Conheça a fotografia autoral de Maria Helena e o portfólio da Punctum Picture.",
    lead:
      "Em Campo Alegre, a Punctum atende retratos, famílias, eventos e ensaios em ambiente externo. A paisagem pode participar da fotografia sem tomar o lugar de quem está sendo fotografado.",
    detail:
      "A escolha do lugar vem depois da história que você quer contar. A conversa inicial ajuda a decidir o que faz sentido para a luz, o movimento e o tipo de registro, sem vender um cenário pronto para todo mundo.",
    image: "/photos/p089.jpg",
  },
] as const;
export const LOCAL_SEO_SERVICES = [
  "Retrato",
  "Família",
  "Evento",
  "Música",
  "Esporte",
  "Projeto documental",
] as const;

export function localSeoLocationBySlug(slug: string): LocalSeoLocation | null {
  return LOCAL_SEO_LOCATIONS.find((location) => location.slug === slug) ?? null;
}

function normalizeLocation(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function matchesLocalSeoLocation(
  value: string | null | undefined,
  target: LocalSeoLocation,
): boolean {
  if (!value) return false;
  const normalized = normalizeLocation(value);
  return normalized.includes(normalizeLocation(target.city));
}
