import { Router } from "express";
import { add, getAll, getById, remove } from "@/controllers/favorites-list.controller";
import { isAuthenticated } from "@/api/interceptors/middlewares";

export function favoritesListRouter() {
  const router = Router();
  return router
    .post("/api/v1/clients/:id/favorite_products", isAuthenticated, add)
    .get("/api/v1/clients/:id/favorite_products", isAuthenticated, getAll)
    .delete("/api/v1/clients/:id/favorite_products/:product_id", isAuthenticated, remove)
    .get("/api/v1/clients/:id/favorite_products/:product_id", isAuthenticated, getById);
}
