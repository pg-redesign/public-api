const typeResolvers = require("../types");

describe("Course Type resolvers", () => {
  const { Course } = typeResolvers;

  describe("Course.date", () => {
    const courseDateRange = jest.fn();
    const endDate = new Date("October 31, 2020");
    const startDate = new Date("October 31, 1989");

    const course = { startDate, endDate };
    const args = { language: "ENGLISH" };
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
      Course.date(course, { language: "PORTUGUESE" }, context);
      expect(courseDateRange).toHaveBeenCalledWith(
        course.startDate,
        course.endDate,
        "PORTUGUESE",
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
    const course = { name: "POLLUTION" };
    const fullCourseNames = {
      POLLUTION: "pollution course name",
      REMEDIATION: "remediation course name",
    };
    const context = { utils: { constants: { fullCourseNames } } };

    test("default: returns formatted full course name", () => {
      expect(Course.name(course, {}, context)).toBe(fullCourseNames.POLLUTION);
    });

    test("args.short = true: returns shorthand internal name", () => {
      expect(Course.name(course, { short: true }, context)).toBe(course.name);
    });
  });
});
