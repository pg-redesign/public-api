/* eslint func-names:0 */

exports.up = function(knex) {
  return knex.schema.table("students", table => {
    table.boolean("mailing_list").defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table("students", table => {
    table.dropColumn("mailing_list");
  });
};

// exports.config = { transaction: false };
