const { CourseShortNames, CourseTypes } = require("../enums");

module.exports = {
  type: "object",
  required: ["name", "price", "startDate", "endDate", "type"],
  properties: {
    price: { type: "integer" },
    startDate: { type: "string", format: "date-time" },
    endDate: { type: "string", format: "date-time" },
    name: { type: "string", enum: Object.values(CourseShortNames) },
    type: { type: "string", enum: Object.values(CourseTypes) },
  },
};
