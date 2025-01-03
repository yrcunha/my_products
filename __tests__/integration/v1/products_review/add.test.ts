import {
  AdminUser,
  BaseUrl,
  clearTableInDatabase,
  insertClientForTesting,
  insertProductForTesting,
  logIn,
  ProductId,
  waitForAllServices,
} from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { faker } from "@faker-js/faker";
import data from "../../../../__infrastructure__/provisioning/development/product-server.json";
import { TokenProps } from "../../../../src/features/models/user";

let token: TokenProps;
const headersOptions = (token: TokenProps["access_token"]) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
let clientId: string;

beforeAll(async () => {
  await waitForAllServices();
  await Promise.all([
    clearTableInDatabase("clients"),
    clearTableInDatabase("products"),
    clearTableInDatabase("favorite_products"),
    clearTableInDatabase("products_review"),
  ]);
  clientId = (await insertClientForTesting(AdminUser.id)).id;
  await insertProductForTesting(clientId, data.product[0]);
  token = await logIn(AdminUser);
});

describe("POST /api/v1/products/{id}/reviews", () => {
  describe("Authenticated user", () => {
    describe("Add product review", () => {
      const payload = { message: faker.internet.emoji(), score: faker.number.int({ min: 1, max: 5 }) };

      test("For the first time, a product that is not registered has been successful", async () => {
        const response = await fetch(`${BaseUrl}/v1/products/${ProductId}/reviews`, {
          method: "POST",
          headers: headersOptions(token.access_token),
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the first time, a registered product has been successful", async () => {
        const response = await fetch(`${BaseUrl}/v1/products/${ProductId}/reviews`, {
          method: "POST",
          headers: headersOptions(token.access_token),
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });
    });
  });
});
