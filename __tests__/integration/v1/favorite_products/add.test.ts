import {
  AdminUser,
  BaseUrl,
  clearTableInDatabase,
  ClientUser,
  insertClientForTesting,
  logIn,
  waitForAllServices,
} from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import data from "../../../../__infrastructure__/provisioning/development/product-server.json";
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
  const [client, token] = await Promise.all([insertClientForTesting(AdminUser.id), logIn(AdminUser)]);
  clientId = client.id;
  accessToken = token.access_token;
});

describe("POST /api/v1/clients/{id}/favorite_products", () => {
  describe("Authenticated user", () => {
    describe("Add product in list", () => {
      const payload = { product_id: data.product[0].id };

      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products`, {
          method: "POST",
          headers: headersOptions(accessToken),
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the second time with a non-existent client", async () => {
        const token = await logIn(ClientUser);
        const response = await fetch(`${BaseUrl}/v1/clients/${ClientUser.id}/favorite_products`, {
          method: "POST",
          headers: headersOptions(token.access_token),
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("There is already a list for the fourth product", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products`, {
          method: "POST",
          headers: headersOptions(accessToken),
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.Conflict);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceAlreadyExists);
      });

      test("For the fourth time with a user without permission", async () => {
        const token = await logIn(ClientUser);
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}/favorite_products`, {
          method: "POST",
          headers: headersOptions(token.access_token),
          body: JSON.stringify(payload),
        });
        const responseJson = await response.json();

        expect(response.status).toBe(HttpCodes.Forbidden);
        expect(responseJson.name).toEqual(ErrorCodes.ActionNotAllowed);
      });
    });
  });
});
