import { BaseUrl, clearTableInDatabase, insertClientForTesting, waitForAllServices } from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import data from "../../../../__infrastructure__/provisioning/development/product-server.json";
import { randomUUID } from "node:crypto";

let clientId: string;

beforeAll(async () => {
  await waitForAllServices();
  await Promise.all([
    clearTableInDatabase("clients"),
    clearTableInDatabase("products"),
    clearTableInDatabase("favorite_products"),
  ]);
  clientId = (await insertClientForTesting()).id;
});

describe("POST /api/v1/clients/{id}/favorite_products", () => {
  describe("Anonymous user", () => {
    describe("Add product in list", () => {
      const payload = { product_id: data.product[0].id };

      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the second time with a non-existent client", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${randomUUID()}/favorite_products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("There is already a list for the fourth product", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.Conflict);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceAlreadyExists);
      });
    });
  });
});
