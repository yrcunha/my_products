import { request, requestCircuitBreaker, RequestOptions } from "../../../src/features/providers/request";
import { randomUUID } from "node:crypto";
import data from "../../../__infrastructure__/provisioning/development/product-server.json";

describe("Circuit breaker for request", () => {
  const invalidRequest: [string, RequestOptions] = [
    `${process.env.PRODUCT_API_BASE_URL}/${randomUUID()}`,
    { method: "GET" },
  ];
  const attempts = Number(process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD_FOR_CALLING);

  test("Circuit breaker closed when it did not reach the volume threshold", async () => {
    await Promise.allSettled(Array.from({ length: attempts - 1 }).map(() => request(...invalidRequest)));
    expect(requestCircuitBreaker.closed).toBeTruthy();
  });

  test("Circuit breaker closed when reaching volume threshold and error threshold percentage", async () => {
    await Promise.allSettled([request(...invalidRequest)]);
    const errorThresholdPercentage = Number(process.env.CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FOR_CALLING);
    const failureThreshold = Math.ceil((errorThresholdPercentage / 100) * attempts);
    expect(requestCircuitBreaker.opened).toBeTruthy();
    expect(requestCircuitBreaker.stats.failures).toBeGreaterThan(failureThreshold);
  });

  test("Circuit breaker half open after waiting for reset timeout", async () => {
    const resetTimeout = Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_FOR_CALLING);
    await new Promise((resolve) => setTimeout(resolve, resetTimeout));
    expect(requestCircuitBreaker.halfOpen).toBeTruthy();
  });

  test("Circuit breaker closed after establishing success in calls", async () => {
    const validRequest: [string, RequestOptions] = [
      `${process.env.PRODUCT_API_BASE_URL}/${data.product[0].id}`,
      { method: "GET" },
    ];
    await request(...validRequest);
    expect(requestCircuitBreaker.closed).toBeTruthy();
  });
});
