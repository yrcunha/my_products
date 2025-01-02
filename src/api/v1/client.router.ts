import { Router } from "express";
import { create, getAll, getById, remove, update } from "@/controllers/client.controller";
import { isAuthenticated } from "@/api/interceptors/middlewares";

export function clientRouter() {
  const router = Router();
  return router
    .post("/api/v1/clients", isAuthenticated, create)
    .get("/api/v1/clients", isAuthenticated, getAll)
    .get("/api/v1/clients/:id", isAuthenticated, getById)
    .put("/api/v1/clients/:id", isAuthenticated, update)
    .delete("/api/v1/clients/:id", isAuthenticated, remove);
}
