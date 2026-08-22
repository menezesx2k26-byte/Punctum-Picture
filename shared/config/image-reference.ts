import { z } from "zod";

export const internalImageIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(
    /^[A-Za-z0-9_-]+$/,
    "A fotografia precisa ser uma referência interna válida.",
  );

export type InternalImageId = z.infer<typeof internalImageIdSchema>;
