import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users } from "../db/schema";

export type RegisterResult =
  | { success: true }
  | { success: false; reason: "email_duplicate" };

/**
 * Registrasi user baru.
 *
 * - Normalisasi name (trim) dan email (trim + toLowerCase).
 * - Cek duplikat email sebelum insert.
 * - Hash password dengan bcrypt cost 10.
 * - Tangkap ER_DUP_ENTRY untuk race condition.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResult> {
  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  // Cek apakah email sudah terdaftar.
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

  if (existing) {
    return { success: false, reason: "email_duplicate" };
  }

  // Hash password — cost 10.
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      name: normalizedName,
      email: normalizedEmail,
      password: hashedPassword,
    });
  } catch (err: unknown) {
    // Race condition: email di-insert oleh request lain antara SELECT dan INSERT.
    if (
      err !== null &&
      typeof err === "object" &&
      "code" in err &&
      (err as { code: string }).code === "ER_DUP_ENTRY"
    ) {
      return { success: false, reason: "email_duplicate" };
    }
    throw err;
  }

  return { success: true };
}
