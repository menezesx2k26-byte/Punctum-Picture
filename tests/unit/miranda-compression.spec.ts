import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const home = readFileSync("app/components/MirandaHome.tsx", "utf8");
const styles = readFileSync("app/components/MirandaHome.module.css", "utf8");

describe("Miranda Compression home", () => {
  it("renders a five-panel photographic track backed by real album links", () => {
    expect(home).toContain("slice(0, 5)");
    expect(home).toContain("styles.compressionTrack");
    expect(home).toContain("styles.panel");
    expect(home).toContain("href={`/ensaios/${album.slug}`}");
  });

  it("keeps the Compression expansion interaction accessible to hover and keyboard", () => {
    expect(styles).toContain(".compressionTrack:hover .panel");
    expect(styles).toContain(".panel:hover");
    expect(styles).toContain(".panel:focus-within");
    expect(styles).toContain("flex: 5");
  });

  it("falls back to a stacked touch layout without relying on hover", () => {
    expect(styles).toContain("@media (max-width: 900px)");
    expect(styles).toContain("flex-direction: column");
    expect(styles).toContain(".details");
    expect(styles).toContain("opacity: 1");
  });

  it("uses Punctum styling instead of the template's industrial chartreuse treatment", () => {
    expect(styles).not.toContain("#DFFF00");
    expect(styles).not.toContain("grayscale(100%)");
    expect(styles).toContain("--paper: #f6f5f1");
  });
});
