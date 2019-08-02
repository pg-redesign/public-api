const { Query } = require("../queries");

describe("Query resolvers", () => {
  describe("getCourses", () => {
    const Course = {
      getAll: jest.fn(),
      getUpcoming: jest.fn(),
    };
    const context = { models: { Course } };

    test("default: returns all Courses ordered by start date descending", () => {
      Query.getCourses(null, {}, context);
      expect(Course.getAll).toHaveBeenCalled();
    });

    test("args.upcoming = true: returns up to 2 upcoming courses", () => {
      Query.getCourses(null, { upcoming: true }, context);
      expect(Course.getUpcoming).toHaveBeenCalled();
    });
  });

  test("getFormSchema: returns the JSON schema for the given form", () => {
    const forms = { formName: "schema" };
    const context = { schemas: { forms } };

    expect(Query.getFormSchema(null, { form: "formName" }, context)).toBe(
      forms.formName,
    );
  });

  test("getCourseLocations: returns a list of course locations", async () => {
    const CourseLocation = { getAll: jest.fn() };
    const context = { models: { CourseLocation } };

    await Query.getCourseLocations(null, {}, context);
    expect(CourseLocation.getAll).toHaveBeenCalled();
  });
});
