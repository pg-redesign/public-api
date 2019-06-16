const pug = require("pug");
const path = require("path");

const constants = require("../../utils/constants");

const handleError = (logger, error, email, emailType) => {
  logger.error(`[Email Service]: failed sending [${emailType}] to [${email}]`);
  logger.error(error);
};

const buildCreditPaymentLink = (course, student, creditPaymentLink) => {
  if (!course.id) throw new Error("Missing course ID");
  if (!student.id) throw new Error("Missing student ID");
  if (!creditPaymentLink) throw new Error("Missing credit payment client url");

  return `${creditPaymentLink}?course=${course.id}&student=${student.id}`;
};

const renderPugTemplate = (filename, templateData) => {
  const basedir = path.join(__dirname, "templates");

  return pug.renderFile(path.join(basedir, filename), {
    basedir,
    filename,
    cache: true,
    // default contacts
    contactPhone: constants.emailService.phoneContact,
    contactEmail: constants.emailService.accounts.info,
    // template data, may overwrite default contacts
    ...templateData,
  });
};

module.exports = {
  handleError,
  renderPugTemplate,
  buildCreditPaymentLink,
};
