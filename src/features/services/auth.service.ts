import jwt from "jsonwebtoken";
import { UserProps, UserTokenProps } from "@/features/models/user";
import { query } from "@/features/providers/database";
import logger from "@/shared/logger/logger";

export function createToken(userId: UserProps["id"]) {
  return jwt.sign({ user: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
}

export async function createRefreshToken(userId: UserProps["id"]) {
  const token = jwt.sign({ user: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_TO_REFRESH,
  });
  await query("INSERT INTO user_tokens(user_id, token) VALUES ($1, $2) ON CONFLICT (user_id, token) DO NOTHING;", [
    userId,
    token,
  ]);
  return token;
}

export async function checkRefreshToken(token: UserTokenProps["token"]) {
  const result = await query("SELECT 1 FROM user_tokens WHERE token = $1;", [token]);
  return result.rows.length > 0;
}

export async function destroyRefreshToken(token: UserTokenProps["token"]) {
  const result = await query("DELETE FROM user_tokens WHERE token = $1;", [token]);
  // TODO, obter user do token
  if (result.rows.length <= 0) logger.warn("When searching the database, the Update Token was not found.");
  return;
}

export async function getUserByEmail(email: UserProps["email"]) {
  const result = await query("SELECT users.id, users.email, users.password FROM users WHERE email = $1;", [email]);
  return result.rows.length ? result.rows[0] : null;
}
