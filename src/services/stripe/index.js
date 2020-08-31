const Stripe = require("stripe");

const stripeClient = new Stripe(process.env.STRIPE_PRIVATE_KEY);

module.exports = require("./stripeService")(stripeClient);
