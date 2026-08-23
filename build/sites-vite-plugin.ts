import { access, copyFile, cp, mkdir, readdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

const SITES_CANONICAL_MIGRATION_START = 5;

function isSitesCanonicalMigration(filename: string): boolean {
  const match = /^(\d+)_.*\.sql$/.exec(filename);
  return Boolean(match && Number(match[1]) >= SITES_CANONICAL_MIGRATION_START);
}

// The deployed D1 database was created by the legacy Sites/Drizzle history.
// Keep that immutable baseline in the artifact so Sites recognizes migrations
// already applied, then append new files from the canonical Wrangler track.
export function sites(): Plugin {
  let root = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");
      const hostingConfig = resolve(root, ".openai", "hosting.json");
      const sitesMigrationBaseline = resolve(root, "drizzle");
      const migrationsSource = resolve(root, "migrations");
      const migrationsOutput = resolve(outputDirectory, "drizzle");

      await rm(outputDirectory, { recursive: true, force: true });
      await mkdir(outputDirectory, { recursive: true });

      if (await exists(hostingConfig)) {
        await cp(hostingConfig, resolve(outputDirectory, "hosting.json"));
      }
      if (await exists(sitesMigrationBaseline)) {
        await cp(sitesMigrationBaseline, migrationsOutput, {
          recursive: true,
        });
      }
      if (await exists(migrationsSource)) {
        await mkdir(migrationsOutput, { recursive: true });
        const migrationFiles = await readdir(migrationsSource);
        await Promise.all(
          migrationFiles.filter(isSitesCanonicalMigration).map((filename) =>
            copyFile(
              resolve(migrationsSource, filename),
              resolve(migrationsOutput, filename),
            ),
          ),
        );
      }
    },
  };
}
