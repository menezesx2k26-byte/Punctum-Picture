"use client";

import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function WhatsAppLink({ className = "button ghost" }: { className?: string }) {
  const [href, setHref] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public/site")
      .then(
        (response) =>
          response.json() as Promise<{
          site?: { whatsappE164?: string | null; whatsappMessage?: string | null };
          }>,
      )
      .then((body) => {
          const phone = body.site?.whatsappE164?.replace(/\D/g, "");
          if (!phone) return;
          const message = encodeURIComponent(
            body.site?.whatsappMessage ?? "Olá! Gostaria de conversar sobre um ensaio.",
          );
          setHref(`https://wa.me/${phone}?text=${message}`);
        })
      .catch(() => undefined);
  }, []);

  if (!href) return null;
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      <MessageCircle size={15} /> Conversar no WhatsApp
    </a>
  );
}
