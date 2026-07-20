import {
  Camera,
  FolderHeart,
  Inbox,
  LayoutDashboard,
  Settings,
  Tags,
} from "lucide-react";
import Link from "next/link";

const navigation = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/ensaios", label: "Ensaios", icon: FolderHeart },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/contatos", label: "Contatos", icon: Inbox },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-body">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <Link href="/admin" className="wordmark">
            <Camera size={16} aria-hidden="true" />
            Punctum Picture
          </Link>
          <nav aria-label="Painel">
            {navigation.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Icon size={17} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <p className="admin-sidebar-bottom">
            Painel de Maria Helena
            <br />
            Protegido por Cloudflare Access
          </p>
        </aside>
        <main className="admin-main">{children}</main>
        <nav className="mobile-admin-nav" aria-label="Painel no celular">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
