import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "prisma/config";

// prisma.config.ts skips automatic .env loading — load manually
loadEnv({ path: ".env" });
loadEnv({ path: ".env.local", override: true });

/**
 * Prisma config (replaces deprecated package.json#prisma).
 */
export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
