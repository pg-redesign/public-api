const jwt = require("jsonwebtoken");

const signAdminToken = (adminSubId, context) => {
  const { AUTH_TOKEN_SIGNING_SECRET, API_HOST } = context.env;

  const payload = { sub: adminSubId };
  const options = {
    expiresIn: 3600,
    issuer: API_HOST,
    algorithm: "HS256",
  };

  const token = jwt.sign(payload, AUTH_TOKEN_SIGNING_SECRET, options);

  return { token, expiresIn: options.expiresIn };
};

const verifyToken = (token, context) => {
  const { AUTH_TOKEN_SIGNING_SECRET, API_HOST } = context.env;

  try {
    return jwt.verify(token, AUTH_TOKEN_SIGNING_SECRET, {
      iss: API_HOST,
      algorithms: ["HS256"],
    });
  } catch (error) {
    return null;
  }
};

module.exports = {
  signAdminToken,
  verifyToken,
};
