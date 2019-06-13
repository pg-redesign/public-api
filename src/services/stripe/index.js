const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_API_KEY);

module.exports = require("./stripeService")(stripe);
