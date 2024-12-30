import { Router } from "express";
import { health } from "@/controllers/system-health.controller";

export function healthRouter() {
  const router = Router();
  return router.get("/api/v1/health", health);
}
