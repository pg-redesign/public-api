const { Course, CourseLocation } = require("../models");
const courseMocks = require("../models/tests/__mocks__/course");

const createLocationsAndCourses = seeds => Promise.all(
  seeds.map(async (data) => {
    const courseLocation = await CourseLocation.query().insert(data.location);
    return Course.query().insert({
      ...data.course,
      course_location_id: courseLocation.id,
    });
  }),
);

exports.seed = async (knex) => {
  Course.knex(knex);
  CourseLocation.knex(knex);

  await Course.query().del();
  await CourseLocation.query().del();

  return createLocationsAndCourses(courseMocks);
};
