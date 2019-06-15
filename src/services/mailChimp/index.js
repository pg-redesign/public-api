const axios = require("axios").default;

const { MAILCHIMP_API_KEY } = process.env;
// the API region subdomain is the -xx# at the end of the API key
const regionSubdomain = MAILCHIMP_API_KEY.split("-")[1];

const mailChimp = axios.create({
  baseURL: `https://${regionSubdomain}.api.mailchimp.com/3.0`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    // basic auth requires Basic <base-64, user:api-key> format
    Authorization: "Basic ".concat(
      Buffer.from(`public_api:${MAILCHIMP_API_KEY}`).toString("base64"),
    ),
  },
});

module.exports = require("./mailChimpService")(mailChimp);
