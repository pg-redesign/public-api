const { handleError, buildCreditPaymentLink } = require("../email-utils");

const logger = { error: jest.fn() };

describe("Email Service utils", () => {
  beforeAll(() => {
    process.env.EMAIL_DOMAIN = "test.princeton-groundwater.com ";
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
    const course = { id: 1 };
    const student = { id: 2 };
    const creditPaymentLink = "credit link";

    test("appends course and student ID query string to payment link", () => {
      const output = buildCreditPaymentLink(course, student, creditPaymentLink);
      expect(output.includes(`course=${course.id}`)).toBe(true);
      expect(output.includes(`student=${student.id}`)).toBe(true);
    });

    describe("throws an Error if", () =>
      [
        {
          test: "missing course ID",
          args: [{}, student, creditPaymentLink],
        },
        {
          test: "missing student ID",
          args: [course, {}, creditPaymentLink],
        },
      ].forEach(testCase =>
        test(testCase.test, () =>
          expect(() => buildCreditPaymentLink(...testCase.args)).toThrow(),
        ),
      ));
  });
});
