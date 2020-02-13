const schemas = require("../../../schemas");
const secretsService = require("../../secrets"); // live test, spreadsheets too unknown to mock
const getCoursesDoc = require("../getCoursesDoc");
const { createCourseSheet, getCourseSheet } = require("..");

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

const context = { env: process.env, services: { secrets: secretsService } };

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

  beforeEach(() => testUtils.resetCoursesDoc());

  test("createCourseSheet(): creates a new Course sheet and returns its sheetId", async () => {
    const courseSheetId = await createCourseSheet(
      { course },
      { ...context, schemas },
    );

    expect(courseSheetId).toBeDefined();

    const doc = await getCoursesDoc(context); // get reloaded doc
    expect(doc.sheetsById[courseSheetId]).toBeDefined(); // confirm sheet was created
  });

  test("getCourseSheet(): returns the Course's associated GoogleSpreadsheetWorksheet object", async () => {
    const sheetId = await createCourseSheet(
      { course },
      { ...context, schemas },
    );

    const courseSheet = await getCourseSheet({ ...course, sheetId }, context);

    expect(courseSheet).toBeDefined();
    expect(courseSheet.title.includes("POLLUTION")).toBe(true);
  });
});
