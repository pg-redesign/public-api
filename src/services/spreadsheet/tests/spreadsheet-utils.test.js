const { enums, types } = require("../../../schemas");
const {
  buildCourseSheetTabName,
  buildCourseSheetTabColor,
  mergeStudentAndLocationProps,
  buildHeaderRowFromStudentSchema,
} = require("../spreadsheet-utils");
const { studentData } = require("../../../db/models/tests/__mocks__/student");

const course = {
  name: enums.CourseShortNames.pollution,
  startDate: "Sun, 31 Oct 2021 00:00:00 GMT",
};

describe("Spreadsheet Service Utils", () => {
  describe("buildCourseSheetTabName()", () => {
    it("returns tab name using Course short name and start date", () => {
      const tabName = buildCourseSheetTabName(course);

      expect(tabName.includes(course.name)).toBe(true);
      // loose test for including year (gives flexibility to changing implementation format)
      expect(tabName).toMatch(/(2021|21)/); // YYYY or YY are included at minimum
    });

    it("works with startDate in Date format", () => {
      expect(() =>
        buildCourseSheetTabName({
          ...course,
          startDate: new Date(course.startDate),
        }),
      ).not.toThrow();
    });
  });

  describe("buildCourseSheetTabColor()", () => {
    it("returns the GoogleSpreadsheet formatted Color object for the Course type", () => {
      const tabColor = buildCourseSheetTabColor(course, enums);

      expect(tabColor).toEqual(enums.GoogleSheetTabColors[course.name]);
      // GoogleSpreadsheet Color Type properties
      ["red", "green", "blue", "alpha"].forEach(colorProperty =>
        expect(tabColor).toHaveProperty(colorProperty),
      );
    });
  });

  test("mergeStudentAndLocationProps(): merges student and student.location properties", () => {
    const mergedStudent = mergeStudentAndLocationProps(studentData);

    Object.keys(studentData.location).forEach(locationProperty =>
      expect(mergedStudent[locationProperty]).toBe(
        studentData.location[locationProperty],
      ),
    );
  });

  describe("buildHeaderRowFromStudentSchema()", () => {
    // will break if schema changes to enforce consistency
    const expectedHeaders = [
      "id",
      "email",
      "city",
      "state",
      "country",
      "mailingList",
      "firstName",
      "lastName",
      "company",
    ];

    it("returns a list of all Student schema properties with location flattened", () => {
      const studentHeaders = buildHeaderRowFromStudentSchema(types.student);
      expect(studentHeaders.length).toBe(expectedHeaders.length);
    });

    test("first two elements are ID and email", () => {
      const studentHeaders = buildHeaderRowFromStudentSchema(types.student);
      expect(studentHeaders[0]).toBe("id");
      expect(studentHeaders[1]).toBe("email");
    });
  });
});
