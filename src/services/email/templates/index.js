const footerExpectedData = ["contactPhone", "contactEmail"];

module.exports = {
  courseInvoice: {
    fileName: "course-invoice.ejs",
    requiredData: [
      ...footerExpectedData,
      "courseName",
      "previewText",
      "paymentDeadline",
      "studentFirstName",
      "creditPaymentLink",
    ],
  },
};
