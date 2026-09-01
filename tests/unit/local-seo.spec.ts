import { describe, expect, it } from "vitest";
import {
  LOCAL_SEO_LOCATIONS,
  localSeoLocationBySlug,
  matchesLocalSeoLocation,
} from "../../shared/local-seo";

describe("local SEO", () => {
  it("mantém as cinco cidades alvo com slugs estáveis", () => {
    expect(LOCAL_SEO_LOCATIONS.map((location) => location.slug)).toEqual([
      "joinville",
      "curitiba",
      "sao-bento-do-sul",
      "rio-negrinho",
      "campo-alegre",
    ]);
  });

  it("encontra cidade pelo slug", () => {
    expect(localSeoLocationBySlug("sao-bento-do-sul")?.city).toBe("São Bento do Sul");
    expect(localSeoLocationBySlug("cidade-inexistente")).toBeNull();
  });

  it("reconhece localização com ou sem acento e UF", () => {
    const saoBento = localSeoLocationBySlug("sao-bento-do-sul");
    expect(saoBento).not.toBeNull();
    expect(matchesLocalSeoLocation("São Bento do Sul - SC", saoBento!)).toBe(true);
    expect(matchesLocalSeoLocation("sao bento do sul", saoBento!)).toBe(true);
    expect(matchesLocalSeoLocation("Joinville - SC", saoBento!)).toBe(false);
  });
});
