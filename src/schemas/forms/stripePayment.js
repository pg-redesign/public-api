module.exports = {
  type: "object",
  required: ["tokenId", "studentId", "receiptEmail"],
  properties: {
    tokenId: { type: "string" },
    studentId: { type: "string", pattern: "^\\d+$" },
    receiptEmail: { type: "string", format: "email" },
  },
};
