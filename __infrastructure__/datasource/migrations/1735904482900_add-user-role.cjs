/**
 * @type {import("node-pg-migrate").ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import("node-pg-migrate").MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.addColumn("users", {
    role: {
      type: "integer",
      notNull: true,
      default: 1,
    },
  });

  pgm.sql(`
    UPDATE users
    SET role = (SELECT id FROM roles WHERE name = 'admin')
    WHERE email = 'labs@gmail.com';

    UPDATE users
    SET role = (SELECT id FROM roles WHERE name = 'client')
    WHERE email = 'sbal@gmail.com';
  `);
};
