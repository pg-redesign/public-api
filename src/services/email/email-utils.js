const constants = require("./constants");

const handleError = (logger, error, email, emailType) => {
  logger.error(`[Email Service]: failed sending [${emailType}] to [${email}]`);
  logger.error(error);
};

const buildCreditPaymentLink = paymentToken => {
  const creditPaymentBase = constants.siteLinks.creditPayment;

  return `${creditPaymentBase}/${paymentToken}`;
};

module.exports = {
  handleError,
  buildCreditPaymentLink,
};
