import { BaseUrl, waitForAllServices } from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";

beforeAll(async () => await waitForAllServices());

describe("POST /api/v1/login", () => {
  describe("Anonymous user", () => {
    describe("Log in system", () => {
      const payload = { email: "labs@gmail.com", password: "labs123" };

      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.OK);
        const responseJson = await response.json();
        expect(responseJson).toHaveProperty("access_token");
        expect(responseJson).toHaveProperty("refresh_token");
      });

      test("For the second client non exists", async () => {
        const response = await fetch(`${BaseUrl}/v1/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@gmail.com", password: payload.password }),
        });
        expect(response.status).toBe(HttpCodes.Unauthorized);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.Unauthorized);
      });

      test("For the third time with invalid password", async () => {
        const response = await fetch(`${BaseUrl}/v1/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: payload.email, password: "" }),
        });
        expect(response.status).toBe(HttpCodes.Unauthorized);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.Unauthorized);
      });
    });
  });
});
