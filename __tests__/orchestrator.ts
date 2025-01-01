import retry from "async-retry";
import { query } from "../src/features/providers/database";
import { faker } from "@faker-js/faker";
import { ulid } from "ulid";
import { ProductProps } from "../src/features/models/products";
import { ClientProps } from "../src/features/models/client";

export const BaseUrl = "http://localhost:3000/api";

export function waitForAllServices() {
  return retry(
    async () => {
      const response = await fetch(`${BaseUrl}/v1/health`);
      if (response.ok) return;
      throw new Error();
    },
    { retries: 100, maxTimeout: 1000 },
  );
}

export async function clearTableInDatabase(tableName: string) {
  await query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`);
}

export async function insertClientForTesting() {
  const props = { id: ulid(), name: faker.person.fullName(), email: faker.internet.email() };
  const result = await query("INSERT INTO clients (id, name, email) VALUES ($1, $2, $3) RETURNING id, email, name;", [
    props.id,
    props.name,
    props.email,
  ]);
  return result.rows[0];
}

export async function insertProductForTesting(clientId: ClientProps["id"], data: Omit<ProductProps, "state">) {
  await query("SELECT insert_product_and_favorite($1, $2, $3, $4, $5, $6, $7, $8, $9);", [
    data.id,
    data.price,
    data.image,
    data.brand,
    data.title,
    data.reviewScore,
    "available",
    clientId,
    true,
  ]);
}
