import logger from "@/shared/logger/logger";
import retry from "async-retry";
import { CallUnavailableError } from "@/shared/errors/call-unavailable.error";
import CircuitBreaker from "opossum";

const headersOptions: HeadersInit = {
  "content-type": "application/json",
};

export type Method = "GET" | "POST" | "PUT" | "DELETE";

export type RequestOptions = Exclude<RequestInit, "method"> & { method: Method };

const CIRCUIT_BREAKER_OPTIONS = {
  volumeThreshold: Number(process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD_FOR_CALLING),
  timeout: Number(process.env.CIRCUIT_BREAKER_TIMEOUT_FOR_CALLING),
  errorThresholdPercentage: Number(process.env.CIRCUIT_BREAKER_THRESHOLD_PERCENTAGE_FOR_CALLING),
  resetTimeout: Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_FOR_CALLING),
} as const;

export const requestCircuitBreaker = new CircuitBreaker(async function (
  url: string | URL,
  { headers = headersOptions, ...options }: RequestOptions,
) {
  return retry(
    async () => {
      const result = await fetch(url, { headers, ...options });

      const data = await result.json();
      if (result.status >= 500) throw new CallUnavailableError(url.toString(), options.method, result.status, data);
      if (!result.ok) logger.warn(data, `Call made to url ${url} had error with status ${result.status}.`);

      return { success: result.ok, statusCode: result.status, data };
    },
    { retries: 3, maxTimeout: 1000 },
  );
}, CIRCUIT_BREAKER_OPTIONS);

export async function request(url: string | URL, options: RequestOptions) {
  return requestCircuitBreaker.fire(url, options);
}
