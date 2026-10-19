import { count, desc, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { users, type NewUser } from "../../db/schema";

export type UserUpdate = Partial<Pick<NewUser, "name" | "email">>;

export async function listUsers(limit: number, offset: number) {
  const [rows, [totalRow]] = await Promise.all([
    db.select().from(users).orderBy(desc(users.id)).limit(limit).offset(offset),
    db.select({ total: count() }).from(users),
  ]);
  return { rows, total: Number(totalRow?.total ?? 0) };
}

export async function findUserById(id: number) {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row ?? null;
}

export async function findUserByEmail(email: string) {
  const [row] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return row ?? null;
}

export async function createUser(input: NewUser) {
  const [result] = await db.insert(users).values(input).$returningId();
  return result?.id ? findUserById(result.id) : null;
}

export async function updateUser(id: number, patch: UserUpdate) {
  if (Object.keys(patch).length === 0) return findUserById(id);
  await db.update(users).set(patch).where(eq(users.id, id));
  return findUserById(id);
}

export async function deleteUser(id: number) {
  const [result] = await db.delete(users).where(eq(users.id, id));
  return result.affectedRows > 0;
}


