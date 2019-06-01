const location = require("./location");
const { courseInternalNames } = require("../../utils/constants");

module.exports = {
  type: "object",
  required: ["name", "price", "startDate", "endDate", "location"],
  properties: {
    price: { type: "integer" },
    startDate: { type: "string", format: "date-time" },
    endDate: { type: "string", format: "date-time" },
    name: { type: "string", enum: Object.values(courseInternalNames) },
    location: {
      ...location,
      required: [...location.required, "mapURL"],
      properties: {
        ...location.properties,
        mapURL: { type: "string" },
      },
    },
  },
};
