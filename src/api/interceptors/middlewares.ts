import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { destroyRefreshToken } from "@/features/services/auth.service";
import { TokenExpiredError } from "@/shared/errors/token-expired.error";
import { UnauthorizedError } from "@/shared/errors/unauthorized.error";
import { Role } from "@/features/models/user";
import { getUserById } from "@/features/services/user.service";
import { ActionNotAllowedError } from "@/shared/errors/action-not-allowed.error";
import { CorruptUserError } from "@/shared/errors/corrupt-user.error";

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

export async function isAuthorizedAdminUser(req: Request, _res: Response, next: NextFunction) {
  const user = await getUserById(req.user);
  if (!user) throw new CorruptUserError();
  if (user.role !== Role.admin) throw new ActionNotAllowedError();
  next();
}

export async function isAuthorizedAdminUserOrSelf(req: Request, _res: Response, next: NextFunction) {
  const user = await getUserById(req.user);
  if (!user) throw new CorruptUserError();
  if (user.role !== Role.admin && user.id !== req.params.id) throw new ActionNotAllowedError("");
  next();
}

export async function isHimself(req: Request, _res: Response, next: NextFunction) {
  const user = await getUserById(req.user);
  if (!user) throw new CorruptUserError();
  if (user.id !== req.params.id) throw new ActionNotAllowedError();
  next();
}

export async function isValidUser(req: Request, _res: Response, next: NextFunction) {
  const user = await getUserById(req.user);
  if (!user) throw new CorruptUserError();
  next();
}
