const { Course, CourseLocation } = require("../..");
const { courseInternalNames } = require("../../../../utils/constants");

const pastYear = new Date().getFullYear() - 1;
const futureYear = new Date().getFullYear() + 1;

const courseMocks = [
  {
    course: {
      name: courseInternalNames.pollution,
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
      name: courseInternalNames.remediation,
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

const cleanupLocationsAndCourses = () => CourseLocation.query()
  .del()
  .then(() => Course.query().del());

const createLocationsAndCourses = async (seeds = courseMocks) => {
  await cleanupLocationsAndCourses();

  return Promise.all(
    seeds.map(async (data) => {
      const courseLocation = await CourseLocation.query().insert(data.location);
      return Course.query().insert({
        ...data.course,
        courseLocationId: courseLocation.id,
      });
    }),
  );
};

module.exports = {
  courseMocks,
  createLocationsAndCourses,
  cleanupLocationsAndCourses,
};
