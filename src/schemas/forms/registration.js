const enums = require("../enums");
const { student } = require("../types");

const { location, ...studentProperties } = student.properties;

// merges student and flattens student.location required
// removes "location" required field since it has been flattened
const studentRequired = [...student.required, ...location.required].filter(
  property => property !== "location",
);

module.exports = {
  type: "object",
  required: [...studentRequired, "mailingList", "paymentType", "courseId"],
  properties: {
    ...studentProperties,
    ...location.properties,
    mailingList: { type: "boolean" },
    courseId: { type: "string", pattern: "^\\d+$" },
    paymentType: { type: "string", enum: Object.values(enums.PaymentTypes) },
  },
};
