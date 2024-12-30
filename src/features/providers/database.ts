import pg from "pg";
import CircuitBreaker from "opossum";
import { DatabaseServiceError } from "@/shared/errors/database-service.error";
import { CustomError, ErrorCodes } from "@/shared/errors/custom-errors";

export const SingleKeyViolationCode = "23505";

/**
 * Códigos de erro do PostgresSQL para violação de integridade e regras de negócio.
 *
 * @see https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export const PG_ERROR_CODES = [
  SingleKeyViolationCode,
  "23503", // Violação de chave estrangeira
  "23502", // Violação de NOT NULL
  "23514", // Violação de CHECK constraint
  "23511", // Violação de EXCLUSION constraint
  "22003", // Violação de limite numérico
  "22012", // Divisão por zero
  "2201X", // Erros de data/hora
  "22008", // Formato de data/hora estão inválidos
  "22005", // Erro de conversão de tipo
  "2202E", // Índice de array inválido.
  "23000", // Violação de integridade de dados
  "2200G", // Tipos não são compatíveis.
  "42601", // Erro de sintaxe.
  "42703", // Coluna inexistente
  "42P01", // Tabela não existe.
  "42704", // Objeto (geral) não existe.
  "42883", // Função não existe.
  "42P02", // Parâmetro ambíguo.
  "42702", // Coluna ambígua.
];

const CIRCUIT_BREAKER_OPTIONS = {
  volumeThreshold: Number(process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD),
  timeout: Number(process.env.CIRCUIT_BREAKER_TIMEOUT_FROM_DATABASE),
  errorThresholdPercentage: Number(process.env.CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FROM_DATABASE),
  resetTimeout: Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_FROM_DATABASE),
  errorFilter: (error: Error) => error instanceof CustomError && error.name === ErrorCodes.Unknown,
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

export const databaseCircuitBreaker = new CircuitBreaker(async function (command: string, params: unknown[] = []) {
  let client: pg.Client | null = null;
  try {
    client = await getClient();
    return await client.query(command, params);
  } catch (error) {
    if (error instanceof pg.DatabaseError && error.code) {
      throw new DatabaseServiceError(error.message, {
        code: error.code,
        detail: error.detail,
        constraint: error.constraint,
      });
    }
    throw error;
  } finally {
    await client?.end();
  }
}, CIRCUIT_BREAKER_OPTIONS);

export async function query(command: string, params: unknown[] = []) {
  return await databaseCircuitBreaker.fire(command, params);
}
