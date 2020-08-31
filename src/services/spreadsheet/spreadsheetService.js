const getCoursesDoc = require("./getCoursesDoc");
const {
  buildCourseSheetTabName,
  buildCourseSheetTabColor,
  mergeStudentAndLocationProps,
  buildHeaderRowFromStudentSchema,
} = require("./spreadsheet-utils");

/**
 * @returns {string} the sheetId of the new Course worksheet
 */
const createCourseSheet = async (course, context) => {
  const { enums, types } = context.schemas;

  const coursesDoc = await getCoursesDoc(context);

  const courseSheet = await coursesDoc.addSheet({
    title: buildCourseSheetTabName(course),
    tabColor: buildCourseSheetTabColor(course, enums),
    headers: buildHeaderRowFromStudentSchema(types.student),
  });

  return courseSheet.sheetId;
};

const getCourseSheet = async (course, context) => {
  const coursesDoc = await getCoursesDoc(context);

  const courseSheet = coursesDoc.sheetsById[course.sheetId];
  if (!courseSheet) {
    throw new Error(
      `[Spreadsheet Service]: Course Sheet not found [id: ${course.id}, sheetId: ${course.sheetId}]`,
    );
  }

  return courseSheet;
};

const addStudentRow = async (course, student, context) => {
  const courseSheet = await getCourseSheet(course, context);
  const studentRowData = mergeStudentAndLocationProps(student);

  await courseSheet.addRow(studentRowData);
};

module.exports = {
  getCourseSheet,
  createCourseSheet,
  addStudentRow,
};
