import { describe, it, expect } from "vitest";
import { PUNCTUM_DEFAULT_SITE_CONFIG, siteConfigSchema } from "../../shared/config";
import { protectImmersiveConfig } from "../../shared/config/immersive-policy";

describe("contrato de edição da experiência", () => {
  it("protege a abertura e o carrossel sem perder conteúdo ou modificar a entrada", () => {
    const input=structuredClone(PUNCTUM_DEFAULT_SITE_CONFIG);
    const hero=input.pages.home.sections.find(s=>s.type==="hero")!;
    const reel=input.pages.home.sections.find(s=>s.type==="photo-reel")!;
    if(hero.type!=="hero" || reel.type!=="photo-reel") throw Error();
    hero.variant="split"; hero.heroMedia={kind:"site-media",id:"chosen-photo"};
    reel.variant="patch"; reel.enabled=false; reel.photoIds=["photo-c","photo-a","photo-b"];
    input.pages.home.sections.reverse(); input.editorial.home.hero.title="Minha fotografia";
    const output=protectImmersiveConfig(input);
    expect(output.pages.home.sections[0]).toMatchObject({type:"hero",variant:"cinematic",heroMedia:hero.heroMedia});
    expect(output.pages.home.sections.find(s=>s.type==="photo-reel")).toMatchObject({enabled:true,variant:"horizontal",photoIds:["photo-c","photo-a","photo-b"]});
    expect(output.editorial).toEqual(input.editorial);
    expect(hero.variant).toBe("split"); expect(reel.enabled).toBe(false);
    expect(protectImmersiveConfig(output)).toEqual(output);
    expect(siteConfigSchema.safeParse(output).success).toBe(true);
  });
  it("recupera o carrossel ausente em configurações antigas", () => {
    const input=structuredClone(PUNCTUM_DEFAULT_SITE_CONFIG);
    input.pages.home.sections=input.pages.home.sections.filter(s=>s.type!=="photo-reel");
    expect(protectImmersiveConfig(input).pages.home.sections.filter(s=>s.type==="photo-reel")).toHaveLength(1);
  });
  it("mantém escolhas de tema e a ordem e visibilidade das seções secundárias", () => {
    const input=structuredClone(PUNCTUM_DEFAULT_SITE_CONFIG);
    input.theme.motion.intensity="none"; input.theme.image.treatment="monochrome";
    const about=input.pages.home.sections.find(s=>s.type==="about")!; about.enabled=false;
    const output=protectImmersiveConfig(input);
    expect(output.theme).toEqual(input.theme);
    expect(output.pages.home.sections).toEqual(input.pages.home.sections);
  });
});
