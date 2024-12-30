import { z } from "zod";
import logger from "@/shared/logger/logger";
import { mapZodErrorDetails } from "@/shared/utils/map-zod-error-details";

const isPositiveInteger = (value: string) => {
  const coercedValue = Number(value);
  return Number.isSafeInteger(coercedValue) && coercedValue > 0;
};

export const ConfigModel = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string().refine(isPositiveInteger),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  DATABASE_URL: z.string().url(),
  RATE_LIMIT_TIMEOUT: z.string().refine(isPositiveInteger),
  MS_WINDOW_FOR_RATE_LIMIT: z.string().refine(isPositiveInteger),
  CIRCUIT_BREAKER_VOLUME_THRESHOLD: z.string().refine(isPositiveInteger),
  CIRCUIT_BREAKER_TIMEOUT_FROM_DATABASE: z.string().refine(isPositiveInteger),
  CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FROM_DATABASE: z.string().refine(isPositiveInteger),
  CIRCUIT_BREAKER_RESET_TIMEOUT_FROM_DATABASE: z.string().refine(isPositiveInteger),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]),
});

export function loadEnv(env: NodeJS.ProcessEnv) {
  const model = ConfigModel.safeParse(env);
  if (!model.success) {
    logger.fatal(mapZodErrorDetails(model.error.issues), "Error validating environment.");
    process.exit(1);
  }
  process.env = model.data;
}