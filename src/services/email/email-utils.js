const constants = require("./constants");

const handleError = (logger, error, email, emailType) => {
  logger.error(`[Email Service]: failed sending [${emailType}] to [${email}]`);
  logger.error(error);
};

// TODO: implement support in client
const buildCreditPaymentLink = (course, student) => {
  if (!course.id) throw new Error("Missing course ID");
  if (!student.id) throw new Error("Missing student ID");

  const creditPaymentBase = constants.siteLinks.creditPayment;

  // use student email instead of exposing id?
  return `${creditPaymentBase}?course=${course.id}&student=${student.id}`;
};

module.exports = {
  handleError,
  buildCreditPaymentLink,
};
