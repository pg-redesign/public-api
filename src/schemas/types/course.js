const { CourseShortNames, CourseTypes } = require("../enums");

module.exports = {
  type: "object",
  required: ["name", "price", "startDate", "endDate", "type"],
  properties: {
    price: { type: "integer" },
    startDate: { type: "string", format: "date-time" },
    endDate: { type: "string", format: "date-time" },
    customDateString: {
      type: "string",
      // Month DD-DD and Month DD-DD, YYYY
      // Month can be 3-5 chars long (May, Nov, Oct, June, April etc)
      // ex: May 14-18 and May 21-24, 2022
      pattern:
        "^[A-Z][a-z]{2,4} \\d{1,2}-\\d{1,2} and [A-Z][a-z]{2,4} \\d{1,2}-\\d{1,2}, \\d{4}$",
    },
    name: { type: "string", enum: Object.values(CourseShortNames) },
    type: { type: "string", enum: Object.values(CourseTypes) },
  },
};
