import { describe, expect, it } from "vitest";
import {
  PUNCTUM_DEFAULT_SITE_CONFIG,
  editorialConfigSchema,
} from "../../shared/config";

describe("EditorialConfig no renderer", () => {
  it("mantém o default válido e controlado", () => {
    expect(
      editorialConfigSchema.parse(PUNCTUM_DEFAULT_SITE_CONFIG.editorial),
    ).toEqual(PUNCTUM_DEFAULT_SITE_CONFIG.editorial);
  });

  it("preserva quebras controladas e caracteres como texto simples", () => {
    const input = structuredClone(PUNCTUM_DEFAULT_SITE_CONFIG.editorial);
    input.home.statement.title = "Presença & memória\nSem pressa";
    const parsed = editorialConfigSchema.parse(input);
    expect(parsed.home.statement.title.split("\n")).toEqual([
      "Presença & memória",
      "Sem pressa",
    ]);
  });

  it("não aceita propriedades desconhecidas nem linguagem executável", () => {
    expect(
      editorialConfigSchema.safeParse({
        ...PUNCTUM_DEFAULT_SITE_CONFIG.editorial,
        customScript: "alert(1)",
      }).success,
    ).toBe(false);
    expect(
      editorialConfigSchema.safeParse({
        ...PUNCTUM_DEFAULT_SITE_CONFIG.editorial,
        home: {
          ...PUNCTUM_DEFAULT_SITE_CONFIG.editorial.home,
          hero: {
            ...PUNCTUM_DEFAULT_SITE_CONFIG.editorial.home.hero,
            title: "javascript:alert(1)",
          },
        },
      }).success,
    ).toBe(false);

    for (const unsafeTitle of [
      "<strong>Texto</strong>",
      "body { color: red; }",
      "document.body.innerHTML = 'texto'",
    ]) {
      expect(
        editorialConfigSchema.safeParse({
          ...PUNCTUM_DEFAULT_SITE_CONFIG.editorial,
          home: {
            ...PUNCTUM_DEFAULT_SITE_CONFIG.editorial.home,
            hero: {
              ...PUNCTUM_DEFAULT_SITE_CONFIG.editorial.home.hero,
              title: unsafeTitle,
            },
          },
        }).success,
      ).toBe(false);
    }
  });
});
