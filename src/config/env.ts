import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ENV_FILE = fileURLToPath(new URL('../../.env', import.meta.url));

export function loadEnv(): void {
  if (existsSync(ENV_FILE)) process.loadEnvFile(ENV_FILE);
}

loadEnv();

export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} wajib diisi. Lihat .env.example.`);
  }
  return value;
}

export function getDatabaseConfig(): DatabaseConfig {
  return {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: required("DB_USER"),
    password: process.env.DB_PASSWORD ?? "",
    database: required("DB_NAME"),
  };
}

export function buildDatabaseUrl(config: DatabaseConfig): string {
  const password = config.password ? `:${encodeURIComponent(config.password)}` : "";
  const { host, port, user, database } = config;
  return `mysql://${user}${password}@${host}:${port}/${database}`;
}

export const PORT = Number(process.env.PORT ?? 3000);
export const APP_NAME = "vibe-coding";
export const APP_VERSION = "1.0.0";


