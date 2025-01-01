import {
  BaseUrl,
  clearTableInDatabase,
  insertClientForTesting,
  insertProductForTesting,
  waitForAllServices,
} from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { faker } from "@faker-js/faker";
import data from "../../../../__infrastructure__/provisioning/development/product-server.json";

const productId = data.product[0].id;
let clientId: string;

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
});

describe("POST /api/v1/products/{id}/reviews", () => {
  describe("Anonymous user", () => {
    describe("Add product review", () => {
      const payload = { message: faker.internet.emoji(), score: faker.number.int({ min: 1, max: 5 }) };

      test("For the first time, a product that is not registered has been successful", async () => {
        const response = await fetch(`${BaseUrl}/v1/products/${productId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the first time, a registered product has been successful", async () => {
        const response = await fetch(`${BaseUrl}/v1/products/${productId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });
    });
  });
});
