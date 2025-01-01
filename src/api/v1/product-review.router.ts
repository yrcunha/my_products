import { Router } from "express";
import { add, getAll } from "@/controllers/product-review.controller";

export function productReviewRouter() {
  const router = Router();
  return router.post("/api/v1/products/:id/reviews", add).get("/api/v1/products/:id/reviews", getAll);
}
