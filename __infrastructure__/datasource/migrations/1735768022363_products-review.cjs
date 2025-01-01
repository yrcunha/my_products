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
    "products_review",
    {
      id: {
        type: "serial",
        primaryKey: true,
      },
      product_id: {
        type: "text",
        references: "products(id)",
      },
      score: {
        type: "smallint",
      },
      message: {
        type: "text",
      },
      reviewer: {
        type: "text",
      },
      created_at: {
        type: "timestamptz",
        default: pgm.func("now()"),
      },
    },
    {
      ifNotExists: true,
    },
  );

  pgm.addConstraint("products_review", "check_score_range", "CHECK (score BETWEEN 1 AND 5)");
};
