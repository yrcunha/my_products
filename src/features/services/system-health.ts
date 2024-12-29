import { query } from "@/features/providers/database";
import { HttpCodes } from "@/shared/http/http";
import { Request, Response } from "express";

export async function systemHealth(_req: Request, res: Response) {
  const now = new Date().toISOString();
  const result = await query(
    "SELECT current_setting('max_connections')::int AS max_connections, current_setting('server_version') AS version, COUNT(*)::int AS opened_connections FROM pg_stat_activity WHERE datname = $1;",
    [process.env.POSTGRES_DB!],
  );
  res.status(HttpCodes.OK).json({
    updated_at: now,
    dependencies: {
      database: {
        max_connections: result?.rows[0].max_connections,
        opened_connections: result?.rows[0].opened_connections,
        version: result?.rows[0].version,
      },
    },
  });
}
