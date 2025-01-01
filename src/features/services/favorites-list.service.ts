import { query } from "@/features/providers/database";
import { FavoriteProps } from "@/features/models/favorite";
import { ResourceNotFoundError } from "@/shared/errors/resource-not-found.error";
import { getProductById } from "@/features/providers/products/product.request";
import { PaginationProps } from "@/features/models/pagination";

export async function addItem(
  clientId: FavoriteProps["clientId"],
  productId: FavoriteProps["productId"],
): Promise<void> {
  const product = await getProductById(productId);

  const clientExists = await query("SELECT id FROM clients WHERE id = $1;", [clientId]);
  if (clientExists.rows.length <= 0) throw new ResourceNotFoundError("Client");

  await query("SELECT insert_product_and_favorite($1, $2, $3, $4, $5, $6, $7, $8, $9);", [
    product.id,
    product.price,
    product.image,
    product.brand,
    product.title,
    product.reviewScore,
    product.state,
    clientId,
    true,
  ]);
}

export async function changeItem(
  clientId: FavoriteProps["clientId"],
  productId: FavoriteProps["productId"],
  status: FavoriteProps["status"],
) {
  const { rows } = await query(
    "UPDATE favorite_products SET status = $3 WHERE client_id = $1 AND product_id = $2 RETURNING 1;",
    [clientId, productId, status],
  );
  return rows.length;
}

export async function getItemById(clientId: FavoriteProps["clientId"], productId: FavoriteProps["productId"]) {
  const result = await query(
    `
        SELECT products.id,
               products.price,
               products.image,
               products.title,
               COALESCE(
                       (SELECT JSON_AGG(reviews)
                        FROM (SELECT message, score, created_at
                              FROM products_review
                              WHERE products_review.product_id = products.id
                              ORDER BY created_at DESC
                              LIMIT 3) AS reviews),
                       '[]'::json
               ) AS reviews
        FROM products
                 INNER JOIN favorite_products ON products.id = favorite_products.product_id
        WHERE favorite_products.client_id = $1
          AND favorite_products.product_id = $2;
    `,
    [clientId, productId],
  );
  const product = result.rows.map((item) => ({
    ...item,
    price: Number(item.price),
  }))[0];
  return result.rows.length ? product : null;
}

export async function getAllItems(clientId: FavoriteProps["clientId"], { page, limit }: PaginationProps) {
  const result = await query(
    `WITH Total AS (SELECT COUNT(*) AS count FROM products)
     SELECT products.id,
            products.price,
            products.image,
            products.title,
            (SELECT count::int FROM Total) AS total
     FROM products
              INNER JOIN favorite_products ON products.id = favorite_products.product_id
     WHERE favorite_products.client_id = $1
     LIMIT $2 OFFSET $3;`,
    [clientId, limit, (page - 1) * limit],
  );

  let total = 0;
  if (result.rows.length > 0) total = result.rows[0].total;
  const data = result.rows.map(({ total: _, ...item }) => ({
    ...item,
    price: Number(item.price),
  }));
  return { page, limit, total, data };
}
