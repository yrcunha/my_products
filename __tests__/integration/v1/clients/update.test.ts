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
import { faker } from "@faker-js/faker";
import { TokenProps } from "../../../../src/features/models/user";

let accessToken: TokenProps["access_token"];
const headersOptions = (token: TokenProps["access_token"]) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
let clientId: Record<string, unknown>;

beforeAll(async () => {
  await waitForAllServices();
  await clearTableInDatabase("clients");
  const [client, token] = await Promise.all([insertClientForTesting(AdminUser.id), logIn(AdminUser)]);
  clientId = client.id;
  accessToken = token.access_token;
});

describe("PUT /api/v1/clients/{id}", () => {
  describe("Authenticated user", () => {
    describe("Updating client", () => {
      const payload = { name: faker.person.fullName(), email: faker.internet.email() };

      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}`, {
          method: "PUT",
          headers: headersOptions(accessToken),
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the second time with a non-existent client", async () => {
        const token = await logIn(ClientUser);
        const response = await fetch(`${BaseUrl}/v1/clients/${ClientUser.id}`, {
          method: "PUT",
          headers: headersOptions(token.access_token),
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("For the third time with invalid payload", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}`, {
          method: "PUT",
          headers: headersOptions(accessToken),
          body: JSON.stringify({ email: faker.person.fullName() }),
        });
        expect(response.status).toBe(HttpCodes.BadRequest);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.InvalidPayload);
      });

      test("For the fourth time with a user without permission", async () => {
        const token = await logIn(ClientUser);
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}`, {
          method: "PUT",
          headers: headersOptions(token.access_token),
          body: JSON.stringify({ email: faker.person.fullName() }),
        });
        expect(response.status).toBe(HttpCodes.Forbidden);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ActionNotAllowed);
      });
    });
  });
});
