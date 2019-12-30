const { student } = require("../types");
const { PaymentOptions } = require("../enums");

const { location, ...studentProperties } = student.properties;

// merges student and flattens student.location required
// removes "location" required field since it has been flattened
const studentRequired = [...student.required, ...location.required].filter(
  property => property !== "location",
);

module.exports = {
  type: "object",
  required: [
    ...studentRequired,
    "company",
    "location",
    "courseId",
    "mailingList",
    "paymentOption",
  ],
  properties: {
    ...studentProperties,
    ...location.properties,
    mailingList: { type: "boolean" },
    courseId: { type: "string", pattern: "^\\d+$" },
    paymentOption: {
      type: "string",
      enum: Object.values(PaymentOptions),
    },
  },
};
