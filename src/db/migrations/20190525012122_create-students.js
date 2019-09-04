/* eslint func-names:0 */
const {
  email,
  company,
  firstName,
  lastName,
} = require("../../schemas").types.student.properties;

exports.up = function(knex) {
  return knex.schema.createTable("students", table => {
    table.increments();
    table.string("first_name", firstName.maxLength).notNullable();
    table.string("last_name", lastName.maxLength).notNullable();
    table.string("email", email.maxLength).notNullable();
    table.string("company", company.maxLength);
    table.jsonb("location").defaultTo(
      JSON.stringify({
        city: "",
        state: "",
        country: "",
      }),
    );

    table.unique("email");
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("students");
};

// exports.config = { transaction: false };
