import {
  BaseUrl,
  clearTableInDatabase,
  insertClientForTesting,
  insertProductForTesting,
  waitForAllServices,
} from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import { randomUUID } from "node:crypto";
import data from "../../../../__infrastructure__/provisioning/development/product-server.json";

const productId = data.product[0].id;
let clientId: string;

beforeAll(async () => {
  await waitForAllServices();
  await Promise.all([
    clearTableInDatabase("clients"),
    clearTableInDatabase("products"),
    clearTableInDatabase("favorite_products"),
  ]);
  clientId = (await insertClientForTesting()).id;
  await insertProductForTesting(clientId, data.product[0]);
});

describe("DELETE /api/v1/clients/{id}/favorite_products/{product_id}", () => {
  describe("Anonymous user", () => {
    describe("Deleting product", () => {
      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products/${productId}`, {
          method: "DELETE",
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the second time with a non-existent client", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${randomUUID()}/favorite_products/${productId}`, {
          method: "DELETE",
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("For the third time with a non-existent product", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products/${randomUUID()}`, {
          method: "DELETE",
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });
    });
  });
});
