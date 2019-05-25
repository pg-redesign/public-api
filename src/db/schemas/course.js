module.exports = {
  type: "object",
  required: ["name", "price", "start_date", "end_date", "location"],
  properties: {
    name: { type: "string", maxLength: 24 },
    price: { type: "integer" },
    start_date: { type: "string", format: "date-time" },
    end_date: { type: "string", format: "date-time" },
    location: {
      required: ["city", "state", "country", "map_url"],
      city: { type: "string", maxLength: 32 },
      state: { type: "string", maxLength: 32 },
      country: { type: "string", maxLength: 32 },
      map_url: { type: "string" },
    },
  },
};
