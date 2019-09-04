/* eslint func-names:0 */

exports.up = function(knex) {
  return knex.schema.createTable("admins", table => {
    table.increments();
    table.string("sub", 64);
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("admins");
};

// exports.config = { transaction: false };
