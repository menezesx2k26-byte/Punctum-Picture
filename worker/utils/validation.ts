import { z } from "zod";
import { AppError } from "./errors";

export const albumCreateSchema = z.object({
  title: z.string().trim().min(2).max(120),
});

export const albumUpdateSchema = z
  .object({
    title: z.string().trim().min(2).max(120).optional(),
    subtitle: z.string().trim().max(180).nullable().optional(),
    description: z.string().trim().max(5000).nullable().optional(),
    location: z.string().trim().max(160).nullable().optional(),
    shootDate: z.string().date().nullable().optional(),
    featured: z.boolean().optional(),
    seoTitle: z.string().trim().max(70).nullable().optional(),
    seoDescription: z.string().trim().max(180).nullable().optional(),
    categoryIds: z.array(z.string().min(1).max(100)).max(10).optional(),
  })
  .strict();

export const imageUpdateSchema = z
  .object({
    altText: z.string().trim().max(240).nullable().optional(),
    focalX: z.number().min(0).max(1).nullable().optional(),
    focalY: z.number().min(0).max(1).nullable().optional(),
  })
  .strict();

export const inquirySchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(180).optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    instagram: z.string().trim().max(80).optional().or(z.literal("")),
    service: z.string().trim().max(100).optional().or(z.literal("")),
    desiredDate: z.string().date().optional().or(z.literal("")),
    message: z.string().trim().min(10).max(3000),
    website: z.string().max(300).optional(),
  })
  .strict();

export const uploadIntentSchema = z
  .object({
    albumId: z.string().min(1).max(100),
    filename: z.string().trim().min(1).max(240),
    mimeType: z.string().min(1).max(100),
    sizeBytes: z.number().int().positive(),
  })
  .strict();

export const uploadCompleteSchema = z
  .object({
    etag: z.string().trim().max(180).optional(),
    clientChecksum: z.string().trim().max(180).optional(),
  })
  .strict();

export const reorderSchema = z
  .object({
    imageIds: z.array(z.string().min(1).max(100)).min(1).max(1000),
  })
  .strict();

export const coverSchema = z.object({ imageId: z.string().min(1).max(100) }).strict();

export const categoryCreateSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(500).nullable().optional(),
  })
  .strict();

export const categoryUpdateSchema = z
  .object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(500).nullable().optional(),
    isVisible: z.boolean().optional(),
  })
  .strict();

export const settingsSchema = z
  .object({
    brandName: z.string().trim().min(2).max(120).optional(),
    tagline: z.string().trim().max(180).nullable().optional(),
    aboutText: z.string().trim().max(5000).nullable().optional(),
    whatsappE164: z.string().trim().max(24).nullable().optional(),
    whatsappMessage: z.string().trim().max(500).nullable().optional(),
    instagramUrl: z.string().trim().url().max(300).nullable().optional(),
    contactEmail: z.string().trim().email().max(180).nullable().optional(),
    seoTitle: z.string().trim().max(70).nullable().optional(),
    seoDescription: z.string().trim().max(180).nullable().optional(),
  })
  .strict();

export async function parseJson<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<z.infer<T>> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 32_768) {
    throw new AppError(413, "PAYLOAD_TOO_LARGE", "Os dados enviados são grandes demais.");
  }
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    throw new AppError(400, "INVALID_JSON", "O corpo da requisição não contém JSON válido.");
  }
  const result = schema.safeParse(input);
  if (!result.success) {
    const issue = result.error.issues[0];
    const friendlyIssue =
      issue?.message && /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ][^:]{2,70}:\s/.test(issue.message)
        ? issue.message
        : "Revise os campos informados.";
    throw new AppError(
      400,
      "VALIDATION_ERROR",
      friendlyIssue,
      issue?.path.join(".") || undefined,
    );
  }
  return result.data;
}
