import { databaseCircuitBreaker, query } from "../../../src/features/providers/database";
import { delay } from "../../orchestrator";

describe("Circuit breaker for database", () => {
  const invalidCommand = "SELECT * FROM non_existing_table";
  const attempts = Number(process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD_FROM_DATABASE);

  test("Circuit breaker closed when it did not reach the volume threshold", async () => {
    await Promise.allSettled(Array.from({ length: attempts - 1 }).map(() => query(invalidCommand)));
    expect(databaseCircuitBreaker.closed).toBeTruthy();
  });

  test("Circuit breaker closed when reaching volume threshold and error threshold percentage", async () => {
    await Promise.allSettled([query(invalidCommand)]);
    const errorThresholdPercentage = Number(process.env.CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FROM_DATABASE);
    const failureThreshold = Math.ceil((errorThresholdPercentage / 100) * attempts);
    expect(databaseCircuitBreaker.opened).toBeTruthy();
    expect(databaseCircuitBreaker.stats.failures).toBeGreaterThan(failureThreshold);
  });

  test("Circuit breaker half open after waiting for reset timeout", async () => {
    const resetTimeout = Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_FROM_DATABASE);
    await delay(resetTimeout);
    expect(databaseCircuitBreaker.halfOpen).toBeTruthy();
  });

  test("Circuit breaker closed after establishing success in calls", async () => {
    const validCommand = "SELECT 1";
    await query(validCommand);
    expect(databaseCircuitBreaker.closed).toBeTruthy();
  });
});
