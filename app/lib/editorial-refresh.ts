import type { EditorialConfig } from "../../shared/config";

const previousDefault = "O trabalho de Maria Helena se aproxima sem invadir. Busca a textura dos lugares, a verdade dos gestos e o instante em que uma pessoa deixa de posar para simplesmente estar.";
export const refreshedAbout = "Maria Helena fotografa retratos, esporte, música e cenas do cotidiano. Seu trabalho começou na igreja e se ampliou para outros temas.";

/** Replace only the shipped placeholder; author-edited Studio text wins. */
export function refreshAboutCopy(copy: EditorialConfig["home"]["about"]) {
  return copy.body === previousDefault ? {...copy, body:refreshedAbout} : copy;
}
