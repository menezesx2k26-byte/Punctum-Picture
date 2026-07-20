import Link from "next/link";

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  return (
    <header className={`site-header${dark ? " dark" : ""}`}>
      <Link href="/" className="wordmark" aria-label="Punctum Picture — início">
        <span className="wordmark-mark" aria-hidden="true" />
        Punctum Picture
      </Link>
      <nav className="site-nav" aria-label="Navegação principal">
        <Link href="/portfolio">Portfólio</Link>
        <Link href="/#sobre">Sobre</Link>
        <Link href="/contato" className="nav-cta">
          Conversar
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Punctum Picture</span>
      <span>Fotografia autoral · Brasil</span>
    </footer>
  );
}
