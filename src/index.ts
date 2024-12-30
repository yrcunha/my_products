import "express-async-errors";

import express from "express";
import { databaseCircuitBreaker } from "@/features/providers/database.js";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { healthRouter } from "@/api/v1/health.router";
import { errorHandler, loggingHandler, methodNotAllowed } from "@/api/interceptors/handlers";
import { clientRouter } from "@/api/v1/client.router";
import { loadEnv } from "@/features/models/config";
import logger from "@/shared/logger/logger";

(() => {
  loadEnv(process.env);

  const app = express();

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(helmet())
    .use(
      rateLimit({
        windowMs: Number(process.env.RATE_LIMIT_TIMEOUT),
        limit: Number(process.env.MS_WINDOW_FOR_RATE_LIMIT),
        legacyHeaders: false,
      }),
    )
    .use(loggingHandler)
    .use(healthRouter())
    .use(clientRouter())
    .all("*", methodNotAllowed)
    .use(errorHandler);

  databaseCircuitBreaker
    .on("close", () => logger.info("The circuit breaker for the database is closed."))
    .on("open", () => logger.info("The circuit breaker for the database has been opened."))
    .on("halfOpen", (resetTimeout: number) =>
      logger.info(`The database circuit breaker was half opened after ${resetTimeout}ms elapsed`),
    );

  app.listen(3000, () => logger.info("Listening on port 3000"));
})();
