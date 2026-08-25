import { z } from "zod";
import { internalImageIdSchema } from "./image-reference";

export const heroMediaRefSchema = z.discriminatedUnion("kind", [
  z
    .object({
      kind: z.literal("site-media"),
      id: internalImageIdSchema,
    })
    .strict(),
  z
    .object({
      kind: z.literal("portfolio-image"),
      id: internalImageIdSchema,
    })
    .strict(),
]);

export type HeroMediaRef = z.infer<typeof heroMediaRefSchema>;
