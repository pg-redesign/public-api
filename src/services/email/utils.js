const pug = require("pug");
const path = require("path");

const constants = require("../../utils/constants");

const handleError = (logger, error, email, emailType) => {
  logger.error(`[Email Service]: failed sending [${emailType}] to [${email}]`);
  logger.error(error);
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
};
