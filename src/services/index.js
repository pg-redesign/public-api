const stripeService = require("./stripe");
const mailChimpService = require("./mailChimp");

module.exports = {
  stripe: stripeService,
  mailChimp: mailChimpService,
};
