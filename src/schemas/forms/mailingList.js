const { student } = require("../types");

const { firstName, lastName, email } = student.properties;

module.exports = {
  type: "object",
  required: ["email", "firstName", "lastName"],
  properties: {
    email,
    lastName,
    firstName,
  },
};
