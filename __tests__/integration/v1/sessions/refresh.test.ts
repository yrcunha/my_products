import { BaseUrl, delay, logIn, waitForAllServices } from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { faker } from "@faker-js/faker";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import { TokenProps } from "../../../../src/features/models/user";

let token: TokenProps;
const expireInForTestInMs = 2000;

beforeAll(async () => {
  await waitForAllServices();
  token = await logIn();
});

describe("POST /api/v1/refresh_token", () => {
  describe("Anonymous user", () => {
    describe("Refresh token", () => {
      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/refresh_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: token.refresh_token }),
        });
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        expect(responseJson).toHaveProperty("access_token");
        expect(responseJson).toHaveProperty("refresh_token");
      });

      test("For the second time token non exist", async () => {
        const response = await fetch(`${BaseUrl}/v1/refresh_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: faker.internet.jwt() }),
        });
        expect(response.status).toBe(HttpCodes.Unauthorized);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.TokenExpired);
      });

      test("For the third token expired", async () => {
        await delay(expireInForTestInMs);
        const response = await fetch(`${BaseUrl}/v1/refresh_token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: token.refresh_token }),
        });
        expect(response.status).toBe(HttpCodes.Unauthorized);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.TokenExpired);
      });
    });
  });
});
