const constants = require("./constants");
const templates = require("./templates");
const { courseConstants } = require("../../utils");
const { renderTemplate, buildCreditPaymentLink } = require("./email-utils");

const baseTemplateData = {
  contactPhone: constants.phoneContact,
  contactEmail: constants.accounts.registration.address,
};

const renderCourseInvoice = (course, student) => {
  const { courseInvoice } = templates;
  const courseName = courseConstants.fullCourseNames[course.name];

  const paymentDeadline = new Date(course.startDate);
  paymentDeadline.setDate(paymentDeadline.getDate() - 14);

  return renderTemplate(courseInvoice.fileName, {
    ...baseTemplateData,
    courseName,
    studentFirstName: student.firstName,
    paymentDeadline: paymentDeadline.toDateString(),
    contactEmail: constants.accounts.billing.address,
    creditPaymentLink: buildCreditPaymentLink(course, student),
    previewText: `Billing Invoice: Princeton Groundwater ${courseName}`,
  });
};

module.exports = {
  renderCourseInvoice,
};
