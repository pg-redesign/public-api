const { StripeCardError } = require("stripe").errors;

const stripeService = require("../stripe");

describe("Stripe service", () => {
  describe("handleCharge: Creates a Stripe payment for the student", () => {
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
      charges.create.mockImplementationOnce(() => chargeId);

      expect(stripe.handleCharge({}, {})).resolves.toBe(chargeId);
    });

    test("Stripe charge fails: throws StripeCardError", () => {
      const stripe = stripeService(stripeInstanceMock);
      charges.create.mockImplementationOnce(() => ({ id: undefined }));

      expect(stripe.handleCharge({}, {})).rejects.toBeInstanceOf(
        StripeCardError,
      );
    });
  });
});
