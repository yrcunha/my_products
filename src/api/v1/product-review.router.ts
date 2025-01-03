import { Router } from "express";
import { add, getAll } from "@/controllers/product-review.controller";
import { isAuthenticated, isValidUser } from "@/api/interceptors/middlewares";

export function productReviewRouter() {
  const router = Router();
  return router
    .post("/api/v1/products/:id/reviews", isAuthenticated, isValidUser, add)
    .get("/api/v1/products/:id/reviews", getAll);
}
