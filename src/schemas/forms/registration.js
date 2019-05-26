const enums = require("../enums");
const types = require("../types");

module.exports = {
  ...types.student,
  required: [...types.student.required, "mailingList", "paymentType"],
  mailingList: { type: "boolean" },
  paymentType: { enum: [Object.values(enums.PaymentTypes)] },
};
