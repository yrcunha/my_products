/**
 * @type {import("node-pg-migrate").ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import("node-pg-migrate").MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable(
    "favorite_products",
    {
      client_id: {
        type: "char(26)",
        references: "clients(id)",
      },
      product_id: {
        type: "text",
        references: "products(id)",
      },
      status: {
        type: "boolean",
        default: true,
      },
      created_at: {
        type: "timestamptz",
        default: pgm.func("now()"),
      },
      updated_at: {
        type: "timestamptz",
      },
    },
    {
      ifNotExists: true,
    },
  );

  pgm.addConstraint("favorite_products", "favorite_products_pkey", {
    primaryKey: ["client_id", "product_id"],
  });
};
