const { handleError, buildCreditPaymentLink } = require("../email-utils");

const logger = { error: jest.fn() };

describe("Email Service utils", () => {
  beforeAll(() => {
    process.env.EMAIL_HOST = "test.princeton-groundwater.com ";
  });

  test("handleError: logs email type, email address, and original error", () => {
    const mockArgs = {
      error: {},
      email: "email",
      emailType: "type",
    };

    handleError(logger, ...Object.values(mockArgs));

    const [firstCall, secondCall] = logger.error.mock.calls;
    expect(firstCall[0].includes(mockArgs.email)).toBe(true);
    expect(firstCall[0].includes(mockArgs.emailType)).toBe(true);
    expect(secondCall[0]).toBe(mockArgs.error);
  });

  describe("buildCreditPaymentLink", () => {
    test("builds credit payment URL with appended payment token path", () => {
      const paymentToken = "JWT.payment.token";
      const output = buildCreditPaymentLink(paymentToken);

      expect(output.includes(`/${paymentToken}`)).toBe(true);
    });
  });
});
