/* eslint func-names:0 */
const { types } = require("../../schemas");
const { Course, CourseLocation } = require("../models");

const migrateLocations = async () => Course.query()
  .select()
  .then(courses => Promise.all(
    courses.map(async (course) => {
      // exit if there is no course location data (empty strings)
      if (!course.location.city) return null;

      const courseLocation = await CourseLocation.query().insert(
        course.location,
      );

      if (!courseLocation) {
        throw new Error("failed to migrate");
      }

      return course
        .$query()
        .patch({ course_location_id: courseLocation.id });
    }),
  ));

const reverseMigrateLocations = async () => CourseLocation.query()
  .select()
  .then(courseLocations => Promise.all(
    courseLocations.map(async (courseLocation) => {
      const {
        city, state, country, mapUrl,
      } = courseLocation;

      const courses = await courseLocation
        .$relatedQuery("courses")
        .select();

      const oldSchema = {
        ...types.course,
        required: types.course.required.concat("location"),
        properties: {
          ...types.course.properties,
          location: types.courseLocation,
        },
      };

      // reset to old Model state for validation
      Course.jsonSchema = oldSchema;
      Course.relationMappings = {};
      console.warn(
        "Course Model must have its JSON schema and relationMappings reset to old state",
      );

      return Promise.all(
        courses.map(course => course.$query().patch({
          location: {
            city,
            state,
            country,
            mapUrl,
          },
        })),
      );
    }),
  ));

exports.up = async function (knex) {
  // must provide the migration knex instance to the Models
  Course.knex(knex);
  CourseLocation.knex(knex);

  await knex.schema.table("courses", async (table) => {
    table
      .integer("course_location_id")
      .unsigned()
      .references("course_locations.id")
      .onDelete("CASCADE");
  });

  await migrateLocations();

  return knex.schema.table("courses", (table) => {
    table.dropColumn("location");
    table
      .integer("course_location_id")
      .notNullable()
      .alter();
  });
};

exports.down = async function (knex) {
  Course.knex(knex);
  CourseLocation.knex(knex);

  await knex.schema.table("courses", (table) => {
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
  });

  await reverseMigrateLocations();

  return knex.schema.table("courses", (table) => {
    table.dropColumn("course_location_id");
  });
};
