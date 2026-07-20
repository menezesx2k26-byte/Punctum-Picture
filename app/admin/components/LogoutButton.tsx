"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/admin/api/session", { method: "DELETE" });
    } finally {
      window.location.href = "/acesso";
    }
  }

  return (
    <button className="admin-logout" type="button" onClick={logout} disabled={busy}>
      <LogOut size={15} aria-hidden="true" />
      {busy ? "Saindo…" : "Sair"}
    </button>
  );
}
