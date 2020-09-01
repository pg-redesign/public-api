const buildCourseSheetTabName = course => {
  const { name, startDate } = course;

  const date = new Date(startDate);

  // month is 0 based, add 1
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  // fix month to 2 digits
  const formattedDate = `${month < 10 ? `0${month}` : month}/${year}`;

  return `${name} ${formattedDate}`;
};

const buildCourseSheetTabColor = (course, enums) => {
  const { GoogleSheetTabColors } = enums;

  return GoogleSheetTabColors[course.name];
};

/**
 * merges student and student.location properties
 * @param {Student} student
 */
const mergeStudentAndLocationProps = student => {
  const { location, ...otherProps } = student;

  return { ...otherProps, ...location };
};

/**
 * builds Course Sheet header column values
 * @param {{}} schemaTypes
 */
const buildHeaderRow = schemaTypes => {
  const { student, payment } = schemaTypes;
  const { id, email, location, ...studentProps } = student.properties;

  return [
    "id",
    "email",
    ...Object.keys(studentProps),
    ...Object.keys(payment.properties),
    ...Object.keys(location.properties),
  ];
};

module.exports = {
  buildCourseSheetTabName,
  buildCourseSheetTabColor,
  mergeStudentAndLocationProps,
  buildHeaderRow,
};
