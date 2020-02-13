const getCoursesDoc = require("./getCoursesDoc");
const {
  buildCourseSheetTabName,
  buildCourseSheetTabColor,
} = require("./spreadsheet-utils");

/**
 * @returns {string} the sheetId of the new Course worksheet
 */
const createCourseSheet = async (sheetData, context) => {
  const { course } = sheetData;
  const { schemas } = context;

  const coursesDoc = await getCoursesDoc(context);

  const courseSheet = await coursesDoc.addWorksheet({
    title: buildCourseSheetTabName(course),
    tabColor: buildCourseSheetTabColor(course, schemas.enums),
    gridProperties: {
      rowCount: 1,
      columnCount: 1,
    },
  });

  return courseSheet.sheetId;
};

const getCourseSheet = async (course, context) => {
  const coursesDoc = await getCoursesDoc(context);

  return coursesDoc.sheetsById[course.sheetId];
};

module.exports = {
  getCourseSheet,
  createCourseSheet,
};
