/**
 * @type {import("node-pg-migrate").ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import("node-pg-migrate").MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(
    // eslint-disable-next-line no-secrets/no-secrets
    `
      INSERT INTO users (id, password, email)
      VALUES ('01JGJA0S8REPJRSHACR2JBS527', '$2b$10$Zw0Oc/f8hegV.f2mMTvRP.lBbGe4kXESo/bF8cxYl4Xudjgg2y7Ja',
              'labs@gmail.com'),
             ('01JGJA6QYNHD5B0Y3JA91X9EAQ', '$2b$10$Zw0Oc/f8hegV.f2mMTvRP.lBbGe4kXESo/bF8cxYl4Xudjgg2y7Ja',
              'sbal@gmail.com')
    `,
  );
};
