import "express-async-errors";

import express, { NextFunction, Request, Response } from "express";
import { query } from "@/features/services/datasource/database.js";
import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";
import { HttpCodes, MapErrors } from "@/shared/http/http";
import { MethodNotAllowedError } from "@/shared/errors/method-not-allowed.error";

const app = express();

app.get("/api/v1/health", async (_req: Request, res: Response) => {
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
});

app.all("*", (req: Request, res: Response) => {
  res
    .status(MapErrors[ErrorCodes.MethodNotAllowed])
    .json(new MethodNotAllowedError(`${req.method} method to path -- ${req.url} -- is not allowed!`));
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  const response = CustomError.instanceMount(error);
  res.status(MapErrors[response.name]).json(response);
});

app.listen(3000);
console.log("Listening on port 3000");
