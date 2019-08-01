/* eslint func-names:0 */

exports.up = function (knex) {
  return knex.schema.table("admins", (table) => {
    table.date("last_login");
  });
};

exports.down = function (knex) {
  return knex.schema.table("admins", (table) => {
    table.dropColumn("last_login");
  });
};

// exports.config = { transaction: false };
