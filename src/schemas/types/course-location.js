const locationBase = require("./location-base");

module.exports = {
  type: "object",
  required: locationBase.required.concat("mapUrl"),
  properties: {
    ...locationBase.properties,
    mapUrl: {
      type: "string",
      maxLength: 64,
      /* prettier-ignore */
      /* eslint-disable no-useless-escape */
      pattern: "^(https:\/\/goo\.gl\/maps\/)[A-Za-z0-9]+$",
    },
  },
};
