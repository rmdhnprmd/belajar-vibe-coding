# vibe-coding

Project API dengan stack **Bun + ElysiaJS + Drizzle ORM + MySQL**.

## Status

Sedang dalam pengembangan. Lihat branch `feat/bun-elysia-drizzle-mysql` untuk implementasi awal
(issue [#2](https://github.com/rmdhnprmd/belajar-vibe-coding/issues/2)).

## Prasyarat

- [Bun](https://bun.sh) versi terbaru
- MySQL yang sedang berjalan

## Menjalankan

```bash
cp .env.example .env   # lalu sesuaikan kredensial MySQL
bun install
bun run db:migrate     # jalankan migrasi database
bun run dev
```

## Endpoint

### Health Check

```bash
curl http://localhost:3000/health
```

### Registrasi User

**Request:**

```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Rama","email":"email@localhost","password":"rahasia123"}'
```

**Response sukses** — `201 Created`:

```json
{ "data": "Ok" }
```

**Response email duplikat** — `409 Conflict`:

```bash
# Kirim request yang sama sekali lagi
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Rama","email":"email@localhost","password":"rahasia123"}'
```

```json
{ "error": "email sudah terdaftar" }
```

**Response body tidak valid** — `400 Bad Request`:

```bash
curl -i -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Rama","email":"rama@localhost","password":"123"}'
```

```json
{ "error": "password minimal 8 karakter" }
```

### Status Code

| Kasus | Status | Body |
|---|---|---|
| Registrasi berhasil | `201` | `{ "data": "Ok" }` |
| Email sudah terdaftar | `409` | `{ "error": "email sudah terdaftar" }` |
| Body tidak valid | `400` | `{ "error": "<pesan spesifik>" }` |
| Error server | `500` | `{ "error": "terjadi kesalahan pada server" }` |
