import "../admin/admin.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acesso ao painel",
  robots: { index: false, follow: false },
};

export default function AccessPage() {
  return (
    <main className="access-page">
      <div className="access-photo" aria-hidden="true">
        <Image
          src="/photos/p001.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 800px) 100vw, 54vw"
        />
      </div>
      <section className="access-panel">
        <Link className="access-wordmark" href="/">
          Punctum <span>Fotografia</span>
        </Link>
        <LoginForm />
        <Link className="access-back" href="/">
          Voltar ao site
        </Link>
      </section>
    </main>
  );
}
