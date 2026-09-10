import "../public.css";
import type { ReactNode } from "react";
import { PUNCTUM_DEFAULT_SITE_CONFIG } from "../../shared/config";
import { siteThemeRootProps } from "../lib/site-theme";
import { BarytaGrain } from "./visual/BarytaGrain";
import { GalleryCursor } from "./visual/GalleryCursor";

export function SiteThemeRoot({
  children,
  className,
  ambientCursor = true,
  config = PUNCTUM_DEFAULT_SITE_CONFIG,
}: {
  children: ReactNode;
  className?: string;
  ambientCursor?: boolean;
  config?: unknown;
}) {
  return (
    <div
      className={["site-shell", className].filter(Boolean).join(" ")}
      {...siteThemeRootProps(config)}
    >
      <BarytaGrain />
      {ambientCursor && <GalleryCursor />}
      {children}
    </div>
  );
}
