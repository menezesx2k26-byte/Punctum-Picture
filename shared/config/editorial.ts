import { z } from "zod";

export const EDITORIAL_TEXT_LIMITS = {
  eyebrow: 70,
  title: 110,
  accent: 70,
  subtitle: 280,
  paragraph: 700,
  biography: 1800,
  cta: 42,
  navigation: 24,
  note: 100,
  seoTitle: 70,
  seoDescription: 180,
} as const;

const unsafeEditorialText =
  /<\s*\/?\s*[a-z][^>]*>|javascript\s*:|@import\b|expression\s*\(|url\s*\(|(?:^|[\s;])(?:body|html|:root|[.#][\w-]+)\s*\{|\b(?:document|window)\s*\.|=>/i;

function editorialText(label: string, max: number, options?: { multiline?: boolean }) {
  let schema = z
    .string()
    .trim()
    .min(1, `${label}: escreva pelo menos uma palavra.`)
    .max(max, `${label}: esse texto ficou um pouco longo.`)
    .refine(
      (value) => !unsafeEditorialText.test(value),
      `${label}: use somente texto simples, sem código ou formatação externa.`,
    );

  if (!options?.multiline) {
    schema = schema.refine(
      (value) => !/[\r\n]/.test(value),
      `${label}: use uma única linha aqui.`,
    );
  }
  return schema;
}

const seoSchema = z
  .object({
    title: editorialText("Título para busca", EDITORIAL_TEXT_LIMITS.seoTitle),
    description: editorialText(
      "Descrição para busca",
      EDITORIAL_TEXT_LIMITS.seoDescription,
      { multiline: true },
    ),
  })
  .strict();

export const editorialConfigSchema = z
  .object({
    home: z
      .object({
        hero: z
          .object({
            eyebrow: editorialText("Pequena frase acima", EDITORIAL_TEXT_LIMITS.eyebrow),
            title: editorialText("Frase principal", EDITORIAL_TEXT_LIMITS.title),
            accent: editorialText("Trecho em destaque", EDITORIAL_TEXT_LIMITS.accent),
            body: editorialText("Texto abaixo", EDITORIAL_TEXT_LIMITS.subtitle, {
              multiline: true,
            }),
            primaryCta: editorialText("Botão principal", EDITORIAL_TEXT_LIMITS.cta),
            secondaryCta: editorialText("Segundo botão", EDITORIAL_TEXT_LIMITS.cta),
          })
          .strict(),
        statement: z
          .object({
            eyebrow: editorialText("Chamada do manifesto", EDITORIAL_TEXT_LIMITS.eyebrow),
            title: editorialText("Frase do manifesto", EDITORIAL_TEXT_LIMITS.title, {
              multiline: true,
            }),
            body: editorialText("Texto do manifesto", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
          })
          .strict(),
        carousel: z
          .object({
            eyebrow: editorialText("Chamada do acervo", EDITORIAL_TEXT_LIMITS.eyebrow),
            title: editorialText("Título do acervo", EDITORIAL_TEXT_LIMITS.title, {
              multiline: true,
            }),
            body: editorialText("Apresentação do acervo", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
            hint: editorialText("Dica do carrossel", EDITORIAL_TEXT_LIMITS.note),
          })
          .strict(),
        featured: z
          .object({
            title: editorialText("Título das histórias", EDITORIAL_TEXT_LIMITS.title),
            accent: editorialText("Trecho em destaque", EDITORIAL_TEXT_LIMITS.accent),
            body: editorialText("Apresentação das histórias", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
          })
          .strict(),
        about: z
          .object({
            eyebrow: editorialText("Chamada sobre você", EDITORIAL_TEXT_LIMITS.eyebrow),
            quote: editorialText("Frase sobre o olhar", EDITORIAL_TEXT_LIMITS.title, {
              multiline: true,
            }),
            body: editorialText("Texto de apresentação", EDITORIAL_TEXT_LIMITS.biography, {
              multiline: true,
            }),
            cta: editorialText("Botão para conhecer o acervo", EDITORIAL_TEXT_LIMITS.cta),
            imageNote: editorialText("Pequena frase sobre a foto", EDITORIAL_TEXT_LIMITS.note),
          })
          .strict(),
        contact: z
          .object({
            eyebrow: editorialText("Chamada para conversar", EDITORIAL_TEXT_LIMITS.eyebrow),
            title: editorialText("Título do contato", EDITORIAL_TEXT_LIMITS.title, {
              multiline: true,
            }),
            body: editorialText("Texto do contato", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
          })
          .strict(),
      })
      .strict(),
    portfolio: z
      .object({
        seo: seoSchema,
        hero: z
          .object({
            title: editorialText("Título do portfólio", EDITORIAL_TEXT_LIMITS.title),
            accent: editorialText("Trecho em destaque", EDITORIAL_TEXT_LIMITS.accent),
            body: editorialText("Apresentação do portfólio", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
            cta: editorialText("Botão do portfólio", EDITORIAL_TEXT_LIMITS.cta),
            imageNote: editorialText("Legenda da foto principal", EDITORIAL_TEXT_LIMITS.note),
          })
          .strict(),
        listing: z
          .object({
            intro: editorialText("Texto antes das histórias", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
          })
          .strict(),
        reel: z
          .object({
            eyebrow: editorialText("Chamada do percurso livre", EDITORIAL_TEXT_LIMITS.eyebrow),
            title: editorialText("Título do percurso livre", EDITORIAL_TEXT_LIMITS.title, {
              multiline: true,
            }),
            body: editorialText("Texto do percurso livre", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
            hint: editorialText("Dica do carrossel", EDITORIAL_TEXT_LIMITS.note),
          })
          .strict(),
      })
      .strict(),
    archive: z
      .object({
        seo: seoSchema,
        hero: z
          .object({
            title: editorialText("Título do arquivo", EDITORIAL_TEXT_LIMITS.title),
            accent: editorialText("Trecho em destaque", EDITORIAL_TEXT_LIMITS.accent),
            body: editorialText("Apresentação do arquivo", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
          })
          .strict(),
      })
      .strict(),
    contact: z
      .object({
        seo: seoSchema,
        hero: z
          .object({
            eyebrow: editorialText("Chamada da página de contato", EDITORIAL_TEXT_LIMITS.eyebrow),
            title: editorialText("Frase principal do contato", EDITORIAL_TEXT_LIMITS.title, {
              multiline: true,
            }),
            body: editorialText("Apresentação do contato", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
            imageNote: editorialText("Legenda da foto de contato", EDITORIAL_TEXT_LIMITS.note),
          })
          .strict(),
        form: z
          .object({
            eyebrow: editorialText("Chamada antes do formulário", EDITORIAL_TEXT_LIMITS.eyebrow),
            title: editorialText("Título antes do formulário", EDITORIAL_TEXT_LIMITS.title),
            accent: editorialText("Trecho em destaque", EDITORIAL_TEXT_LIMITS.accent),
            body: editorialText("Texto antes do formulário", EDITORIAL_TEXT_LIMITS.paragraph, {
              multiline: true,
            }),
          })
          .strict(),
      })
      .strict(),
    album: z
      .object({
        storyTitle: editorialText("Título da história", EDITORIAL_TEXT_LIMITS.title),
        archiveNote: editorialText("Texto ao final do ensaio", EDITORIAL_TEXT_LIMITS.subtitle, {
          multiline: true,
        }),
        archiveCta: editorialText("Botão ao final do ensaio", EDITORIAL_TEXT_LIMITS.cta),
      })
      .strict(),
    chrome: z
      .object({
        brandSubtitle: editorialText("Palavra abaixo da marca", EDITORIAL_TEXT_LIMITS.navigation),
        navigation: z
          .object({
            portfolio: editorialText("Nome do portfólio no menu", EDITORIAL_TEXT_LIMITS.navigation),
            archive: editorialText("Nome do arquivo no menu", EDITORIAL_TEXT_LIMITS.navigation),
            about: editorialText("Nome da apresentação no menu", EDITORIAL_TEXT_LIMITS.navigation),
            contact: editorialText("Nome do contato no menu", EDITORIAL_TEXT_LIMITS.navigation),
          })
          .strict(),
        footer: z
          .object({
            tagline: editorialText("Frase do rodapé", EDITORIAL_TEXT_LIMITS.subtitle, {
              multiline: true,
            }),
            stories: editorialText("Histórias no rodapé", EDITORIAL_TEXT_LIMITS.navigation),
            archive: editorialText("Arquivo no rodapé", EDITORIAL_TEXT_LIMITS.navigation),
            contact: editorialText("Contato no rodapé", EDITORIAL_TEXT_LIMITS.navigation),
            instagram: editorialText("Instagram no rodapé", EDITORIAL_TEXT_LIMITS.navigation),
            email: editorialText("E-mail no rodapé", EDITORIAL_TEXT_LIMITS.navigation),
            credit: editorialText("Assinatura do rodapé", EDITORIAL_TEXT_LIMITS.note),
          })
          .strict(),
        whatsappCta: editorialText("Botão do WhatsApp", EDITORIAL_TEXT_LIMITS.cta),
      })
      .strict(),
  })
  .strict();

export type EditorialConfig = z.infer<typeof editorialConfigSchema>;

export const PUNCTUM_DEFAULT_EDITORIAL_CONFIG: EditorialConfig =
  editorialConfigSchema.parse({
    home: {
      hero: {
        eyebrow: "Maria Helena · fotografia documental",
        title: "Fotografias de",
        accent: "Maria Helena.",
        body: "Retratos, esporte, música e o que encontro pelo caminho.",
        primaryCta: "Ver histórias",
        secondaryCta: "Abrir arquivo",
      },
      statement: {
        eyebrow: "Como comecei",
        title: "Comecei na fotografia na igreja, e desde então nunca mais parei.",
        body: "Maria Helena · Punctum Picture",
      },
      carousel: {
        eyebrow: "Do acervo",
        title: "Fotografias para ver de perto.",
        body: "Uma seleção de retratos, apresentações, encontros e dias comuns.",
        hint: "Arraste para girar. Toque numa foto para abrir.",
      },
      featured: {
        title: "Alguns",
        accent: "ensaios.",
        body: "Abra um ensaio para ver a sequência completa.",
      },
      about: {
        eyebrow: "Sobre a Punctum",
        quote: "Comecei na fotografia na igreja, e desde então nunca mais parei.",
        body: "Maria Helena fotografa retratos, esporte, música e cenas do cotidiano. Seu trabalho começou na igreja e se ampliou para outros temas.",
        cta: "Ver fotografias",
        imageNote: "Maria Helena",
      },
      contact: {
        eyebrow: "Vamos conversar",
        title: "O que vamos fotografar?",
        body: "Me conte o que você tem em mente, a cidade e a data. Podemos começar pelo WhatsApp.",
      },
    },
    portfolio: {
      seo: {
        title: "Portfólio",
        description: "Histórias de música, retrato, esporte, família e vida documental fotografadas por Maria Helena.",
      },
      hero: {
        title: "Um olhar,",
        accent: "muitos pulsos.",
        body: "Do recolhimento de um rito à energia de uma quadra, cada ensaio preserva sua própria temperatura, voz e maneira de ocupar o tempo.",
        cta: "Percorrer histórias",
        imageNote: "Retrato / Outono rubro",
      },
      listing: {
        intro: "Cada história abaixo reúne todas as fotografias de uma série, na ordem e no ritmo em que ela pede para ser vista.",
      },
      reel: {
        eyebrow: "Outro modo de olhar",
        title: "Sem categorias.\nSó presença.",
        body: "Um percurso livre aproxima imagens de universos diferentes e deixa que cor, gesto e luz criem novas relações entre elas.",
        hint: "Arraste para girar. Toque numa foto para abrir.",
      },
    },
    archive: {
      seo: {
        title: "Arquivo completo",
        description: "As fotografias do arquivo Punctum Picture, reunidas em um percurso visual completo e sempre atualizado.",
      },
      hero: {
        title: "Nenhum instante",
        accent: "de fora.",
        body: "Um percurso integral pelas fotografias de Maria Helena. Filtre por linguagem ou abra qualquer imagem para observá-la sem pressa.",
      },
    },
    contact: {
      seo: {
        title: "Contato",
        description: "Converse com Maria Helena sobre retratos, eventos, família, música e projetos documentais.",
      },
      hero: {
        eyebrow: "Contato e projetos",
        title: "Antes da fotografia, existe uma conversa.",
        body: "Conte a sua história, o lugar e aquilo que não pode passar sem memória. Maria Helena responde pessoalmente.",
        imageNote: "Fim de tarde / Arquivo 033",
      },
      form: {
        eyebrow: "Começar por aqui",
        title: "Com tempo.",
        accent: "Com atenção.",
        body: "Retratos, encontros familiares, eventos, música, esporte ou uma ideia ainda sem nome. Cada projeto começa entendendo o que deve permanecer verdadeiro.",
      },
    },
    album: {
      storyTitle: "Sobre a história",
      archiveNote: "Esta história faz parte do arquivo completo da Punctum Picture.",
      archiveCta: "Percorrer todas as fotografias",
    },
    chrome: {
      brandSubtitle: "Fotografia",
      navigation: {
        portfolio: "Portfólio",
        archive: "Arquivo",
        about: "Sobre",
        contact: "Conversar",
      },
      footer: {
        tagline: "Fotografia de presença, gesto e movimento.",
        stories: "Histórias",
        archive: "Arquivo completo",
        contact: "Contato",
        instagram: "Instagram",
        email: "E-mail",
        credit: "Maria Helena · Brasil",
      },
      whatsappCta: "Conversar no WhatsApp",
    },
  });
