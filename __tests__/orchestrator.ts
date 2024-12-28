import retry from "async-retry";

export const BaseUrl = "http://localhost:3000/api";

export function waitForAllServices() {
  return retry(
    async () => {
      const response = await fetch(`${BaseUrl}/v1/health`);
      if (response.ok) return;
      throw new Error();
    },
    { retries: 100, maxTimeout: 1000 },
  );
}
