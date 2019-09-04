const { Course, CourseLocation } = require("../models");
const {
  createLocationsAndCourses,
  cleanupLocationsAndCourses,
} = require("../models/tests/__mocks__/course");

exports.seed = async knex => {
  Course.knex(knex);
  CourseLocation.knex(knex);

  return cleanupLocationsAndCourses().then(() => createLocationsAndCourses());
};
