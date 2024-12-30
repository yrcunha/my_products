import { ClientProps } from "@/features/models/client";
import { query } from "@/features/providers/database";
import { PaginationProps } from "@/features/models/pagination";

export async function createClient(props: ClientProps) {
  const {
    rows: [row],
  } = await query("INSERT INTO clients (id, name, email) VALUES ($1, $2, $3) RETURNING id;", [
    props.id,
    props.name,
    props.email,
  ]);
  return row.id;
}

export async function getAllClients({ page, limit }: PaginationProps) {
  const result = await query(
    `WITH Total AS (SELECT COUNT(*) AS count FROM clients)
     SELECT clients.id, clients.name, clients.email, (SELECT count::int FROM Total) AS total
     FROM clients
     LIMIT $1 OFFSET $2;`,
    [limit, (page - 1) * limit],
  );

  let total = 0;
  if (result.rows.length > 0) total = result.rows[0].total;
  const data = result.rows.map(({ total: _, ...item }) => item);
  return { page, limit, total, data };
}

export async function getClientById(id: ClientProps["id"]) {
  const result = await query("SELECT clients.id, clients.name, clients.email FROM clients WHERE id = $1;", [id]);
  return result.rows.length ? result.rows[0] : null;
}

export async function updateClient(id: ClientProps["id"], props: Pick<Partial<ClientProps>, "name" | "email">) {
  const { rows } = await query("UPDATE clients SET name = $2, email = $3 WHERE id = $1 RETURNING 1;", [
    id,
    props.name,
    props.email,
  ]);
  return rows.length;
}

export async function changeStatus(id: ClientProps["id"], status: ClientProps["status"]) {
  const { rows } = await query("UPDATE clients SET status = $2 WHERE id = $1 RETURNING 1;", [id, status]);
  return rows.length;
}
