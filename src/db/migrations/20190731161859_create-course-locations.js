/* eslint func-names:0 */
const {
  city,
  state,
  mapUrl,
  country,
} = require("../../schemas").types.courseLocation.properties;

exports.up = function (knex) {
  return knex.schema.createTable("course_locations", (table) => {
    table.increments();
    table.string("city", city.maxLength).notNullable();
    table.string("state", state.maxLength).notNullable();
    table.string("country", country.maxLength).notNullable();
    table.string("map_url", mapUrl.maxLength).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("course_locations");
};

// exports.config = { transaction: false };
