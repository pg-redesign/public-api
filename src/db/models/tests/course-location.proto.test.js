const CourseLocation = require("../course-location");
const { connection } = require("../../connection");
const {
  courseMocks,
  createLocationsAndCourses,
  cleanupLocationsAndCourses,
} = require("./__mocks__/course");

const [courseMock] = courseMocks;
const { course: courseData, location: locationData } = courseMock;

describe("CourseLocation proto methods", () => {
  beforeAll(() => createLocationsAndCourses());
  afterAll(async () => {
    await cleanupLocationsAndCourses();
    return connection.destroy();
  });

  describe("getCourses", () => {
    let courseLocation;
    beforeAll(async () => {
      courseLocation = await CourseLocation.getBy({
        city: locationData.city,
      });
    });
    it("returns all Courses related to the CourseLocation", async () => {
      const courses = await courseLocation.getCourses();
      expect(courses.length).toBe(1);
      expect(courses[0].name).toBe(courseData.name);
    });

    it("allows specific Course columns to be selected", async () => {
      const [course] = await courseLocation.getCourses(["id"]);
      expect(course.id).toBeDefined();
      expect(course.name).not.toBeDefined();
    });
  });
});
