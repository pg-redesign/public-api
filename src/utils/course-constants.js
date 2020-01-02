const { CourseShortNames } = require("../schemas/enums");

// full course name
const fullCourseNames = {
  [CourseShortNames.pollution]: "The Pollution & Hydrology Course",
  [CourseShortNames.remediation]: "The Remediation Course",
};

/* eslint max-len:0 */
/**
 * node -e 'console.log(JSON.stringify(Array(12).fill().reduce((months, _, num) => ({...months,[num]:{ENGLISH:"", PORTUGUESE:""}}), {})))' | python -m json.tool
 */
const months = {
  0: {
    ENGLISH: "January",
    PORTUGUESE: "janeiro",
  },
  1: {
    ENGLISH: "February",
    PORTUGUESE: "fevereiro",
  },
  2: {
    ENGLISH: "March",
    PORTUGUESE: "março",
  },
  3: {
    ENGLISH: "April",
    PORTUGUESE: "abril",
  },
  4: {
    ENGLISH: "May",
    PORTUGUESE: "maio",
  },
  5: {
    ENGLISH: "June",
    PORTUGUESE: "junho",
  },
  6: {
    ENGLISH: "July",
    PORTUGUESE: "julho",
  },
  7: {
    ENGLISH: "August",
    PORTUGUESE: "agosto",
  },
  8: {
    ENGLISH: "September",
    PORTUGUESE: "setembro",
  },
  9: {
    ENGLISH: "October",
    PORTUGUESE: "outubro",
  },
  10: {
    ENGLISH: "November",
    PORTUGUESE: "novembro",
  },
  11: {
    ENGLISH: "December",
    PORTUGUESE: "dezembro",
  },
};

module.exports = {
  months,
  fullCourseNames,
};
