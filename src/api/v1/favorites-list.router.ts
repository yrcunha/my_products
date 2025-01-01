import { Router } from "express";
import { add, getAll, getById, remove } from "@/controllers/favorites-list.controller";

export function favoritesListRouter() {
  const router = Router();
  return router
    .post("/api/v1/clients/:id/favorite_products", add)
    .get("/api/v1/clients/:id/favorite_products", getAll)
    .delete("/api/v1/clients/:id/favorite_products/:product_id", remove)
    .get("/api/v1/clients/:id/favorite_products/:product_id", getById);
}
