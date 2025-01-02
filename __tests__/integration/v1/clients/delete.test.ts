import {
  BaseUrl,
  clearTableInDatabase,
  insertClientForTesting,
  logIn,
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
  await clearTableInDatabase("clients");
  const [client, token] = await Promise.all([insertClientForTesting(), logIn()]);
  clientId = client.id;
  accessToken = token.access_token;
});

describe("DELETE /api/v1/clients/{id}", () => {
  describe("Authenticated user", () => {
    describe("Deleting client", () => {
      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}`, {
          method: "DELETE",
          headers: headersOptions(accessToken),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the second time with a non-existent client", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${randomUUID()}`, {
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
