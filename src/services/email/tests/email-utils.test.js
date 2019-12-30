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
    const course = {};
    const student = {};
    const registrationDataToken = "JWT.registrationDataToken";
    const jwtPayload = { create: jest.fn(() => registrationDataToken) };
    const context = { services: { jwtPayload } };

    test("builds a credit payment URL with a registration data JWT path appended", () => {
      const output = buildCreditPaymentLink(course, student, context);

      expect(jwtPayload.create).toHaveBeenCalled();
      expect(output.includes(`/${registrationDataToken}`)).toBe(true);
    });
  });
});
