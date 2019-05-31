/* eslint func-names:0 */
const { courseShortNames } = require("../../utils/constants");

exports.up = function (knex) {
  return knex.schema.createTable("courses", (table) => {
    // creates column "id" as int not null auto increment primary
    table.increments("id"); // shorthand: table.increments();

    // foreign key against course_templates?
    // holds location, default price, discount, etc?

    table
      .enu("name", Object.values(courseShortNames), {
        useNative: true,
        enumName: "course_type",
      })
      .notNullable();

    table.date("start_date").notNullable();

    table.date("end_date").notNullable();

    table
      .integer("price")
      .defaultTo(1695)
      .notNullable();

    table
      .jsonb("location")
      .defaultTo(
        JSON.stringify({
          city: "",
          state: "",
          country: "",
          map_url: "",
        }),
      )
      .notNullable();

    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("courses");
};

// exports.config = { transaction: false };
