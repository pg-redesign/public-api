const ejs = require("ejs");
const path = require("path");

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

/**
 * renders the template in templates/ dir by its name
 * @param {string} templateFileName template file name (from templates/names.js)
 * @param {{}} templateData object of template data to be injected
 */
const renderTemplate = (templateFileName, templateData) => {
  const basedir = path.join(__dirname, "templates");

  return ejs.renderFile(
    path.join(basedir, `${templateFileName}.ejs`),
    templateData,
  );
};

module.exports = {
  handleError,
  renderTemplate,
  buildCreditPaymentLink,
};
