const Stripe = require("stripe");
const { fullCourseNames } = require("../../utils").courseConstants;

module.exports = stripeClient => ({
  /**
   * Creates a Stripe payment charge for the student
   * @param {{ id: number, price: number, name: string }} course
   * @param {{ receiptEmail: string, studentId: number, tokenId: string }} paymentData
   * @returns {string} paymentId
   */
  createCharge: async (course, paymentData) => {
    const { receiptEmail, studentId, tokenId } = paymentData;

    const charge = await stripeClient.charges.create({
      currency: "usd",
      source: tokenId,
      amount: course.price * 100, // in USD cents
      receipt_email: receiptEmail,
      description: `${fullCourseNames[course.name]} registration`,
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
