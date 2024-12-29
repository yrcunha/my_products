import { Router } from "express";
import { systemHealth } from "@/features/services/system-health";

export function healthRouter() {
  const health_router = Router();

  health_router.get("/api/v1/health", systemHealth);

  return health_router;
}
