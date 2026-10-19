import { Elysia, t } from "elysia";
import { registerUser } from "../services/users-service";

/**
 * Regex validasi format email yang wajar (mendukung domain bertitik maupun single-label seperti localhost).
 */
const EMAIL_REGEX = /^[^\s@]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const usersRoute = new Elysia({ prefix: "/api" })
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      let msg = "body tidak valid";
      try {
        const parsed = JSON.parse(error.message);
        msg = parsed.summary || parsed.message || msg;
      } catch {
        msg = error.message || msg;
      }
      return { error: msg };
    }
  })
  .post(
  "/users",
  async ({ body, set }) => {
    const { name, email, password } = body;

    // --- Validasi manual di luar schema Elysia ---
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      set.status = 400;
      return { error: "name tidak boleh kosong" };
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      set.status = 400;
      return { error: "format email tidak valid" };
    }

    if (password.length < 8) {
      set.status = 400;
      return { error: "password minimal 8 karakter" };
    }

    // --- Panggil service ---
    try {
      const result = await registerUser(name, email, password);

      if (!result.success) {
        set.status = 409;
        return { error: "email sudah terdaftar" };
      }

      set.status = 201;
      return { data: "Ok" };
    } catch {
      set.status = 500;
      return { error: "terjadi kesalahan pada server" };
    }
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
    }),
    // Elysia akan mengembalikan 400 secara otomatis jika body tidak sesuai schema.
  },
);
