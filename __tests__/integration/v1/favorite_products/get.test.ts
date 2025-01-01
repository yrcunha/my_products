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

describe("GET /api/v1/clients/{id}/favorite_products/{product_id}", () => {
  describe("Anonymous user", () => {
    describe("Retrieving product", () => {
      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products/${productId}`);
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        const { reviewScore: _, ...expected } = {
          ...data.product[0],
          review_score: data.product[0].reviewScore,
        };
        expect(responseJson).toEqual(expected);
      });

      test("For the second time with a non-existent client", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${randomUUID()}/favorite_products/${productId}`);
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("For the third time, retrieve a favorite product list", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products`);
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        expect(Array.isArray(responseJson.data)).toBeTruthy();
        const { reviewScore: _, ...expected } = {
          ...data.product[0],
          review_score: data.product[0].reviewScore,
        };
        expect(responseJson).toEqual({
          page: 1,
          limit: 10,
          total: 1,
          data: [expected],
        });
      });
    });
  });
});
