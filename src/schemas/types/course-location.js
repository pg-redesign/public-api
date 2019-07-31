module.exports = {
  type: "object",
  required: ["city", "state", "country", "mapURL"],
  properties: {
    city: { type: "string", minLength: 3, maxLength: 32 },
    state: { type: "string", minLength: 2, maxLength: 32 },
    country: { type: "string", minLength: 2, maxLength: 32 },
    /* prettier-ignore */
    /* eslint-disable no-useless-escape */
    mapURL: { type: "string", pattern: "/^(https:\/\/goo\.gl\/maps\/)[A-Za-z0-9]+$/" },
  },
};
