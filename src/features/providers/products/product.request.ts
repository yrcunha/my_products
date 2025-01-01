import { ProductModel, ProductProps } from "@/features/models/products";
import { request } from "@/features/providers/request";
import { mapZodErrorDetails } from "@/shared/utils/map-zod-error-details";
import { InvalidContractForServiceError } from "@/shared/errors/invalid-contract-for-service.error";
import { RequestError } from "@/shared/errors/request.error";

export async function getProductById(productId: ProductProps["id"]) {
  const url = `${process.env.PRODUCT_API_BASE_URL}/${productId}`;
  const result = await request(url, { method: "GET" });
  if (!result.success) throw new RequestError(`${result.statusCode}`, result.data);

  const model = ProductModel.safeParse(result.data);
  if (model.success) return model.data;
  throw new InvalidContractForServiceError("Products", url, mapZodErrorDetails(model.error?.issues));
}
