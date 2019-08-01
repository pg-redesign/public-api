module.exports = {
  type: "object",
  required: ["city", "state", "country"],
  properties: {
    city: { type: "string", minLength: 3, maxLength: 32 },
    state: { type: "string", minLength: 2, maxLength: 32 },
    country: { type: "string", minLength: 2, maxLength: 32 },
  },
};
