import { describe, expect, it } from "vitest";
import { PUNCTUM_DEFAULT_EDITORIAL_CONFIG } from "../../shared/config";
import { refreshAboutCopy, refreshedAbout } from "../../app/lib/editorial-refresh";

describe("atualização editorial segura", () => {
  it("preserva texto autoral editado no Studio", () => {
    const custom = {...PUNCTUM_DEFAULT_EDITORIAL_CONFIG.home.about, body:"Texto escrito por Maria."};
    expect(refreshAboutCopy(custom)).toBe(custom);
  });
  it("substitui somente o texto genérico distribuído anteriormente", () => {
    const old = {...PUNCTUM_DEFAULT_EDITORIAL_CONFIG.home.about, body:"O trabalho de Maria Helena se aproxima sem invadir. Busca a textura dos lugares, a verdade dos gestos e o instante em que uma pessoa deixa de posar para simplesmente estar."};
    expect(refreshAboutCopy(old).body).toBe(refreshedAbout);
  });
});
