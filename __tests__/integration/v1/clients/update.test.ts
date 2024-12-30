import { BaseUrl, clearTableInDatabase, insertClientForTesting, waitForAllServices } from "../../../orchestrator";
import { HttpCodes } from "../../../../src/shared/http/http";
import { randomUUID } from "node:crypto";
import { ErrorCodes } from "../../../../src/shared/errors/custom-errors";
import { faker } from "@faker-js/faker";

let clientId: string;

beforeAll(async () => {
  await waitForAllServices();
  await clearTableInDatabase("clients");
  clientId = (await insertClientForTesting()).id;
});

describe("PUT /api/v1/clients/{id}", () => {
  describe("Anonymous user", () => {
    describe("Updating client", () => {
      const payload = { name: faker.person.fullName(), email: faker.internet.email() };

      test("For the first time successfully", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotContent);
      });

      test("For the second time with a non-existent client", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${randomUUID()}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        expect(response.status).toBe(HttpCodes.NotFound);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.ResourceNotFound);
      });

      test("For the third time with invalid payload", async () => {
        const response = await fetch(`${BaseUrl}/v1/clients/${clientId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: faker.person.fullName() }),
        });
        expect(response.status).toBe(HttpCodes.BadRequest);
        const responseJson = await response.json();
        expect(responseJson.name).toEqual(ErrorCodes.InvalidPayload);
      });
    });
  });
});
