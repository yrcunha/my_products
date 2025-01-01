import {
  BaseUrl,
  clearTableInDatabase,
  insertClientForTesting,
  insertProductForTesting,
  insertProductReviewForTesting,
  waitForAllServices,
} from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import data from "../../../../__infrastructure__/provisioning/development/product-server.json";
import { faker } from "@faker-js/faker";

const productId = data.product[0].id;
let clientId: string;
const review = {
  message: faker.internet.emoji(),
  score: faker.number.int({ min: 1, max: 5 }),
  reviewer: faker.person.fullName(),
};

beforeAll(async () => {
  await waitForAllServices();
  await Promise.all([
    clearTableInDatabase("clients"),
    clearTableInDatabase("products"),
    clearTableInDatabase("favorite_products"),
    clearTableInDatabase("products_review"),
  ]);
  clientId = (await insertClientForTesting()).id;
  await insertProductForTesting(clientId, data.product[0]);
  await insertProductReviewForTesting(productId, review);
});

describe("GET /api/v1/products/{id}/reviews", () => {
  describe("Anonymous user", () => {
    test("Retrieving product reviews", async () => {
      const response = await fetch(`${BaseUrl}/v1/products/${productId}/reviews`);
      expect(response.status).toBe(HttpCodes.OK);
      const responseJson = await response.json();
      expect(Array.isArray(responseJson.data)).toBeTruthy();
      expect(responseJson).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        data: [review],
      });
    });
  });
});
