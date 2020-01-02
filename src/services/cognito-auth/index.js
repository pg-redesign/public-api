const axios = require("axios").default;

const { AWS_COGNITO_HOST } = process.env;

// TODO: refactor to use AWS SDK
const cognitoClient = axios.create({
  baseURL: `https://${AWS_COGNITO_HOST}.amazoncognito.com/oauth2`,
});

module.exports = require("./cognitoAuthService")(cognitoClient);
