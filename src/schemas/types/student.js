const locationBase = require("./location-base");

module.exports = {
  type: "object",
  required: ["firstName", "lastName", "email"],
  properties: {
    location: locationBase,
    mailingList: { type: "boolean" },
    firstName: { type: "string", minLength: 2, maxLength: 24 },
    lastName: { type: "string", minLength: 2, maxLength: 24 },
    company: { type: "string", minLength: 3, maxLength: 32 },
    email: { type: "string", format: "email", maxLength: 64 },
  },
};
