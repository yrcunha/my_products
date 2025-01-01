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
    "products",
    {
      id: {
        type: "text",
        primaryKey: true,
      },
      price: {
        type: "decimal(15,2)",
        notNull: false,
      },
      image: {
        type: "text",
        notNull: true,
      },
      brand: {
        type: "text",
        notNull: true,
      },
      title: {
        type: "text",
        notNull: true,
      },
      review_score: {
        type: "decimal(5,2)",
        notNull: true,
      },
      state: {
        type: "varchar(11)",
        default: "available",
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
  pgm.addConstraint("products", "check_state_valid_values", {
    check: "state IN ('available', 'unavailable')",
  });
};
