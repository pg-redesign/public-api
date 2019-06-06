const { student } = require("../types");

module.exports = {
  type: "object",
  required: ["firstName", "lastName", "receiptEmail"],
  properties: {
    firstName: student.properties.firstName,
    lastName: student.properties.lastName,
    receiptEmail: { type: "string", format: "email" },
  },
};
