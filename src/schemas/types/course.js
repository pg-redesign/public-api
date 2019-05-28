module.exports = {
  type: "object",
  required: ["name", "price", "startDate", "endDate", "location"],
  properties: {
    name: { type: "string", maxLength: 24 },
    price: { type: "integer" },
    startDate: { type: "string", format: "date-time" },
    endDate: { type: "string", format: "date-time" },
    location: {
      type: "object",
      required: ["city", "state", "country", "mapURL"],
      city: { type: "string", maxLength: 32 },
      state: { type: "string", maxLength: 32 },
      country: { type: "string", maxLength: 32 },
      mapURL: { type: "string" },
    },
  },
};
