const constants = require("../../utils/constants");
const { renderPugTemplate, buildCreditPaymentLink } = require("./email-utils");

const baseTemplateData = {
  contactPhone: constants.emailService.phoneContact,
  contactEmail: constants.emailService.accounts.registration,
};

const renderCourseInvoice = (course, student) => {
  const templateFilename = "course-invoice.pug";
  const courseName = constants.fullCourseNames[course.name];

  const templateData = {
    courseName,
    studentFirstName: student.firstName,
    creditPaymentLink: buildCreditPaymentLink(course, student),
    previewText: `Billing Invoice: Princeton Groundwater ${courseName}`,
    ...baseTemplateData,
  };

  return renderPugTemplate(templateFilename, templateData);
};

// TODO: complete implementation
const renderRegistrationComplete = (course, student) => {
  const templateFilename = "course-registration-complete.pug";
  const courseName = constants.fullCourseNames[course.name];

  const templateData = {
    courseName,
    studentFirstName: student.firstName,
    ...baseTemplateData,
  };

  return renderPugTemplate(templateFilename, templateData);
};

module.exports = {
  renderCourseInvoice,
  renderRegistrationComplete,
};
