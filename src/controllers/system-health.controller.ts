import { Request, Response } from "express";
import { HttpCodes } from "@/shared/http/http";
import { systemHealth } from "@/features/services/system-health";

export async function health(_req: Request, res: Response) {
  const response = await systemHealth();
  res.status(HttpCodes.OK).json(response);
}
