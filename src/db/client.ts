import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { buildDatabaseUrl, getDatabaseConfig } from "../config/env";
import * as schema from "./schema";

/**
 * Pool koneksi tunggal yang dipakai seluruh aplikasi.
 * `connectionLimit` kecil sudah cukup untuk development.
 */
export const pool = mysql.createPool({
  uri: buildDatabaseUrl(getDatabaseConfig()),
  connectionLimit: 5,
  waitForConnections: true,
});

export const db = drizzle(pool, { schema, mode: "default" });

/** Cek koneksi ke database. Dipakai oleh endpoint /health. */
export async function pingDatabase(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}
