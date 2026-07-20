import { AppError } from "./errors";

async function digest(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function assertRateLimit(
  request: Request,
  db: D1Database,
  scope: string,
  max: number,
  windowSeconds: number,
): Promise<void> {
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const now = new Date();
  const expires = new Date(now.getTime() + windowSeconds * 1000);
  const bucketKey = await digest(`${scope}:${ip}`);

  const current = await db
    .prepare(
      "SELECT request_count AS requestCount, expires_at AS expiresAt FROM rate_limit_buckets WHERE bucket_key = ?",
    )
    .bind(bucketKey)
    .first<{ requestCount: number; expiresAt: string }>();

  if (!current || new Date(current.expiresAt) <= now) {
    await db
      .prepare(
        `INSERT INTO rate_limit_buckets (bucket_key, request_count, window_started_at, expires_at)
         VALUES (?, 1, ?, ?)
         ON CONFLICT(bucket_key) DO UPDATE SET
           request_count = 1,
           window_started_at = excluded.window_started_at,
           expires_at = excluded.expires_at`,
      )
      .bind(bucketKey, now.toISOString(), expires.toISOString())
      .run();
    return;
  }

  if (current.requestCount >= max) {
    throw new AppError(429, "RATE_LIMITED", "Muitas tentativas. Aguarde um pouco e tente novamente.");
  }

  await db
    .prepare("UPDATE rate_limit_buckets SET request_count = request_count + 1 WHERE bucket_key = ?")
    .bind(bucketKey)
    .run();
}
