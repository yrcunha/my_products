import pg from "pg";
import CircuitBreaker from "opossum";

const CIRCUIT_BREAKER_OPTIONS = {
  allowWarmUp: process.env.CIRCUIT_BREAKER_ALLOW_WARM_UP_FROM_DATABASE === "true",
  timeout: Number(process.env.CIRCUIT_BREAKER_TIMEOUT_FROM_DATABASE),
  errorThresholdPercentage: Number(process.env.CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FROM_DATABASE),
  resetTimeout: Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_FROM_DATABASE),
} as const;

async function getClient() {
  const client = new pg.Client({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.NODE_ENV === "production",
  });
  await client.connect();
  return client;
}

export const databaseCircuitBreaker = new CircuitBreaker(async function (command: string, params: string[] = []) {
  let client: pg.Client | null = null;
  try {
    client = await getClient();
    return await client.query(command, params);
  } finally {
    await client?.end();
  }
}, CIRCUIT_BREAKER_OPTIONS);

export async function query(command: string, params: string[] = []) {
  return await databaseCircuitBreaker.fire(command, params);
}
