"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/admin/api/session", { method: "DELETE" });
    } finally {
      router.replace("/acesso");
      router.refresh();
    }
  }

  return (
    <button className="admin-logout" type="button" onClick={logout} disabled={busy}>
      <LogOut size={15} aria-hidden="true" />
      {busy ? "Saindo…" : "Sair"}
    </button>
  );
}
