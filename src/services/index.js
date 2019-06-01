const Stripe = require("stripe");

const stripeService = require("./stripe");

const stripeInstance = new Stripe(process.env.STRIPE_API_KEY);

module.exports = {
  stripe: stripeService(stripeInstance),
};
