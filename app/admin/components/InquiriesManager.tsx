"use client";

import { useCallback, useEffect, useState } from "react";

type Inquiry = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  service: string | null;
  desiredDate: string | null;
  message: string;
  status: "new" | "read" | "archived";
  createdAt: string;
};

type InquiriesResponse = {
  inquiries?: Inquiry[];
  error?: { message?: string };
};

export function InquiriesManager() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/admin/api/inquiries");
    const body = (await response.json()) as InquiriesResponse;
    if (!response.ok) throw new Error(body.error?.message ?? "Falha ao carregar.");
    setInquiries(body.inquiries ?? []);
  }, []);

  useEffect(() => {
    void Promise.resolve()
      .then(load)
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : "Falha ao carregar."),
      );
  }, [load]);

  async function update(id: string, status: Inquiry["status"]) {
    await fetch(`/admin/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <p className="eyebrow">Orçamentos</p>
          <h1>Contatos</h1>
        </div>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="admin-list">
        {inquiries.map((inquiry) => (
          <article className="admin-card full" key={inquiry.id}>
            <div className="admin-topbar" style={{ marginBottom: ".7rem" }}>
              <div>
                <h2>{inquiry.name}</h2>
                <span className={`status-pill ${inquiry.status}`}>
                  {inquiry.status === "new"
                    ? "Novo"
                    : inquiry.status === "read"
                      ? "Lido"
                      : "Arquivado"}
                </span>
              </div>
              <time className="admin-muted" dateTime={inquiry.createdAt}>
                {new Date(inquiry.createdAt).toLocaleDateString("pt-BR")}
              </time>
            </div>
            <p>{inquiry.message}</p>
            <p className="admin-muted">
              {inquiry.service ?? "Serviço não informado"} ·{" "}
              {inquiry.desiredDate ?? "Data em aberto"}
              <br />
              {inquiry.email ?? inquiry.phone ?? "Contato não informado"}
            </p>
            <div className="button-row">
              <button className="button small ghost" type="button" onClick={() => update(inquiry.id, "read")}>
                Marcar como lido
              </button>
              <button className="button small ghost" type="button" onClick={() => update(inquiry.id, "archived")}>
                Arquivar
              </button>
            </div>
          </article>
        ))}
        {!inquiries.length && <p className="admin-muted">Nenhum contato recebido ainda.</p>}
      </div>
    </>
  );
}
