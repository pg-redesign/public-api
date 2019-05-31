const { PaymentTypes } = require("../enums");

module.exports = {
  type: "object",
  required: ["amount", "paymentType", "invoiceDate"],
  properties: {
    amount: { type: "integer" },
    invoiceDate: { type: "string", format: "date-time" },
    paymentDate: { type: "string", format: "date-time" },
    paymentType: { type: "string", enum: Object.values(PaymentTypes) },
  },
};
