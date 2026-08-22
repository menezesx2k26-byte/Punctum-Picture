import { MessageCircle } from "lucide-react";
import Image from "next/image";
import {
  SITE_DEFAULTS,
  type PublicSiteSettings,
} from "../../shared/public-content";

export function whatsappHref(phone: string, message: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppLink({
  className = "button ghost",
  variant = "inline",
  site = SITE_DEFAULTS,
  label = "Conversar no WhatsApp",
}: {
  className?: string;
  variant?: "inline" | "floating";
  site?: Pick<PublicSiteSettings, "whatsappE164" | "whatsappMessage">;
  label?: string;
}) {
  const href = whatsappHref(site.whatsappE164, site.whatsappMessage);

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
      <MessageCircle size={15} /> {label}
    </a>
  );
}
