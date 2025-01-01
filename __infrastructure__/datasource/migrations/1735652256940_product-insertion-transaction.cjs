/**
 * @type {import("node-pg-migrate").ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import("node-pg-migrate").MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(`
    CREATE OR REPLACE FUNCTION insert_product_and_favorite(
      aux_product_id TEXT,
      aux_price DECIMAL(15, 2),
      aux_image TEXT,
      aux_brand TEXT,
      aux_title TEXT,
      aux_review_score DECIMAL(5, 2),
      aux_state VARCHAR(11),
      aux_client_id CHAR(26),
      aux_status BOOLEAN
    )
    RETURNS VOID AS
    $$
    BEGIN
        INSERT INTO products (id, price, image, brand, title, review_score, state)
        VALUES (aux_product_id, aux_price, aux_image, aux_brand, aux_title, aux_review_score, aux_state)
        ON CONFLICT (id) DO NOTHING;

        IF EXISTS (SELECT 1 FROM favorite_products WHERE client_id = aux_client_id AND product_id = aux_product_id AND status = FALSE) THEN
            UPDATE favorite_products
            SET status = TRUE, updated_at = now()
            WHERE client_id = aux_client_id AND product_id = aux_product_id AND status = FALSE;
        ELSE
            INSERT INTO favorite_products (client_id, product_id, status)
            VALUES (aux_client_id, aux_product_id, aux_status);
        END IF;
    END;
    $$ LANGUAGE plpgsql;
  `);
};
