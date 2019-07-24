const jwt = require("jsonwebtoken");

const signAdminToken = (admin, context) => {
  const { AUTH_TOKEN_SIGNING_SECRET, API_DOMAIN } = context.env;

  const payload = { sub: admin.id };
  const options = {
    expiresIn: "1h",
    issuer: API_DOMAIN,
    algorithm: "HS256",
  };

  const token = jwt.sign(payload, AUTH_TOKEN_SIGNING_SECRET, options);

  return { token, expiresIn: options.expiresIn };
};

const verifyToken = (token, context) => {
  const { AUTH_TOKEN_SIGNING_SECRET, API_DOMAIN } = context.env;

  return jwt.verify(token, AUTH_TOKEN_SIGNING_SECRET, {
    iss: API_DOMAIN,
    algorithms: ["HS256"],
  });
};

module.exports = {
  signAdminToken,
  verifyToken,
};
