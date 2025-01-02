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
  Authorization: `Bearer ${token}`,
});
let client: Record<string, unknown>;

beforeAll(async () => {
  await waitForAllServices();
  await clearTableInDatabase("clients");
  const [DBClient, token] = await Promise.all([insertClientForTesting(), logIn()]);
  client = DBClient;
  accessToken = token.access_token;
});

describe("GET /api/v1/clients", () => {
  describe("Authenticated user", () => {
    describe("Retrieving client", () => {
      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${client.id}`, {
          headers: headersOptions(accessToken),
        });
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        expect(responseJson).toEqual(client);
      });

      test("For the second time with a non-existent client", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${randomUUID()}`, {
          headers: headersOptions(accessToken),
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("For the third time, retrieve a client list", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients`, {
          headers: headersOptions(accessToken),
        });
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        expect(Array.isArray(responseJson.data)).toBeTruthy();
        expect(responseJson).toEqual({
          page: 1,
          limit: 10,
          total: 1,
          data: [client],
        });
      });
    });
  });
});
