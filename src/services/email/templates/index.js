const footerExpectedData = ["contactPhone", "contactEmail"];

module.exports = {
  courseInvoice: {
    fileName: "course-invoice.ejs",
    requiredData: [
      ...footerExpectedData,
      "previewText",
      "courseFullName",
      "paymentDeadline",
      "studentFirstName",
      "creditPaymentLink",
    ],
  },
};
