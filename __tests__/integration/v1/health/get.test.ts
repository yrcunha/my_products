import { BaseUrl, waitForAllServices } from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";

beforeAll(async () => await waitForAllServices());

describe("GET /api/v1/health", () => {
  describe("Anonymous user", () => {
    test("Retrieving current system health", async () => {
      const response = await fetch(`${BaseUrl}/v1/health`);
      expect(response.status).toBe(HttpCodes.OK);
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
