const footer = {
  type: "object",
  required: ["contactPhone", "contactEmail"],
  properties: {
    contactPhone: { type: "string" },
    contactEmail: { type: "string", format: "email" },
  },
};

const courseInvoice = {
  type: "object",
  required: [
    ...footer.required,
    "courseData",
    "previewText",
    "paymentDeadline",
    "studentFirstName",
    "creditPaymentLink",
  ],
  properties: {
    ...footer.properties,
    previewText: { type: "string" },
    paymentDeadline: { type: "string" },
    studentFirstName: { type: "string" },
    /* prettier-ignore */
    /* eslint-disable no-useless-escape */
    creditPaymentLink: { type: "string", pattern: "https://.+" },
    courseData: {
      type: "object",
      required: ["price", "name", "dates", "location"],
      properties: {
        price: { type: "number" },
        name: { type: "string" },
        dates: { type: "string" },
        location: {
          type: "object",
          required: ["name", "mapUrl"],
          properties: {
            name: { type: "string" },
            mapUrl: { type: "string", pattern: "https://.+" },
          },
        },
      },
    },
  },
};

module.exports = {
  courseInvoice,
};
