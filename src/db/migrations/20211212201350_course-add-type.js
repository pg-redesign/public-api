/* eslint func-names:0 */
const { CourseTypes } = require("../../schemas/enums");

exports.up = function (knex) {
  return knex.schema.table("courses", table => {
    table
      .enu("type", Object.values(CourseTypes), {
        useNative: true,
        enumName: "course_delivery_type",
      })
      .notNullable()
      .defaultTo(CourseTypes.liveOnline);

    // remove location requirement for online
    table
      .integer("course_location_id")
      .nullable()
      .alter();
  });
};

exports.down = function (knex) {
  return knex.schema.table("courses", table => {
    table.dropColumn("type");
  });
};

// exports.config = { transaction: false };
