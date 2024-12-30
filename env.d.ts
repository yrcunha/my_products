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
    CIRCUIT_BREAKER_VOLUME_THRESHOLD: string;
    CIRCUIT_BREAKER_TIMEOUT_FROM_DATABASE: string;
    CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FROM_DATABASE: string;
    CIRCUIT_BREAKER_RESET_TIMEOUT_FROM_DATABASE: string;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
  }
}
