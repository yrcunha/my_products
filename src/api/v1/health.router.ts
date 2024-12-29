import { Request, Response, Router } from "express";
import { systemHealth } from "@/features/services/system-health";
import { HttpCodes } from "@/shared/http/http";

export function healthRouter() {
  const health_router = Router();

  health_router.get("/api/v1/health", async (_req: Request, res: Response) => {
    res.status(HttpCodes.OK).json(await systemHealth());
  });

  return health_router;
}
