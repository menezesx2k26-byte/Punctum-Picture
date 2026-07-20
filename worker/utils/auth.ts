import { createRemoteJWKSet, jwtVerify } from "jose";
import { AppError } from "./errors";
import { envString, requiredEnvString } from "./env";

export type AdminIdentity = {
  email: string;
  roles: ["admin"];
};

export function normalizeTeamDomain(value: string): string {
  const withoutProtocol = value.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return withoutProtocol.includes(".")
    ? withoutProtocol
    : `${withoutProtocol}.cloudflareaccess.com`;
}

function isLocalRequest(request: Request, env: Env): boolean {
  const hostname = new URL(request.url).hostname;
  return (
    (hostname === "localhost" || hostname === "127.0.0.1") &&
    envString(env, "ENVIRONMENT") === "local"
  );
}

export async function requireAdmin(request: Request, env: Env): Promise<AdminIdentity> {
  if (isLocalRequest(request, env)) {
    return { email: "maria.helena@local.dev", roles: ["admin"] };
  }

  const assertion = request.headers.get("cf-access-jwt-assertion");
  if (!assertion) {
    throw new AppError(403, "ADMIN_UNAUTHORIZED", "Acesso administrativo não autorizado.");
  }

  const teamDomain = normalizeTeamDomain(requiredEnvString(env, "CLOUDFLARE_TEAM_DOMAIN"));
  const audience = requiredEnvString(env, "CLOUDFLARE_ACCESS_AUD");
  const issuer = `https://${teamDomain}`;
  const jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));

  try {
    const { payload } = await jwtVerify(assertion, jwks, {
      issuer,
      audience,
      algorithms: ["RS256"],
    });
    const email = typeof payload.email === "string" ? payload.email : null;
    if (!email) {
      throw new Error("JWT sem e-mail");
    }
    return { email, roles: ["admin"] };
  } catch {
    throw new AppError(403, "ADMIN_UNAUTHORIZED", "Acesso administrativo não autorizado.");
  }
}

export function assertAllowedOrigin(request: Request, env: Env): void {
  if (!["POST", "PATCH", "PUT", "DELETE"].includes(request.method)) {
    return;
  }
  const origin = request.headers.get("origin");
  const expected = envString(env, "SITE_ORIGIN");
  if (!origin || !expected || origin !== expected) {
    throw new AppError(403, "INVALID_ORIGIN", "A origem desta operação não é permitida.");
  }
}
