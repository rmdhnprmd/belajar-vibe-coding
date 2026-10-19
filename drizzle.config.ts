import { defineConfig } from "drizzle-kit";
import { loadEnv, getDatabaseConfig, buildDatabaseUrl } from "./src/config/env";

// Muat .env agar drizzle-kit memakai konfigurasi yang sama dengan aplikasi.
loadEnv();

const config = getDatabaseConfig();

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: buildDatabaseUrl(config),
  },
  verbose: true,
  strict: true,
});
