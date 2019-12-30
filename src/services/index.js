const email = require("./email");
const stripe = require("./stripe");
const awsAuth = require("./aws-auth");
const mailChimp = require("./mailChimp");
const authToken = require("./auth-token");
const jwtPayload = require("./jwt-payload");

module.exports = {
  email,
  stripe,
  awsAuth,
  mailChimp,
  authToken,
  jwtPayload,
};
