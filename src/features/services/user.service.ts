import { UserProps } from "@/features/models/user";
import { query } from "@/features/providers/database";

export async function getUserByEmail(email: UserProps["email"]) {
  const result = await query("SELECT users.id, users.email, users.password FROM users WHERE email = $1;", [email]);
  return result.rows.length ? result.rows[0] : null;
}

export async function getUserById(id: UserProps["id"]) {
  const result = await query(
    "SELECT users.id, roles.name as role FROM users JOIN roles ON users.role = roles.id WHERE users.id = $1;",
    [id],
  );
  return result.rows.length ? result.rows[0] : null;
}
