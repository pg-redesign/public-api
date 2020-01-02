const Stripe = require("stripe");

const stripeClient = new Stripe(process.env.STRIPE_API_KEY);

module.exports = require("./stripeService")(stripeClient);
