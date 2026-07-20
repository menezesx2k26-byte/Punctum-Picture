import { z } from "zod";
import {
  adminSessionCookie,
  clearAdminSessionCookie,
  createAdminSession,
  verifyAdminPassword,
} from "../utils/auth";
import { envNumber, requireDb } from "../utils/env";
import { AppError } from "../utils/errors";
import { assertRateLimit } from "../utils/rate-limit";
import { json } from "../utils/response";
import { parseJson } from "../utils/validation";

const LOGIN_PATH = "/admin/api/session";

export async function handleAdminAuth(
  request: Request,
  url: URL,
  env: Env,
): Promise<Response | null> {
  if (url.pathname !== LOGIN_PATH) return null;

  if (request.method === "DELETE") {
    return json(
      { ok: true },
      {
        admin: true,
        headers: { "Set-Cookie": clearAdminSessionCookie() },
      },
    );
  }

  if (request.method !== "POST") {
    throw new AppError(405, "METHOD_NOT_ALLOWED", "Método não permitido.");
  }

  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;
  if (!origin || origin !== expectedOrigin) {
    throw new AppError(403, "INVALID_ORIGIN", "A origem desta operação não é permitida.");
  }

  await assertRateLimit(
    request,
    requireDb(env),
    "admin-login",
    envNumber(env, "ADMIN_LOGIN_RATE_LIMIT_MAX", 10),
    envNumber(env, "ADMIN_LOGIN_RATE_LIMIT_WINDOW_SECONDS", 900),
  );

  const input = await parseJson(
    request,
    z.object({ email: z.string().email(), password: z.string().min(1).max(256) }).strict(),
  );
  if (!(await verifyAdminPassword(input.password, env))) {
    throw new AppError(401, "ADMIN_LOGIN_FAILED", "E-mail ou senha incorretos.");
  }

  const token = await createAdminSession(input.email, env);
  return json(
    { ok: true },
    {
      admin: true,
      headers: { "Set-Cookie": adminSessionCookie(token) },
    },
  );
}
