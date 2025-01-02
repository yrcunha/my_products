import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { destroyRefreshToken } from "@/features/services/auth.service";
import { TokenExpiredError } from "@/shared/errors/token-expired.error";
import { UnauthorizedError } from "@/shared/errors/unauthorized.error";

export async function isAuthenticated(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers?.authorization;
  if (!authorization) throw new Error("No token provided");

  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    req.user = decoded.user;
    req.token = token;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      await destroyRefreshToken(token);
      throw new TokenExpiredError();
    }
    throw new UnauthorizedError();
  }
}
