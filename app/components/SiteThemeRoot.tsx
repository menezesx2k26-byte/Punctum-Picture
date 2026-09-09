import "../public.css";
import type { ReactNode } from "react";
import { PUNCTUM_DEFAULT_SITE_CONFIG } from "../../shared/config";
import { siteThemeRootProps } from "../lib/site-theme";

export function SiteThemeRoot({
  children,
  className,
  config = PUNCTUM_DEFAULT_SITE_CONFIG,
}: {
  children: ReactNode;
  className?: string;
  config?: unknown;
}) {
  return (
    <div
      className={["site-shell", className].filter(Boolean).join(" ")}
      {...siteThemeRootProps(config)}
    >
      {children}
    </div>
  );
}
