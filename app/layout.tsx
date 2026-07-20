import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const editorial = Cormorant_Garamond({
  variable: "--font-editorial",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.PUBLIC_SITE_URL ?? "https://punctumpicture.com",
  ),
  title: {
    default: "Punctum Picture — fotografia autoral",
    template: "%s — Punctum Picture",
  },
  description:
    "Fotografias que preservam presença, gesto e memória. Conheça o portfólio da Punctum Picture.",
  applicationName: "Punctum Picture",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Punctum Picture",
    title: "Punctum Picture — fotografia autoral",
    description: "Fotografias que preservam presença, gesto e memória.",
    images: [
      {
        url: "/portfolio/music-cover.jpg",
        width: 2730,
        height: 1820,
        alt: "Fotografia de espetáculo por Maria Helena",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Punctum Picture — fotografia autoral",
    description: "Fotografias que preservam presença, gesto e memória.",
    images: ["/portfolio/music-cover.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${editorial.variable} ${sans.variable}`}>
        {children}
      </body>
    </html>
  );
}
