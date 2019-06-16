const constants = require("../../utils/constants");
const { renderPugTemplate, buildCreditPaymentLink } = require("./email-utils");

const renderCourseInvoice = (course, student) => {
  const templateFilename = "course-invoice.pug";
  const courseName = constants.fullCourseNames[course.name];

  const templateData = {
    courseName,
    studentFirstName: student.firstName,
    contactEmail: constants.emailService.accounts.billing,
    creditPaymentLink: buildCreditPaymentLink(course, student),
    previewText: `Billing Invoice: Princeton Groundwater ${courseName}`,
  };

  return renderPugTemplate(templateFilename, templateData);
};

// TODO: complete implementation
const renderRegistrationComplete = (course, student) => {
  const templateFilename = "course-invoice.pug";
  const courseName = constants.fullCourseNames[course.name];

  const templateData = {
    courseName,
    studentFirstName: student.firstName,
  };

  return renderPugTemplate(templateFilename, templateData);
};

module.exports = {
  renderCourseInvoice,
  renderRegistrationComplete,
};
