module.exports = {
  type: "object",
  required: ["amount", "paymentType", "invoiceDate"],
  properties: {
    amount: { type: "integer" },
    paymentType: { enum: ["credit", "check"] },
    invoiceDate: { type: "string", format: "date-time" },
    paymentDate: { type: "string", format: "date-time" },
  },
};
