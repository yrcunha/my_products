import pg from "pg";
import CircuitBreaker from "opossum";

/**
 * Códigos de erro do PostgresSQL para violação de integridade e regras de negócio.
 *
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export const PG_ERROR_CODES = [
  "23505", // Violação de chave única
  "23503", // Violação de chave estrangeira
  "23502", // Violação de NOT NULL
  "23514", // Violação de CHECK constraint
  "23511", // Violação de EXCLUSION constraint
  "22003", // Violação de limite numérico
  "22012", // Divisão por zero
  "2201X", // Erros de data/hora
  "22008", // Formato de data/hora estão inválidos
  "22005", // Erro de conversão de tipo
  "23000", // Violação de integridade de dados
];

const CIRCUIT_BREAKER_OPTIONS = {
  volumeThreshold: Number(process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD),
  timeout: Number(process.env.CIRCUIT_BREAKER_TIMEOUT_FROM_DATABASE),
  errorThresholdPercentage: Number(process.env.CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FROM_DATABASE),
  resetTimeout: Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_FROM_DATABASE),
  errorFilter: (error: pg.DatabaseError) => !!(error?.code && PG_ERROR_CODES.includes(error.code)),
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
