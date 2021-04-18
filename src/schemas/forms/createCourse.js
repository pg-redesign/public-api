const { course } = require("../types");

module.exports = {
  ...course,
  required: [...course.required, "courseLocationId"],
  properties: {
    ...course.properties,
    courseLocationId: { type: "integer" },
  },
};
