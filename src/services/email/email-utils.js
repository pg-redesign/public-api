const constants = require("./constants");

const handleError = (logger, error, email, emailType) => {
  logger.error(`[Email Service]: failed sending [${emailType}] to [${email}]`);
  logger.error(error);
};

const buildCreditPaymentLink = (course, student, context) => {
  const { services } = context;

  const creditPaymentBase = constants.siteLinks.creditPayment;

  const registrationCode = services.jwtPayload.create({
    audience: "client",
    subject: "registration",
    data: {
      courseId: course.id,
      email: student.email,
      studentId: student.id,
    },
  });

  return `${creditPaymentBase}/${registrationCode}`;
};

module.exports = {
  handleError,
  buildCreditPaymentLink,
};
