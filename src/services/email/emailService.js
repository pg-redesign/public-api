const constants = require("./constants");
const { handleError } = require("./email-utils");
const { renderCourseInvoice } = require("./renderers");

module.exports = emailClient => ({
  sendCourseInvoice: async (course, student, context) => {
    const { logger } = context;

    return emailClient
      .sendMail({
        to: student.email,
        from: constants.accounts.billing,
        html: await renderCourseInvoice(course, student, context),
        subject: "Princeton Groundwater billing invoice",
      })
      .catch(error =>
        handleError(logger, error, student.email, "course invoice"),
      );
  },
});
