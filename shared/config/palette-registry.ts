export const PALETTE_IDS = [
  "punctum-violet",
  "editorial-ivory",
  "rose-mist",
  "nocturne-plum",
  "ink-minimal",
  "warm-earth",
] as const;

export type PaletteId = (typeof PALETTE_IDS)[number];
export type PaletteMode = "light" | "dark";

type PaletteDefinition = {
  id: PaletteId;
  label: string;
  description: string;
  mode: PaletteMode;
  colors: {
    background: string;
    surface: string;
    surfaceSoft: string;
    foreground: string;
    muted: string;
    primary: string;
    primaryDeep: string;
    secondary: string;
    accent: string;
    warmAccent: string;
    editorialAccent: string;
    mauve: string;
    mist: string;
    night: string;
    border: string;
    onDark: string;
    onDarkMuted: string;
  };
  surfaces: {
    carousel: string;
    manifesto: string;
    contact: string;
    archive: string;
    footer: string;
    albumStory: string;
    lightbox: string;
  };
};

export const PALETTE_REGISTRY = {
  "punctum-violet": {
    id: "punctum-violet",
    label: "Violeta orgânico",
    description: "A aparência viva, leve e autoral atual do Punctum.",
    mode: "light",
    colors: {
      background: "#f8f0fa",
      surface: "#fffaff",
      surfaceSoft: "#ead7ef",
      foreground: "#241629",
      muted: "#725e78",
      primary: "#7a25b5",
      primaryDeep: "#4d126c",
      secondary: "#ad488f",
      accent: "#963fba",
      warmAccent: "#c55b88",
      editorialAccent: "#90386e",
      mauve: "#d29be1",
      mist: "#f0dff4",
      night: "#2c1038",
      border: "rgba(91, 36, 109, 0.19)",
      onDark: "#fff8ff",
      onDarkMuted: "rgba(255, 239, 255, 0.76)",
    },
    surfaces: {
      carousel:
        "radial-gradient(ellipse at 12% 18%, rgba(190, 98, 224, 0.26), transparent 34rem), radial-gradient(ellipse at 88% 78%, rgba(197, 67, 143, 0.22), transparent 38rem), linear-gradient(135deg, #291035 0%, #461459 48%, #642047 100%)",
      manifesto:
        "radial-gradient(circle at 18% 24%, rgba(213, 143, 237, 0.3), transparent 28rem), radial-gradient(circle at 88% 72%, rgba(212, 80, 166, 0.32), transparent 32rem), linear-gradient(135deg, #50156c 0%, #6d208d 46%, #862b67 100%)",
      contact:
        "radial-gradient(ellipse at 8% 14%, rgba(218, 143, 232, 0.32), transparent 32rem), radial-gradient(ellipse at 94% 82%, rgba(205, 103, 168, 0.22), transparent 35rem), linear-gradient(138deg, #f5e5f7 0%, #ead3f0 52%, #f5e1ec 100%)",
      archive:
        "radial-gradient(ellipse at 86% 10%, rgba(200, 118, 222, 0.38), transparent 34rem), radial-gradient(ellipse at 10% 52%, rgba(156, 64, 187, 0.2), transparent 40rem), radial-gradient(ellipse at 76% 86%, rgba(209, 99, 164, 0.16), transparent 36rem), linear-gradient(145deg, #f2e4f4 0%, #ead5ef 54%, #f5e6ef 100%)",
      footer:
        "radial-gradient(circle at 12% 22%, rgba(207, 130, 235, 0.24), transparent 24rem), radial-gradient(circle at 88% 76%, rgba(177, 55, 143, 0.22), transparent 26rem), linear-gradient(128deg, #281032 0%, #50196a 48%, #742555 100%)",
      albumStory:
        "radial-gradient(ellipse at 8% 13%, rgba(211, 126, 239, 0.3), transparent 34rem), radial-gradient(ellipse at 94% 42%, rgba(187, 57, 154, 0.3), transparent 42rem), radial-gradient(ellipse at 42% 88%, rgba(121, 45, 181, 0.36), transparent 46rem), linear-gradient(145deg, #351142 0%, #54176e 43%, #752455 100%)",
      lightbox:
        "radial-gradient(circle at 50% 42%, rgba(121, 43, 153, 0.26), transparent 42rem), rgba(31, 8, 39, 0.98)",
    },
  },
  "editorial-ivory": {
    id: "editorial-ivory",
    label: "Marfim editorial",
    description: "Clara, silenciosa e com um toque de revista impressa.",
    mode: "light",
    colors: {
      background: "#f6f0e8", surface: "#fffbf4", surfaceSoft: "#e7dbcf",
      foreground: "#241c19", muted: "#685a52", primary: "#5c2a59",
      primaryDeep: "#3a1737", secondary: "#80465e", accent: "#6e365f",
      warmAccent: "#9d513f", editorialAccent: "#754154", mauve: "#c8a9b9",
      mist: "#efe1e7", night: "#251a26", border: "rgba(70, 43, 52, 0.19)",
      onDark: "#fff9f6", onDarkMuted: "rgba(255, 245, 240, 0.76)",
    },
    surfaces: {
      carousel: "linear-gradient(145deg, #261b27 0%, #54304d 54%, #6d3e4a 100%)",
      manifesto: "radial-gradient(circle at 18% 22%, rgba(220, 177, 197, 0.24), transparent 32rem), linear-gradient(135deg, #4b2848 0%, #71415d 100%)",
      contact: "linear-gradient(138deg, #f3e8dd 0%, #eadbd6 54%, #f5ece4 100%)",
      archive: "radial-gradient(ellipse at 86% 12%, rgba(121, 70, 100, 0.16), transparent 34rem), linear-gradient(145deg, #eee4da 0%, #f6efe7 100%)",
      footer: "linear-gradient(128deg, #241a24 0%, #4e2b49 52%, #63384a 100%)",
      albumStory: "radial-gradient(ellipse at 15% 15%, rgba(204, 153, 181, 0.22), transparent 34rem), linear-gradient(145deg, #2d1d2d 0%, #59334f 100%)",
      lightbox: "rgba(24, 16, 23, 0.98)",
    },
  },
  "rose-mist": {
    id: "rose-mist",
    label: "Rosa delicado",
    description: "Luminosa, afetiva e suave sem perder contraste.",
    mode: "light",
    colors: {
      background: "#f9edf3", surface: "#fff8fc", surfaceSoft: "#ead5df",
      foreground: "#2b1722", muted: "#705363", primary: "#81345f",
      primaryDeep: "#52203d", secondary: "#914568", accent: "#743057",
      warmAccent: "#9b485c", editorialAccent: "#78354f", mauve: "#d5a4bb",
      mist: "#f2dce7", night: "#2a1422", border: "rgba(105, 45, 76, 0.18)",
      onDark: "#fff7fb", onDarkMuted: "rgba(255, 236, 247, 0.78)",
    },
    surfaces: {
      carousel: "linear-gradient(145deg, #2d1525 0%, #65304f 50%, #824153 100%)",
      manifesto: "radial-gradient(circle at 20% 20%, rgba(248, 188, 221, 0.25), transparent 30rem), linear-gradient(135deg, #71365d 0%, #9a4969 100%)",
      contact: "linear-gradient(138deg, #f8e2ed 0%, #efd2e0 54%, #fae9f1 100%)",
      archive: "radial-gradient(ellipse at 84% 10%, rgba(178, 93, 138, 0.2), transparent 34rem), linear-gradient(145deg, #f0dce6 0%, #f9ebf1 100%)",
      footer: "linear-gradient(128deg, #2b1423 0%, #65304f 50%, #844052 100%)",
      albumStory: "radial-gradient(ellipse at 12% 18%, rgba(241, 162, 206, 0.24), transparent 34rem), linear-gradient(145deg, #351829 0%, #713456 100%)",
      lightbox: "rgba(37, 14, 28, 0.98)",
    },
  },
  "nocturne-plum": {
    id: "nocturne-plum",
    label: "Ameixa e Noite Autoral",
    description: "Profundidade preto-violeta, berinjela rica, lavanda e luz quente nas fotografias.",
    mode: "dark",
    colors: {
      background: "#120a17",
      surface: "#1c1024",
      surfaceSoft: "#2a1736",
      foreground: "#f6eef8",
      muted: "#baa4c2",
      primary: "#e0c8eb",
      primaryDeep: "#3d1952",
      secondary: "#5c2a75",
      accent: "#e6cef1",
      warmAccent: "#dca6c8",
      editorialAccent: "#e2cbe8",
      mauve: "#8e5fa0",
      mist: "#381e46",
      night: "#0b050f",
      border: "rgba(230, 206, 241, 0.18)",
      onDark: "#fbf7fd",
      onDarkMuted: "#c8b5cf",
    },
    surfaces: {
      carousel:
        "radial-gradient(ellipse at 15% 20%, rgba(98, 42, 125, 0.28), transparent 36rem), radial-gradient(ellipse at 85% 80%, rgba(140, 55, 120, 0.2), transparent 40rem), #120a17",
      manifesto:
        "radial-gradient(circle at 18% 24%, rgba(110, 48, 140, 0.24), transparent 30rem), linear-gradient(145deg, #1c1024 0%, #2a1736 100%)",
      contact:
        "radial-gradient(ellipse at 10% 15%, rgba(125, 55, 150, 0.22), transparent 34rem), #180d20",
      archive:
        "radial-gradient(ellipse at 85% 15%, rgba(95, 40, 120, 0.2), transparent 38rem), #120a17",
      footer:
        "linear-gradient(180deg, #120a17 0%, #0b050f 100%)",
      albumStory:
        "radial-gradient(ellipse at 20% 20%, rgba(115, 45, 145, 0.25), transparent 40rem), #150c1b",
      lightbox: "rgba(11, 5, 15, 0.98)",
    },
  },
  "ink-minimal": {
    id: "ink-minimal",
    label: "Tinta minimalista",
    description: "Neutra, precisa e espaçosa, com violeta em pequenos gestos.",
    mode: "light",
    colors: {
      background: "#f4f4f1", surface: "#ffffff", surfaceSoft: "#dfdfdc",
      foreground: "#181719", muted: "#5e5a60", primary: "#4e315d",
      primaryDeep: "#2f1d38", secondary: "#5b3c68", accent: "#633b75",
      warmAccent: "#77514e", editorialAccent: "#56364f", mauve: "#bdb2c2",
      mist: "#e8e4ea", night: "#19151d", border: "rgba(36, 31, 39, 0.17)",
      onDark: "#ffffff", onDarkMuted: "rgba(255, 255, 255, 0.75)",
    },
    surfaces: {
      carousel: "linear-gradient(145deg, #171419 0%, #302538 55%, #493144 100%)",
      manifesto: "linear-gradient(135deg, #302638 0%, #59415e 100%)",
      contact: "linear-gradient(138deg, #eeeeea 0%, #e4e1e5 54%, #f5f4f0 100%)",
      archive: "linear-gradient(145deg, #e8e7e4 0%, #f4f3f0 100%)",
      footer: "linear-gradient(128deg, #171419 0%, #312638 52%, #493144 100%)",
      albumStory: "linear-gradient(145deg, #19151d 0%, #35283d 100%)",
      lightbox: "rgba(11, 10, 12, 0.99)",
    },
  },
  "warm-earth": {
    id: "warm-earth",
    label: "Terra acolhedora",
    description: "Quente, humana e orgânica, como papel e fim de tarde.",
    mode: "light",
    colors: {
      background: "#f7eee4", surface: "#fffaf4", surfaceSoft: "#e6d4c7",
      foreground: "#2b1c18", muted: "#6b554b", primary: "#713752",
      primaryDeep: "#472234", secondary: "#82465b", accent: "#77405b",
      warmAccent: "#8d4c37", editorialAccent: "#713f49", mauve: "#c8a5ab",
      mist: "#efddd6", night: "#28191b", border: "rgba(91, 53, 45, 0.19)",
      onDark: "#fff9f3", onDarkMuted: "rgba(255, 239, 229, 0.77)",
    },
    surfaces: {
      carousel: "linear-gradient(145deg, #2a1a1c 0%, #5e3140 52%, #7b473c 100%)",
      manifesto: "radial-gradient(circle at 20% 22%, rgba(224, 161, 142, 0.23), transparent 30rem), linear-gradient(135deg, #633344 0%, #884d48 100%)",
      contact: "linear-gradient(138deg, #f3e4d8 0%, #ead6cb 54%, #f7ebe1 100%)",
      archive: "radial-gradient(ellipse at 84% 12%, rgba(164, 93, 79, 0.16), transparent 34rem), linear-gradient(145deg, #ecddd1 0%, #f7ede4 100%)",
      footer: "linear-gradient(128deg, #29191b 0%, #603344 50%, #7b473c 100%)",
      albumStory: "radial-gradient(ellipse at 12% 16%, rgba(219, 142, 130, 0.22), transparent 34rem), linear-gradient(145deg, #321d22 0%, #663747 100%)",
      lightbox: "rgba(25, 13, 14, 0.98)",
    },
  },
} as const satisfies Record<PaletteId, PaletteDefinition>;
