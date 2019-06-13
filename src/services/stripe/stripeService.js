const Stripe = require("stripe");
const constants = require("../../utils/constants");

module.exports = stripe => ({
  /**
   * Creates a Stripe payment charge for the student
   * @param {{ id: number, price: number, name: string }} course
   * @param {{ receiptEmail: string, studentId: number, tokenId: string }} paymentData
   * @returns {string} paymentId
   */
  createCharge: async (course, paymentData) => {
    const { receiptEmail, studentId, tokenId } = paymentData;

    const charge = await stripe.charges.create({
      currency: "usd",
      source: tokenId,
      amount: course.price * 100, // in USD cents
      receipt_email: receiptEmail,
      description: constants.stripeService.paymentDescription(course),
      metadata: {
        studentId,
        courseId: course.id,
      },
    });

    if (!charge.id) {
      throw new Stripe.errors.StripeCardError({
        message: charge.failure_message || "Payment failed",
      });
    }

    return charge.id;
  },
});
