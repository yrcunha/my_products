import { Router } from "express";
import { refreshToken, signInUser } from "@/controllers/session.controller";

export function sessionRouter() {
  const router = Router();
  return router.post("/api/v1/login", signInUser).post("/api/v1/refresh_token", refreshToken);
}
