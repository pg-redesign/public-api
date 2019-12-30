const fs = require("fs");
const jwt = require("jsonwebtoken");

const { PAYLOAD_PRIVATE_KEY_PATH, API_HOST } = process.env;

const issuer = API_HOST;
const privateKey = fs.readFileSync(PAYLOAD_PRIVATE_KEY_PATH);

const create = config => {
  const { data, ...configOptions } = config;

  const options = {
    ...configOptions,
    issuer,
    algorithm: "RS256",
  };

  return jwt.sign({ data }, privateKey, options);
};

module.exports = {
  create,
};
