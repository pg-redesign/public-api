const { StripeCardError } = require("stripe").errors;

const stripeService = require("../stripe");

describe("Stripe service", () => {
  describe("createCharge: Creates a Stripe payment for the student", () => {
    // mock the stripe instance
    const charges = {
      create: jest.fn(),
    };

    const stripeInstanceMock = {
      charges,
    };

    test("creates a Stripe charge and returns the charge.id", () => {
      const chargeId = "charge.id";
      const stripe = stripeService(stripeInstanceMock);
      charges.create.mockImplementationOnce(() => ({ id: chargeId }));

      return expect(stripe.createCharge({}, {})).resolves.toBe(chargeId);
    });

    test("Stripe charge fails: throws StripeCardError", () => {
      const stripe = stripeService(stripeInstanceMock);
      charges.create.mockImplementationOnce(() => ({ id: undefined }));

      return expect(stripe.createCharge({}, {})).rejects.toBeInstanceOf(
        StripeCardError,
      );
    });
  });
});
