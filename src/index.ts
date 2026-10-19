import { Elysia } from "elysia";
import { PORT } from "./config/env";
import { pingDatabase } from "./db/client";
import { usersRoute } from "./routes/users-route";

const app = new Elysia()
  .use(usersRoute)
  .get("/health", async () => {
    const dbHealthy = await pingDatabase();
    return {
      status: dbHealthy ? "ok" : "degraded",
      db: dbHealthy ? "connected" : "disconnected",
    };
  })
  .listen(PORT);

console.log(`🚀 Server berjalan di http://localhost:${app.server?.port}`);
