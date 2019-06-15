const { renderPugTemplate } = require("./utils");
const constants = require("../../utils/constants");

const renderCourseInvoice = (course, student) => {
  const templateFilename = "course-invoice.pug";
  const courseName = constants.fullCourseNames[course.name];

  const templateData = {
    courseName,
    studentFirstName: student.firstName,
    contactEmail: constants.emailService.accounts.billing,
    previewText: `Billing Invoice: Princeton Groundwater ${courseName}`,
    creditPaymentLink: constants.emailService.links.creditPayment(
      course,
      student,
    ),
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
