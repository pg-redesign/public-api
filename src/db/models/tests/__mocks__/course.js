const { Course, CourseLocation } = require("../..");
const { CourseShortNames } = require("../../../../schemas/enums");

const pastYear = new Date().getFullYear() - 1;
const futureYear = new Date().getFullYear() + 1;

const courseMocks = [
  {
    course: {
      name: CourseShortNames.pollution,
      price: 1695,
      startDate: new Date(`October 24, ${futureYear}`).toISOString(),
      endDate: new Date(`October 31, ${futureYear}`).toISOString(),
    },
    location: {
      city: "Salem",
      state: "MA",
      country: "USA",
      mapUrl: "https://goo.gl/maps/c0d3",
    },
  },
  {
    course: {
      name: CourseShortNames.remediation,
      price: 300,
      startDate: new Date(`October 24, ${pastYear}`).toISOString(),
      endDate: new Date(`October 31, ${pastYear}`).toISOString(),
    },
    location: {
      city: "Princeton",
      state: "NJ",
      country: "USA",
      mapUrl: "https://goo.gl/maps/c0d3",
    },
  },
];

const cleanupLocationsAndCourses = () =>
  CourseLocation.query()
    .del()
    .then(() => Course.query().del());

const createLocationsAndCourses = async (seeds = courseMocks) => {
  await cleanupLocationsAndCourses();

  return Promise.all(
    seeds.map(async data => {
      const courseLocation = await CourseLocation.query().insert(data.location);
      return Course.query().insert({
        ...data.course,
        courseLocationId: courseLocation.id,
      });
    }),
  );
};

const getNextCourse = () =>
  Course.query()
    .where("startDate", ">", new Date())
    .first();

module.exports = {
  courseMocks,
  getNextCourse,
  createLocationsAndCourses,
  cleanupLocationsAndCourses,
};
