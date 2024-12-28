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
    "users",
    {
      id: {
        type: "char(26)",
        primaryKey: true,
      },
      password: {
        type: "text",
        notNull: false,
      },
      email: {
        type: "text",
        notNull: true,
        unique: true,
      },
      status: {
        type: "boolean",
        default: true,
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
};
