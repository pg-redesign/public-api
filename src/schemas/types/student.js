const location = require("./location");

module.exports = {
  type: "object",
  required: ["firstName", "lastName", "email", "company", "location"],
  properties: {
    location,
    firstName: { type: "string", minLength: 2, maxLength: 24 },
    lastName: { type: "string", minLength: 2, maxLength: 24 },
    company: { type: "string", minLength: 3, maxLength: 32 },
    email: { type: "string", format: "email", maxLength: 64 },
  },
};
