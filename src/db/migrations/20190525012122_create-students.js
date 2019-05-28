/* eslint func-names:0 */

exports.up = function (knex) {
  return knex.schema.createTable("students", (table) => {
    table.increments();
    table.string("first_name", 24);
    table.string("last_name", 24);
    table.string("email", 64);
    table.string("company", 24);
    table
      .jsonb("location")
      .defaultTo(
        JSON.stringify({
          city: "",
          state: "",
          country: "",
        }),
      )
      .notNullable();

    table.unique("email");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("students");
};

// exports.config = { transaction: false };
