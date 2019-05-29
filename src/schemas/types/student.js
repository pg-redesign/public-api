module.exports = {
  type: "object",
  required: ["firstName", "lastName", "email", "company", "location"],
  properties: {
    firstName: { type: "string", maxLength: 24 },
    lastName: { type: "string", maxLength: 24 },
    email: { type: "string", format: "email", maxLength: 64 },
    company: { type: "string", maxLength: 24 },
    location: {
      type: "object",
      required: ["city", "state", "country"],
      city: { type: "string", maxLength: 32 },
      state: { type: "string", maxLength: 32 },
      country: { type: "string", maxLength: 32 },
    },
  },
};
