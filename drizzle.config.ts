import { defineConfig } from "drizzle-kit";
import { loadEnv, getDatabaseConfig, buildDatabaseUrl } from "./src/config/env";

// Muat .env agar drizzle-kit memakai konfigurasi yang sama dengan aplikasi.
loadEnv();

/**
 * Kredensial hanya dibutuhkan perintah yang menyentuh database
 * (migrate, push, pull, studio). `generate` berjalan offline, jadi getter
 * ini di-evaluasi lazy agar `generate` tidak gagal saat .env belum diisi.
 */
const dbCredentials = {
  get url(): string {
    return buildDatabaseUrl(getDatabaseConfig());
  },
} as { url: string };

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials,

  // Tabel pelacak migrasi yang sudah dijalankan.
  migrations: {
    table: "__drizzle_migrations",
  },
  // Tampilkan SQL saat generate — memudahkan review perubahan schema.
  verbose: true,
  // Minta konfirmasi sebelum statement destruktif (drop/alter) dijalankan.
  strict: true,
});

