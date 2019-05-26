module.exports = {
  type: "object",
  required: ["type", "amount", "invoice_date", "course_id", "student_id"],
  properties: {
    amount: { type: "integer" },
    course_id: { type: "integer" },
    student_id: { type: "integer" },
    type: { enum: ["credit", "check"] },
    invoice_date: { type: "string", format: "date-time" },
    payment_date: { type: "string", format: "date-time" },
  },
};
