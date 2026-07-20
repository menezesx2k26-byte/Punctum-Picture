import { requireDb, requireOriginals } from "../utils/env";
import { AppError } from "../utils/errors";
import {
  IMAGE_PRESETS,
  isImagePreset,
  negotiateImageFormat,
  resolveGravity,
} from "./presets";

type ImageRow = {
  id: string;
  originalKey: string;
  focalX: number | null;
  focalY: number | null;
  status: "pending" | "ready" | "failed";
  deletedAt: string | null;
};

export async function serveMedia(
  request: Request,
  env: Env,
  imageId: string,
  presetName: string,
): Promise<Response> {
  if (!isImagePreset(presetName)) {
    throw new AppError(400, "INVALID_IMAGE_PRESET", "O formato de imagem solicitado é inválido.");
  }

  const db = requireDb(env);
  const image = await db
    .prepare(
      `SELECT
        id, original_key AS originalKey, focal_x AS focalX, focal_y AS focalY,
        status, deleted_at AS deletedAt
       FROM images WHERE id = ?`,
    )
    .bind(imageId)
    .first<ImageRow>();

  if (!image || image.deletedAt || image.status !== "ready") {
    throw new AppError(404, "IMAGE_NOT_FOUND", "Imagem não encontrada.");
  }

  const object = await requireOriginals(env).get(image.originalKey);
  if (!object) {
    throw new AppError(404, "IMAGE_NOT_FOUND", "Imagem não encontrada.");
  }

  const preset = IMAGE_PRESETS[presetName];
  const format = negotiateImageFormat(request.headers.get("accept"));
  const transform: ImageTransform = {
    width: preset.width,
    height: preset.height,
    fit: preset.fit,
    ...(preset.fit === "cover"
      ? { gravity: resolveGravity(image.focalX, image.focalY) }
      : {}),
  };

  let transformed: Response;
  try {
    const result = await env.IMAGES.input(object.body)
      .transform(transform)
      .output({ format, quality: preset.quality });
    transformed = result.response();
  } catch (error) {
    console.error(
      JSON.stringify({
        message: "Falha na transformação de imagem",
        imageId,
        preset: presetName,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
    throw new AppError(502, "IMAGE_TRANSFORM_FAILED", "A imagem não pôde ser processada.");
  }

  const headers = new Headers(transformed.headers);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("Content-Type", format);
  headers.set("Content-Disposition", "inline");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("ETag", `"${imageId}-${presetName}-v1"`);
  headers.delete("Set-Cookie");
  return new Response(transformed.body, {
    status: transformed.status,
    statusText: transformed.statusText,
    headers,
  });
}
