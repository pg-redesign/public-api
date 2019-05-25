module.exports = {
  type: "object",
  required: ["first_name", "last_name", "email", "company", "location"],
  properties: {
    first_name: { type: "string", maxLength: 24 },
    last_name: { type: "string", maxLength: 24 },
    email: { type: "string", format: "email", maxLength: 64 },
    company: { type: "string", maxLength: 24 },
    location: {
      required: ["city", "state", "country"],
      city: { type: "string", maxLength: 32 },
      state: { type: "string", maxLength: 32 },
      country: { type: "string", maxLength: 32 },
    },
  },
};
