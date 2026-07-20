"use client";

import { FormEvent, useState } from "react";
import { WhatsAppLink } from "./WhatsAppLink";

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("Enviando sua mensagem…");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/public/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json()) as {
          error?: { message?: string };
        };
        throw new Error(body.error?.message ?? "Não foi possível enviar.");
      }
      event.currentTarget.reset();
      setStatus("success");
      setMessage("Mensagem recebida. Retornaremos em breve.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar.");
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="name">Nome</label>
        <input id="name" name="name" required minLength={2} autoComplete="name" />
      </div>
      <div className="field">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" />
      </div>
      <div className="field">
        <label htmlFor="phone">WhatsApp</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="field">
        <label htmlFor="service">Tipo de ensaio</label>
        <select id="service" name="service" defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
          <option>Casamento</option>
          <option>Ensaio de casal</option>
          <option>Retrato</option>
          <option>Outro</option>
        </select>
      </div>
      <div className="field full">
        <label htmlFor="desiredDate">Data desejada</label>
        <input id="desiredDate" name="desiredDate" type="date" />
      </div>
      <div className="field full">
        <label htmlFor="message">Conte um pouco da sua ideia</label>
        <textarea id="message" name="message" required minLength={10} />
      </div>
      <div hidden aria-hidden="true">
        <label htmlFor="website">Site</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field full">
        <button className="button" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Enviando…" : "Enviar pedido"}
        </button>
        <WhatsAppLink />
      </div>
      <p className="form-status" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  );
}
