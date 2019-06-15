const renderers = require("./renderers");
const constants = require("../../utils/constants").emailService;

const handleError = (logger, error, email, emailType) => {
  logger.error(`[Email Service]: failed sending [${emailType}] to [${email}]`);
  logger.error(error);
};

const emailService = emailClient => ({
  sendCourseInvoice: async (course, student, context) => {
    const { logger, services } = context;

    // { filename, content }
    const invoiceFile = await services.file.generateInvoice(course, student);

    return emailClient
      .sendMail({
        to: student.email,
        from: constants.accounts.billing,
        subject: "Princeton Groundwater billing invoice",
        html: renderers.renderCourseInvoice(course, student),
        attachments: [invoiceFile],
      })
      .catch(error => handleError(logger, error, student.email, "course invoice"));
  },

  sendRegistrationComplete: async (course, student, context) => {
    const { logger } = context;

    return emailClient
      .sendMail({
        to: student.email,
        from: constants.accounts.info,
        subject: "Princeton Groundwater course registration complete",
        html: renderers.renderRegistrationComplete(course, student),
      })
      .catch(error => handleError(logger, error, student.email, "registration complete"));
  },
});

module.exports = {
  handleError,
  emailService,
};
