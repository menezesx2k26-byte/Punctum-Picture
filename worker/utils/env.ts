import { AppError } from "./errors";

export function envString(env: Env, name: string): string | undefined {
  const value = Reflect.get(env, name);
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

export function requiredEnvString(env: Env, name: string): string {
  const value = envString(env, name);
  if (!value) {
    throw new AppError(
      503,
      "SERVICE_NOT_CONFIGURED",
      `A configuração ${name} ainda não foi concluída.`,
    );
  }
  return value;
}

export function envNumber(env: Env, name: string, fallback: number): number {
  const parsed = Number(envString(env, name));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function requireDb(env: Env): D1Database {
  if (!env.DB) {
    throw new AppError(503, "DATABASE_UNAVAILABLE", "O banco de dados está indisponível.");
  }
  return env.DB;
}

export function requireOriginals(env: Env): R2Bucket {
  if (!env.ORIGINALS) {
    throw new AppError(503, "STORAGE_UNAVAILABLE", "O armazenamento de imagens está indisponível.");
  }
  return env.ORIGINALS;
}
