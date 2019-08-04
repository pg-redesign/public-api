const { Payment } = require("../types");

describe("Payment Type resolvers", () => {
  describe("Payment.course", () => {
    const payment = { getCourse: jest.fn() };

    it("returns the Course associated with the Payment", async () => {
      await Payment.course(payment);
      expect(payment.getCourse).toHaveBeenCalled();
    });
  });

  describe("Payment.student", () => {
    const payment = { getStudent: jest.fn() };

    it("returns the Student associated with the Payment", async () => {
      await Payment.student(payment);
      expect(payment.getStudent).toHaveBeenCalled();
    });
  });
});
