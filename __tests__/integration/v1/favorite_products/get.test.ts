import {
  AdminUser,
  BaseUrl,
  clearTableInDatabase,
  ClientUser,
  FirstProduct,
  insertClientForTesting,
  insertProductForTesting,
  logIn,
  ProductId,
  waitForAllServices,
} from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import { TokenProps } from "../../../../src/features/models/user";

let accessToken: TokenProps["access_token"];
const headersOptions = (token: TokenProps["access_token"]) => ({
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
  const [client, token] = await Promise.all([insertClientForTesting(AdminUser.id), logIn(AdminUser)]);
  clientId = client.id;
  accessToken = token.access_token;

  await insertProductForTesting(clientId, FirstProduct);
});

describe("GET /api/v1/clients/{id}/favorite_products/{product_id}", () => {
  describe("Authenticated user", () => {
    describe("Retrieving product", () => {
      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products/${ProductId}`, {
          headers: headersOptions(accessToken),
        });
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        const expected = {
          id: FirstProduct.id,
          price: FirstProduct.price,
          title: FirstProduct.title,
          image: FirstProduct.image,
          reviews: [],
        };
        expect(responseJson).toEqual(expected);
      });

      test("For the second time with a non-existent client", async () => {
        const token = await logIn(ClientUser);
        const response = await fetch(`${BaseUrl}/v1/clients/${ClientUser.id}/favorite_products/${ProductId}`, {
          headers: headersOptions(token.access_token),
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("For the third time, retrieve a favorite product list", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products`, {
          headers: headersOptions(accessToken),
        });
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        expect(Array.isArray(responseJson.data)).toBeTruthy();
        const expected = {
          id: FirstProduct.id,
          price: FirstProduct.price,
          title: FirstProduct.title,
          image: FirstProduct.image,
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
