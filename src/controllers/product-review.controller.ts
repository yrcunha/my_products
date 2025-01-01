import { Request, Response } from "express";
import { HttpCodes } from "@/shared/http/http";
import { addReview, getAllReviews } from "@/features/services/product-review.service";
import { PaginationModel } from "@/features/models/pagination";
import { InvalidPayloadError } from "@/shared/errors/invalid-payload.error";
import { mapZodErrorDetails } from "@/shared/utils/map-zod-error-details";
import { ReviewModel } from "@/features/models/review";

export async function add(req: Request, res: Response) {
  const model = ReviewModel.safeParse(req.body);
  if (!model.success) throw new InvalidPayloadError(mapZodErrorDetails(model.error?.issues));

  await addReview(req.params.id, model.data);
  res.status(HttpCodes.NotContent).end();
}

export async function getAll(req: Request, res: Response) {
  const model = PaginationModel.parse(req.query);
  const result = await getAllReviews(req.params.id, model);
  res.status(HttpCodes.OK).json(result);
}
