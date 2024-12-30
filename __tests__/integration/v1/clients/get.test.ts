import { BaseUrl, clearTableInDatabase, insertClientForTesting, waitForAllServices } from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import { randomUUID } from "node:crypto";

let client: Record<string, unknown>;

beforeAll(async () => {
  await waitForAllServices();
  await clearTableInDatabase("clients");
  client = await insertClientForTesting();
});

describe("POST /api/v1/clients", () => {
  describe("Anonymous user", () => {
    describe("Retrieving client", () => {
      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${client.id}`);
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        expect(responseJson).toEqual(client);
      });

      test("For the second time with a non-existent client", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${randomUUID()}`);
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("For the third time, retrieve a client list", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients`);
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        expect(Array.isArray(responseJson.data)).toBeTruthy();
        expect(responseJson).toEqual({
          page: 1,
          limit: 10,
          total: 1,
          data: [client],
        });
      });
    });
  });
});
