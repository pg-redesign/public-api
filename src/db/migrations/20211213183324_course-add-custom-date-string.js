/* eslint func-names:0 */

exports.up = function (knex) {
  return knex.schema.table("courses", table => {
    table.string("custom_date_string").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("courses", table => {
    table.dropColumn("custom_date_string");
  });
};

// exports.config = { transaction: false };
