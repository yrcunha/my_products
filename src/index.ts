import "express-async-errors";

import express from "express";
import { databaseCircuitBreaker } from "@/features/providers/database.js";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import { healthRouter } from "@/api/v1/health.router";
import { errorHandler, loggingHandler, methodNotAllowed } from "@/api/interceptors/handlers";
import logger from "@/shared/logger/logger";

(() => {
  const app = express();

  app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(
      rateLimit({
        windowMs: Number(process.env.RATE_LIMIT_TIMEOUT),
        limit: Number(process.env.MS_WINDOW_FOR_RATE_LIMIT),
        legacyHeaders: false,
      }),
    )
    .use(helmet())
    .use(loggingHandler)
    .use(healthRouter())
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
