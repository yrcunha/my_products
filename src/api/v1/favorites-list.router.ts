import { Router } from "express";
import { add, getAll, getById, remove } from "@/controllers/favorites-list.controller";
import { isAuthenticated, isAuthorizedAdminUserOrSelf, isHimself } from "@/api/interceptors/middlewares";

export function favoritesListRouter() {
  const router = Router();
  return router
    .post("/api/v1/clients/:id/favorite_products", isAuthenticated, isHimself, add)
    .get("/api/v1/clients/:id/favorite_products", isAuthenticated, isAuthorizedAdminUserOrSelf, getAll)
    .delete("/api/v1/clients/:id/favorite_products/:product_id", isAuthenticated, isHimself, remove)
    .get("/api/v1/clients/:id/favorite_products/:product_id", isAuthenticated, isAuthorizedAdminUserOrSelf, getById);
}
