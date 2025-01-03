import { AdminUser, BaseUrl, clearTableInDatabase, logIn, waitForAllServices } from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { faker } from "@faker-js/faker";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import { TokenProps } from "../../../../src/features/models/user";

let token: TokenProps;
const headersOptions = (token: TokenProps["access_token"]) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

beforeAll(async () => {
  await waitForAllServices();
  await clearTableInDatabase("clients");
  token = await logIn(AdminUser);
});

describe("Authenticated user", () => {
  describe("Creating client", () => {
    const payload = { name: faker.person.fullName(), email: faker.internet.email() };

    test("For the first time successfully", async () => {
      const response = await fetch(`${BaseUrl}/v1/clients`, {
        method: "POST",
        headers: headersOptions(token.access_token),
        body: JSON.stringify(payload),
      });
      expect(response.status).toBe(HttpCodes.Created);
      const responseJson = await response.json();
      expect(responseJson).toHaveProperty("insert_id");
    });

    test("For the second client already exists", async () => {
      const response = await fetch(`${BaseUrl}/v1/clients`, {
        method: "POST",
        headers: headersOptions(token.access_token),
        body: JSON.stringify(payload),
      });
      expect(response.status).toBe(HttpCodes.Conflict);
      const responseJson = await response.json();
      expect(responseJson.name).toEqual(ErrorCodes.ResourceAlreadyExists);
    });

    test("For the third time with invalid payload", async () => {
      const response = await fetch(`${BaseUrl}/v1/clients`, {
        method: "POST",
        headers: headersOptions(token.access_token),
        body: JSON.stringify({ email: faker.internet.email() }),
      });
      expect(response.status).toBe(HttpCodes.BadRequest);
      const responseJson = await response.json();
      expect(responseJson.name).toEqual(ErrorCodes.InvalidPayload);
    });
  });
});
