declare namespace NodeJS {
  interface ProcessEnv {
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    DATABASE_URL: string;
    RATE_LIMIT_TIMEOUT: string;
    MS_WINDOW_FOR_RATE_LIMIT: string;
    CIRCUIT_BREAKER_VOLUME_THRESHOLD_FROM_DATABASE: string;
    CIRCUIT_BREAKER_TIMEOUT_FROM_DATABASE: string;
    CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FROM_DATABASE: string;
    CIRCUIT_BREAKER_RESET_TIMEOUT_FROM_DATABASE: string;
    CIRCUIT_BREAKER_VOLUME_THRESHOLD_FOR_CALLING: string;
    CIRCUIT_BREAKER_TIMEOUT_FOR_CALLING: string;
    CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FOR_CALLING: string;
    CIRCUIT_BREAKER_RESET_TIMEOUT_FOR_CALLING: string;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    PRODUCT_API_BASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
    JWT_REFRESH_SECRET: string;
    JWT_EXPIRATION_TO_REFRESH: string;
  }
}

declare namespace Express {
  interface Request {
    user: string;
    token: string;
  }
}
