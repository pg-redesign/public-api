const schemas = require("../../../schemas");
const secretsService = require("../../secrets"); // live test, spreadsheets too unknown to mock
const getCoursesDoc = require("../getCoursesDoc");
const { createCourseSheet, getCourseSheet, addStudentRow } = require("..");
const { studentData } = require("../../../db/models/tests/__mocks__/student");

/**
 * @param {GoogleSpreadsheet} coursesDoc
 */
const buildTestUtils = coursesDoc => {
  const resetCoursesDoc = () =>
    Promise.all(
      coursesDoc.sheetsByIndex.map(
        // cant delete first sheet (default)
        (sheet, index) => index > 0 && sheet.delete(),
      ),
    );

  const deleteCourseWorksheet = sheetId =>
    coursesDoc.sheetsById[sheetId].delete();

  return {
    resetCoursesDoc,
    deleteCourseWorksheet,
  };
};

const context = {
  schemas,
  env: process.env,
  services: { secrets: secretsService },
};

const course = {
  name: schemas.enums.CourseShortNames.pollution,
  startDate: "Sun, 31 Oct 2021 00:00:00 GMT",
};

describe("SpreadSheet Service", () => {
  let testUtils = null;

  beforeAll(async () => {
    const coursesDoc = await getCoursesDoc(context);
    testUtils = buildTestUtils(coursesDoc);
  });

  describe("createCourseSheet()", () => {
    let sheetId;
    let courseSheet;
    beforeAll(async () => {
      await testUtils.resetCoursesDoc();

      sheetId = await createCourseSheet(course, context);

      const coursesDoc = await getCoursesDoc(context); // get reloaded doc
      courseSheet = coursesDoc.sheetsById[sheetId];
    });

    it("creates a new Course sheet and returns its sheetId", async () => {
      expect(sheetId).toBeDefined();
      expect(courseSheet).toBeDefined(); // confirm sheet was created
    });

    it("sets header row column values", async () => {
      expect(courseSheet.headerValues).toBeDefined();
    });
  });

  describe("getCourseSheet()", () => {
    let courseSheet;
    beforeAll(async () => {
      await testUtils.resetCoursesDoc();

      const sheetId = await createCourseSheet(course, context);

      courseSheet = await getCourseSheet({ ...course, sheetId }, context);
    });

    it("returns the course's Sheet object", async () => {
      expect(courseSheet).toBeDefined();
      expect(courseSheet.title.includes(course.name)).toBe(true);
    });

    it("throws if Course Sheet is not found", () =>
      expect(
        getCourseSheet({ ...course, sheetId: "nonexistent id" }, context),
      ).rejects.toThrow());
  });

  describe("addStudentRow()", () => {
    const courseWithSheetId = {
      ...course,
      sheetId: null,
    };

    let courseSheet;
    beforeAll(async () => {
      await testUtils.resetCoursesDoc();

      const sheetId = await createCourseSheet(course, context);
      courseWithSheetId.sheetId = sheetId;

      courseSheet = await getCourseSheet(courseWithSheetId, context);
    });

    it("first student: appends a new student data row", async () => {
      const firstStudent = { id: 1, ...studentData };

      await addStudentRow(courseWithSheetId, firstStudent, context);
      const rows = await courseSheet.getRows();

      expect(rows.length).toBe(1); // header row is excluded, 0 based index from first non-header row
      // convert to number for comparison
      expect(+rows[0].id).toBe(firstStudent.id);
    });

    it("flattens student.location properties in student data row", async () => {
      const rows = await courseSheet.getRows();

      ["city", "state", "country"].forEach(locationProperty => {
        expect(rows[0][locationProperty]).toBe(
          studentData.location[locationProperty],
        );
      });
    });

    it("subsequent student: appends a new student data row", async () => {
      const subsequentStudent = { id: 2, ...studentData };

      await addStudentRow(courseWithSheetId, subsequentStudent, context);
      const rows = await courseSheet.getRows();

      expect(rows.length).toBe(2);
      expect(+rows[1].id).toBe(subsequentStudent.id);
    });
  });
});
