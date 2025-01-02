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
    "user_tokens",
    {
      user_id: {
        type: "char(26)",
        references: "users(id)",
      },
      token: {
        type: "text",
        unique: true,
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

  pgm.addConstraint("user_tokens", "user_tokens_pkey", {
    primaryKey: ["user_id", "token"],
  });
};
