import { Request, Response } from "express";
import { HttpCodes } from "@/shared/http/http";
import bcrypt from "bcrypt";
import {
  checkRefreshToken,
  createRefreshToken,
  createToken,
  destroyRefreshToken,
  getUserByEmail,
} from "@/features/services/auth.service";
import jwt, { JwtPayload } from "jsonwebtoken";
import { TokenExpiredError } from "@/shared/errors/token-expired.error";
import { UnauthorizedError } from "@/shared/errors/unauthorized.error";

export async function signInUser({ body: { email, password } }: Request, res: Response) {
  const user = await getUserByEmail(email);
  if (!user) throw new UnauthorizedError("Invalid credentials!");

  const passwordValid = await bcrypt.compare(password, user.password);
  if (!passwordValid) throw new UnauthorizedError("Invalid credentials!");

  const accessToken = createToken(user);
  const refreshToken = await createRefreshToken(user.id);
  res.status(HttpCodes.OK).json({ access_token: accessToken, refresh_token: refreshToken });
}

export async function refreshToken({ body: { refresh_token: requestToken } }: Request, res: Response) {
  const refreshToken = await checkRefreshToken(requestToken);
  if (!refreshToken) throw new TokenExpiredError("Refresh token not set!");

  try {
    const decoded = jwt.verify(requestToken, process.env.JWT_REFRESH_SECRET) as JwtPayload;
    res.status(HttpCodes.OK).json({ access_token: createToken(decoded.user), refresh_token: requestToken });
  } catch (error) {
    await destroyRefreshToken(requestToken);
    if (error instanceof jwt.TokenExpiredError) throw new TokenExpiredError();
    throw new UnauthorizedError();
  }
}
