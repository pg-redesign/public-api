/* eslint func-names:0 */

exports.up = function(knex) {
  return knex.schema.table("courses", table => {
    table.string("sheet_id").defaultTo(null);
  });
};

exports.down = function(knex) {
  return knex.schema.table("courses", table => {
    table.dropColumn("sheet_id");
  });
};

// exports.config = { transaction: false };
