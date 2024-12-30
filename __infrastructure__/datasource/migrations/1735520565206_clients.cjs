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
    "clients",
    {
      id: {
        type: "char(26)",
        primaryKey: true,
      },
      name: {
        type: "text",
        notNull: false,
      },
      email: {
        type: "text",
        notNull: true,
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
  pgm.createIndex("clients", ["name", "email"], { unique: true });
};
