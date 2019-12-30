const constants = require("./constants");
const templates = require("./templates");
const { enums } = require("../../schemas");
const { courseConstants, format } = require("../../utils");
const { buildCreditPaymentLink } = require("./email-utils");
const renderTemplate = require("./templates/render-template");

const baseTemplateData = {
  contactPhone: constants.phoneContact,
  contactEmail: constants.accounts.registration.address,
};

const renderCourseInvoice = (course, student, context) => {
  const { courseInvoice } = templates;
  const { name, price, startDate, endDate } = course;
  const { city, state, mapUrl } = course.location;

  const courseData = {
    price,
    name: courseConstants.fullCourseNames[name],
    dates: format.courseDateRange(
      startDate,
      endDate,
      enums.LanguageTypes.english,
    ),
    location: {
      mapUrl,
      name: `${city}, ${state}`,
    },
  };

  const paymentDeadline = new Date(startDate);
  paymentDeadline.setDate(paymentDeadline.getDate() - 14);
  return renderTemplate(courseInvoice.fileName, {
    ...baseTemplateData,
    courseData,
    studentFirstName: student.firstName,
    previewText: `Princeton Groundwater Billing`,
    contactEmail: constants.accounts.billing.address,
    paymentDeadline: paymentDeadline.toDateString().slice(4), // cut off day shorthand
    creditPaymentLink: buildCreditPaymentLink(course, student, context),
  });
};

module.exports = {
  renderCourseInvoice,
};
