import { BaseUrl, waitForAllServices } from "../../../orchestrator";

beforeAll(async () => await waitForAllServices());

describe("GET /api/v1/health", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system health", async () => {
      const response = await fetch(`${BaseUrl}/v1/health`);
      expect(response.status).toBe(200);
      const responseJson = await response.json();
      expect(responseJson).toEqual({
        updated_at: new Date(responseJson.updated_at).toISOString(),
        dependencies: {
          database: {
            max_connections: 100,
            opened_connections: 1,
            version: "17.2",
          },
        },
      });
    });
  });
});
