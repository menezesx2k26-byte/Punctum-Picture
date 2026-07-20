"use client";

import { FormEvent, useEffect, useState } from "react";

type Settings = {
  brandName: string;
  tagline: string | null;
  aboutText: string | null;
  whatsappE164: string | null;
  whatsappMessage: string | null;
  instagramUrl: string | null;
  contactEmail: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

type SettingsResponse = {
  settings?: Settings;
  error?: { message?: string };
};

const empty: Settings = {
  brandName: "Punctum Picture",
  tagline: "",
  aboutText: "",
  whatsappE164: "",
  whatsappMessage: "",
  instagramUrl: "",
  contactEmail: "",
  seoTitle: "",
  seoDescription: "",
};

export function SettingsManager() {
  const [settings, setSettings] = useState<Settings>(empty);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/admin/api/settings")
      .then((response) => response.json())
      .then((body: unknown) => {
        const parsed = body as SettingsResponse;
        if (parsed.settings) setSettings(parsed.settings);
      })
      .catch(() => setStatus("Não foi possível carregar as configurações."));
  }, []);

  async function save(event: FormEvent) {
    event.preventDefault();
    setStatus("Salvando…");
    const editableSettings = {
      tagline: settings.tagline,
      aboutText: settings.aboutText,
      whatsappE164: settings.whatsappE164,
      whatsappMessage: settings.whatsappMessage,
      instagramUrl: settings.instagramUrl,
      contactEmail: settings.contactEmail,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
    };
    const response = await fetch("/admin/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editableSettings),
    });
    const body = (await response.json()) as SettingsResponse;
    if (!response.ok) {
      setStatus(body.error?.message ?? "Não foi possível salvar.");
      return;
    }
    if (body.settings) setSettings(body.settings);
    setStatus("Configurações salvas.");
  }

  return (
    <>
      <div className="admin-topbar">
        <div>
          <p className="eyebrow">Site</p>
          <h1>Configurações</h1>
        </div>
      </div>
      <form className="admin-grid" onSubmit={save}>
        <section className="admin-card wide">
          <h2>Textos e contato</h2>
          <div className="admin-form">
            <label>
              <span>Frase curta</span>
              <input
                className="admin-input"
                value={settings.tagline ?? ""}
                onChange={(event) => setSettings({ ...settings, tagline: event.target.value })}
              />
            </label>
            <label>
              <span>Sobre</span>
              <textarea
                className="admin-input"
                value={settings.aboutText ?? ""}
                onChange={(event) => setSettings({ ...settings, aboutText: event.target.value })}
              />
            </label>
            <div className="admin-form-row">
              <label>
                <span>WhatsApp com DDI</span>
                <input
                  className="admin-input"
                  value={settings.whatsappE164 ?? ""}
                  onChange={(event) =>
                    setSettings({ ...settings, whatsappE164: event.target.value })
                  }
                  placeholder="5511999999999"
                />
              </label>
              <label>
                <span>E-mail de contato</span>
                <input
                  className="admin-input"
                  type="email"
                  value={settings.contactEmail ?? ""}
                  onChange={(event) =>
                    setSettings({ ...settings, contactEmail: event.target.value })
                  }
                />
              </label>
            </div>
            <label>
              <span>Mensagem padrão do WhatsApp</span>
              <input
                className="admin-input"
                value={settings.whatsappMessage ?? ""}
                onChange={(event) =>
                  setSettings({ ...settings, whatsappMessage: event.target.value })
                }
              />
            </label>
            <label>
              <span>Instagram</span>
              <input
                className="admin-input"
                type="url"
                value={settings.instagramUrl ?? ""}
                onChange={(event) =>
                  setSettings({ ...settings, instagramUrl: event.target.value })
                }
              />
            </label>
          </div>
        </section>
        <aside className="admin-card">
          <h2>SEO básico</h2>
          <div className="admin-form">
            <label>
              <span>Título do site</span>
              <input
                className="admin-input"
                value={settings.seoTitle ?? ""}
                onChange={(event) =>
                  setSettings({ ...settings, seoTitle: event.target.value })
                }
                maxLength={70}
              />
            </label>
            <label>
              <span>Descrição</span>
              <textarea
                className="admin-input"
                value={settings.seoDescription ?? ""}
                onChange={(event) =>
                  setSettings({ ...settings, seoDescription: event.target.value })
                }
                maxLength={180}
              />
            </label>
            <button className="button" type="submit">
              Salvar
            </button>
            <p className="admin-muted" role="status">
              {status}
            </p>
          </div>
        </aside>
      </form>
    </>
  );
}
