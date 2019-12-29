const constants = require("./constants");
const templates = require("./templates");
const { courseConstants } = require("../../utils");
const { buildCreditPaymentLink } = require("./email-utils");
const renderTemplate = require("./templates/render-template");

const baseTemplateData = {
  contactPhone: constants.phoneContact,
  contactEmail: constants.accounts.registration.address,
};

const renderCourseInvoice = (course, student) => {
  const { courseInvoice } = templates;
  const courseFullName = courseConstants.fullCourseNames[course.name];

  const paymentDeadline = new Date(course.startDate);
  paymentDeadline.setDate(paymentDeadline.getDate() - 14);

  return renderTemplate(courseInvoice.fileName, {
    ...baseTemplateData,
    courseFullName,
    studentFirstName: student.firstName,
    contactEmail: constants.accounts.billing.address,
    paymentDeadline: paymentDeadline.toDateString().slice(4),
    creditPaymentLink: buildCreditPaymentLink(course, student),
    previewText: `Billing Invoice: Princeton Groundwater ${courseFullName}`,
  });
};

module.exports = {
  renderCourseInvoice,
};
