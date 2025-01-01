import { query } from "@/features/providers/database";
import { getProductById } from "@/features/providers/products/product.request";
import { ProductProps } from "@/features/models/products";
import { ReviewProps } from "@/features/models/review";
import { PaginationProps } from "@/features/models/pagination";

async function addProduct(data: ProductProps) {
  await query(
    "INSERT INTO products (id, price, image, brand, title, review_score, state) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING 1;",
    [data.id, data.price, data.image, data.brand, data.title, data.reviewScore, data.state],
  );
}

export async function addReview(productId: ProductProps["id"], data: ReviewProps) {
  const result = await query("SELECT 1 FROM products WHERE id = $1;", [productId]);

  if (result.rows.length <= 0) {
    const product = await getProductById(productId);
    await addProduct(product);
  }

  await query(
    "INSERT INTO products_review (product_id, score, message, reviewer) VALUES ($1, $2, $3, $4) RETURNING 1;",
    [productId, data.score, data.message, data.reviewer],
  );
}

export async function getAllReviews(productId: ProductProps["id"], { page, limit }: PaginationProps) {
  const result = await query(
    `WITH Total AS (SELECT COUNT(*) AS count FROM products_review)
     SELECT products_review.score,
            products_review.message,
            products_review.reviewer,
            (SELECT count::int FROM Total) AS total
     FROM products_review
     WHERE product_id = $1
     LIMIT $2 OFFSET $3;`,
    [productId, limit, (page - 1) * limit],
  );

  let total = 0;
  if (result.rows.length > 0) total = result.rows[0].total;
  const data = result.rows.map(({ total: _, ...item }) => item);
  return { page, limit, total, data };
}
