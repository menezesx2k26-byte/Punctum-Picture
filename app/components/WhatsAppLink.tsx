"use client";

import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_PHONE = "554797821657";
const DEFAULT_MESSAGE =
  "Olá Maria! vim pelo seu site, tenho interesse no seu trabalho.";

function whatsappHref(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppLink({
  className = "button ghost",
  variant = "inline",
}: {
  className?: string;
  variant?: "inline" | "floating";
}) {
  const [href, setHref] = useState(() =>
    whatsappHref(DEFAULT_PHONE, DEFAULT_MESSAGE),
  );

  useEffect(() => {
    fetch("/api/public/site")
      .then(
        (response) =>
          response.json() as Promise<{
          site?: { whatsappE164?: string | null; whatsappMessage?: string | null };
          }>,
      )
      .then((body) => {
        const phone = body.site?.whatsappE164?.replace(/\D/g, "") || DEFAULT_PHONE;
        const message = body.site?.whatsappMessage || DEFAULT_MESSAGE;
        setHref(whatsappHref(phone, message));
      })
      .catch(() => undefined);
  }, []);

  if (variant === "floating") {
    return (
      <a
        className="floating-whatsapp"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="Conversar com Maria pelo WhatsApp"
      >
        <Image
          src="/icons8-whatsapp.svg"
          alt=""
          width={48}
          height={48}
          unoptimized
          aria-hidden="true"
        />
        <span>WhatsApp</span>
      </a>
    );
  }

  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      <MessageCircle size={15} /> Conversar no WhatsApp
    </a>
  );
}
