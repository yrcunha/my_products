import { Router } from "express";
import { create, getAll, getById, remove, update } from "@/controllers/client.controller";

export function clientRouter() {
  const router = Router();
  return router
    .post("/api/v1/clients", create)
    .get("/api/v1/clients", getAll)
    .get("/api/v1/clients/:id", getById)
    .put("/api/v1/clients/:id", update)
    .delete("/api/v1/clients/:id", remove);
}
