import retry from "async-retry";
import { query } from "../src/features/providers/database";
import { faker } from "@faker-js/faker";
import { ulid } from "ulid";
import { ProductProps } from "../src/features/models/products";
import { ClientProps } from "../src/features/models/client";
import { ReviewProps } from "../src/features/models/review";
import data from "../__infrastructure__/provisioning/development/product-server.json";

export const BaseUrl = "http://localhost:3000/api";
export const ProductId = data.product[0].id;
export const FirstProduct = data.product[0];

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

export async function clearTablesInDatabase(tableName: string) {
  await Promise.all([await query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE;`)]);
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

export async function insertProductReviewForTesting(productId: ProductProps["id"], data: ReviewProps) {
  await query(
    "INSERT INTO products_review (product_id, score, message, reviewer) VALUES ($1, $2, $3, $4) RETURNING 1;",
    [productId, data.score, data.message, data.reviewer],
  );
}

export async function delay(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function logIn() {
  const response = await fetch(`${BaseUrl}/v1/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "labs@gmail.com", password: "labs123" }),
  });
  return await response.json();
}
