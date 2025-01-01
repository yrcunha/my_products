import { getProductById } from "../../../../src/features/providers/products/product.request";
import data from "../../../../__infrastructure__/provisioning/development/product-server.json";
import { InvalidContractForServiceError } from "../../../../src/shared/errors/invalid-contract-for-service.error";
import { RequestError } from "../../../../src/shared/errors/request.error";
import { randomUUID } from "node:crypto";
import { HttpCodes } from "../../../../src/shared/http/http";

describe("Product request", () => {
  test("Product request completed successfully\n", async () => {
    await expect(getProductById(data.product[0].id)).resolves.toEqual({
      ...data.product[0],
      state: "available",
    });
  });

  test("Request with error for product not found\n", async () => {
    jest.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        status: HttpCodes.NotFound.valueOf(),
        ok: false,
        json: () => Promise.resolve(new Error("Product not found!")),
      } as Response),
    );
    await expect(getProductById(randomUUID())).rejects.toBeInstanceOf(RequestError);
  });

  test("Request with error for return of product with invalid contract", async () => {
    await expect(getProductById(data.product[5].id)).rejects.toBeInstanceOf(InvalidContractForServiceError);
  });
});
