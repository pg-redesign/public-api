const constants = require("./constants");
const { handleError } = require("./email-utils");
const { renderCourseInvoice } = require("./renderers");

module.exports = emailClient => ({
  sendCourseInvoice: async (course, student, context) => {
    const { logger, services } = context;

    const paymentToken = await services.jwtPayload.createPaymentToken(
      course,
      student,
      context,
    );

    return emailClient
      .sendMail({
        to: student.email,
        from: constants.accounts.billing,
        subject: "Princeton Groundwater billing invoice",
        html: await renderCourseInvoice({ course, student, paymentToken }),
      })
      .catch(error =>
        handleError(logger, error, student.email, "course invoice"),
      );
  },
});
