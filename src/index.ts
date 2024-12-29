import "express-async-errors";

import express from "express";
import { databaseCircuitBreaker } from "@/features/providers/database.js";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { healthRouter } from "@/api/v1/health.router";
import { errorHandler, methodNotAllowed } from "@/features/services/handlers";

(() => {
  const app = express();

  app
    .use(
      rateLimit({
        windowMs: Number(process.env.RATE_LIMIT_TIMEOUT),
        limit: Number(process.env.MS_WINDOW_FOR_RATE_LIMIT),
        legacyHeaders: false,
      }),
    )
    .use(helmet())
    .use(healthRouter())
    .all("*", methodNotAllowed)
    .use(errorHandler);

  databaseCircuitBreaker
    .on("close", () => console.log("The circuit breaker for the database is closed."))
    .on("open", () => console.log("The circuit breaker for the database has been opened."))
    .on("halfOpen", (resetTimeout: number) =>
      console.log(`The database circuit breaker was half opened after ${resetTimeout}ms elapsed`),
    );

  app.listen(3000, () => console.log("Listening on port 3000"));
})();
