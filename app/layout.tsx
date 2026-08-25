import type { Metadata } from "next";
import { buildSiteMetadata } from "./lib/metadata";
import { loadPublicSiteSettings } from "./lib/server-content";
import "./globals.css";
import "./hero-responsive.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const site = await loadPublicSiteSettings();
  return buildSiteMetadata(
    site,
    process.env.PUBLIC_SITE_URL ?? "https://punctumpicture.com",
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
