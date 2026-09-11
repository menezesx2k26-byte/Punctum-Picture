import { describe, expect, it } from "vitest";
import { PUNCTUM_DEFAULT_EDITORIAL_CONFIG } from "../../shared/config";
import { refreshAboutCopy, refreshedAbout } from "../../app/lib/editorial-refresh";

describe("refreshing the shipped biography", () => {
  it("preserves text written in Studio", () => {
    const copy = {...PUNCTUM_DEFAULT_EDITORIAL_CONFIG.home.about,body:"Este é o texto que Maria escolheu publicar."};
    expect(refreshAboutCopy(copy)).toBe(copy);
  });
  it("replaces the known generic placeholder without altering other copy", () => {
    const copy = {...PUNCTUM_DEFAULT_EDITORIAL_CONFIG.home.about,body:"O trabalho de Maria Helena se aproxima sem invadir. Busca a textura dos lugares, a verdade dos gestos e o instante em que uma pessoa deixa de posar para simplesmente estar."};
    expect(refreshAboutCopy(copy)).toEqual({...copy,body:refreshedAbout});
  });
});
