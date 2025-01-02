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
import { requestCircuitBreaker } from "@/features/providers/request";
import { favoritesListRouter } from "@/api/v1/favorites-list.router";
import { productReviewRouter } from "@/api/v1/product-review.router";
import { sessionRouter } from "@/api/v1/session.router";

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
    .use(favoritesListRouter())
    .use(productReviewRouter())
    .use(sessionRouter())
    .all("*", methodNotAllowed)
    .use(errorHandler);

  databaseCircuitBreaker
    .on("close", () => logger.info("The circuit breaker for the database is closed."))
    .on("open", () => logger.error("The circuit breaker for the database has been opened."))
    .on("halfOpen", (resetTimeout: number) =>
      logger.warn(`The database circuit breaker was half opened after ${resetTimeout}ms elapsed`),
    );

  requestCircuitBreaker
    .on("close", () => logger.info("The circuit breaker for the calling is closed."))
    .on("open", () => logger.error("The circuit breaker for the calling has been opened."))
    .on("halfOpen", (resetTimeout: number) =>
      logger.warn(`The calling circuit breaker was half opened after ${resetTimeout}ms elapsed`),
    );

  app.listen(3000, () => logger.info("Listening on port 3000"));
})();
