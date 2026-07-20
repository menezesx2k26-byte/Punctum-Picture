import Image from "next/image";
import Link from "next/link";

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  return (
    <header className={`site-header${dark ? " dark" : ""}`}>
      <Link href="/" className="wordmark" aria-label="Punctum Picture — início">
        <span className="wordmark-art" aria-hidden="true">
          <Image
            src="/logo-punctum.png"
            alt=""
            width={720}
            height={799}
            priority
          />
        </span>
        <span className="wordmark-subtitle" aria-hidden="true">
          Fotografia
        </span>
      </Link>
      <nav className="site-nav" aria-label="Navegação principal">
        <Link href="/portfolio">Portfólio</Link>
        <Link href="/arquivo">Arquivo</Link>
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
      <div>
        <span className="footer-wordmark">Punctum Picture</span>
        <p>Fotografia de presença, gesto e movimento.</p>
      </div>
      <nav aria-label="Navegação do rodapé">
        <Link href="/portfolio">Histórias</Link>
        <Link href="/arquivo">Arquivo completo</Link>
        <Link href="/contato">Contato</Link>
      </nav>
      <span>© {new Date().getFullYear()} · Maria Helena · Brasil</span>
    </footer>
  );
}
