/**
 * @type {import("node-pg-migrate").ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import("node-pg-migrate").MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("roles", {
    id: {
      type: "serial",
      primaryKey: true,
    },
    name: {
      type: "varchar(50)",
    },
  });

  pgm.sql(`
    INSERT INTO roles (id, name)
    VALUES (0, 'admin'),
           (1, 'client');
  `);
};
