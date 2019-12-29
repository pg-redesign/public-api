const ejs = require("ejs");
const path = require("path");

/**
 * renders the template in templates/ dir by its name
 * @param {string} templateFileName template file name (from templates/names.js)
 * @param {{}} templateData object of template data to be injected
 */
const renderTemplate = (templateFileName, templateData) =>
  ejs.renderFile(path.join(__dirname, templateFileName), templateData);

module.exports = renderTemplate;
