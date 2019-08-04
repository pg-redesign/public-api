const utils = require("../../../utils");
const { Course } = require("../types");
const schemas = require("../../../schemas");

describe("Course Type resolvers", () => {
  describe("Course.date", () => {
    const courseDateRange = jest.fn();
    const endDate = new Date("October 31, 2020");
    const startDate = new Date("October 31, 1989");

    const course = { startDate, endDate };
    const args = { language: schemas.enums.LanguageTypes.english };
    const context = {
      utils: { format: { courseDateRange } },
    };

    test("default: returns english date range format", () => {
      Course.date(course, args, context);
      expect(courseDateRange).toHaveBeenCalledWith(
        course.startDate,
        course.endDate,
        args.language,
      );
    });

    test("args.language = PORTUGUESE: returns portuguese date range format", () => {
      Course.date(
        course,
        { language: schemas.enums.LanguageTypes.portuguese },
        context,
      );
      expect(courseDateRange).toHaveBeenCalledWith(
        course.startDate,
        course.endDate,
        schemas.enums.LanguageTypes.portuguese,
      );
    });

    test("args.start = true: returns start date as UTC string", () => {
      const expected = startDate.toUTCString();
      expect(Course.date(course, { start: true }, context)).toBe(expected);
    });

    test("args.end = true: returns end date as UTC string", () => {
      const expected = endDate.toUTCString();
      expect(Course.date(course, { end: true }, context)).toBe(expected);
    });

    test("args.start and args.end: returns start date as UTC string", () => {
      const expected = startDate.toUTCString();
      const result = Course.date(course, { start: true, end: true }, context);
      expect(result).toBe(expected);
    });
  });

  describe("Course.name", () => {
    const course = { name: schemas.enums.CourseShortNames.pollution };
    const context = { utils };

    test("default: returns formatted full course name", () => {
      expect(Course.name(course, {}, context)).toBe(
        utils.constants.fullCourseNames.POLLUTION,
      );
    });

    test("args.short = true: returns shorthand internal name", () => {
      expect(Course.name(course, { short: true }, context)).toBe(course.name);
    });
  });

  test("Course.description: returns description for the course type (name)", () => {
    const shortName = schemas.enums.CourseShortNames.pollution;
    const course = { name: shortName };
    const context = { utils };

    expect(Course.description(course, null, context)).toEqual(
      utils.constants.courseDescriptions[shortName],
    );
  });

  describe("Course.location", () => {
    const course = { getLocation: jest.fn() };

    test("returns the associated CourseLocation", async () => {
      await Course.location(course);
      expect(course.getLocation).toHaveBeenCalled();
    });
  });

  describe("Course.students", () => {
    const args = { paymentFilters: {} };
    const course = { getStudents: jest.fn() };

    it("returns a list of registered Students with optional payment filters", async () => {
      await Course.students(course, args);
      expect(course.getStudents).toHaveBeenCalledWith(args);
    });
  });

  describe("Course.payments", () => {
    const args = { paymentFilters: {} };
    const course = { getPayments: jest.fn() };

    it("returns a list of Course Payments with optional payment filters", async () => {
      await Course.payments(course, args);
      expect(course.getPayments).toHaveBeenCalledWith(args);
    });
  });
});
