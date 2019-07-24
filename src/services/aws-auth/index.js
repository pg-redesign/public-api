const axios = require("axios").default;
const awsAuthService = require("./aws-auth-service");

const { AWS_COGNITO_DOMAIN } = process.env;

const awsAuth = axios.create({
  baseURL: `https://${AWS_COGNITO_DOMAIN}.amazoncognito.com/oauth2`,
});

module.exports = awsAuthService(awsAuth);