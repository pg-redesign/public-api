const constants = require("./constants");
const { handleError } = require("./email-utils");
const {
  renderCourseInvoice,
  renderRegistrationComplete,
} = require("./renderers");

module.exports = emailClient => ({
  sendCourseInvoice: async (course, student, context) => {
    const { logger, services } = context;

    // TODO: implement file service -> { filename, content }
    const invoiceFile = await services.file.generateInvoice(course, student);

    return emailClient
      .sendMail({
        to: student.email,
        from: constants.accounts.billing,
        subject: "Princeton Groundwater billing invoice",
        html: renderCourseInvoice(course, student),
        attachments: [invoiceFile],
      })
      .catch(error =>
        handleError(logger, error, student.email, "course invoice"),
      );
  },

  sendRegistrationComplete: async (course, student, context) => {
    const { logger } = context;

    try {
      await emailClient.sendMail({
        to: student.email,
        from: constants.accounts.registration,
        subject: "Princeton Groundwater course registration complete",
        html: renderRegistrationComplete(course, student),
      });
    } catch (error) {
      handleError(logger, error, student.email, "registration complete");
    }
  },
});
