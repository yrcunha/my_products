import { BaseUrl, clearTableInDatabase, insertClientForTesting, waitForAllServices } from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import { randomUUID } from "node:crypto";

let clientId: string;

beforeAll(async () => {
  await waitForAllServices();
  await clearTableInDatabase("clients");
  clientId = (await insertClientForTesting()).id;
});

describe("DELETE /api/v1/clients/{id}", () => {
  describe("Anonymous user", () => {
    describe("Deleting client", () => {
      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}`, { method: "DELETE" });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the second time with a non-existent client", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${randomUUID()}`, { method: "DELETE" });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });
    });
  });
});
