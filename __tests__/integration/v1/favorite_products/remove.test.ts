import {
  BaseUrl,
  clearTableInDatabase,
  FirstProduct,
  insertClientForTesting,
  insertProductForTesting,
  logIn,
  ProductId,
  waitForAllServices,
} from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import { randomUUID } from "node:crypto";
import { TokenProps } from "../../../../src/features/models/user";

let accessToken: TokenProps["access_token"];
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
  ]);
  const [client, token] = await Promise.all([insertClientForTesting(), logIn()]);
  clientId = client.id;
  accessToken = token.access_token;

  await insertProductForTesting(clientId, FirstProduct);
});

describe("DELETE /api/v1/clients/{id}/favorite_products/{product_id}", () => {
  describe("Authenticated user", () => {
    describe("Deleting product", () => {
      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products/${ProductId}`, {
          method: "DELETE",
          headers: headersOptions(accessToken),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the second time with a non-existent client", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${randomUUID()}/favorite_products/${ProductId}`, {
          method: "DELETE",
          headers: headersOptions(accessToken),
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("For the third time with a non-existent product", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products/${randomUUID()}`, {
          method: "DELETE",
          headers: headersOptions(accessToken),
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });
    });
  });
});
