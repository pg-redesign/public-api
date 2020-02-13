const buildCourseSheetTabName = course => {
  const { name, startDate } = course;

  const date = new Date(startDate);

  // month is 0 based, add 1
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  // fix month to 2 digits
  const formattedDate = `${month < 10 ? `0${month}` : month}/${year}`;

  return `${name}: ${formattedDate}`;
};

const buildCourseSheetTabColor = (course, enums) => {
  const { GoogleSheetTabColors } = enums;

  return GoogleSheetTabColors[course.name];
};

/**
 * merges student and student.location properties
 * @param {Student} student
 */
const mergeStudentWithLocation = student => {
  const { location, ...otherProperties } = student;

  return { ...otherProperties, ...location };
};

module.exports = {
  buildCourseSheetTabName,
  buildCourseSheetTabColor,
  mergeStudentWithLocation,
};
