const jwt = require("jsonwebtoken");

const signAdminToken = (adminSubId, context) => {
  const { AUTH_TOKEN_SIGNING_SECRET, API_DOMAIN } = context.env;

  const payload = { sub: adminSubId };
  const options = {
    expiresIn: 3600,
    issuer: API_DOMAIN,
    algorithm: "HS256",
  };

  const token = jwt.sign(payload, AUTH_TOKEN_SIGNING_SECRET, options);

  return { token, expiresIn: options.expiresIn };
};

const verifyToken = (token, context) => {
  const { AUTH_TOKEN_SIGNING_SECRET, API_DOMAIN } = context.env;

  try {
    return jwt.verify(token, AUTH_TOKEN_SIGNING_SECRET, {
      iss: API_DOMAIN,
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
