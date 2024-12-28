import express from "express";
import { query } from "@/features/services/datasource/database.js";

const app = express();

app.get("/api/v1/health", async (_req, res) => {
  const now = new Date().toISOString();
  const result = await query(
    "SELECT current_setting('max_connections')::int AS max_connections, current_setting('server_version') AS version, COUNT(*)::int AS opened_connections FROM pg_stat_activity WHERE datname = $1;",
    [process.env.POSTGRES_DB!],
  );
  res.status(200).json({
    updated_at: now,
    dependencies: {
      database: {
        max_connections: result?.rows[0].max_connections,
        opened_connections: result?.rows[0].opened_connections,
        version: result?.rows[0].version,
      },
    },
  });
});

app.listen(3000);
console.log("Listening on port 3000");
