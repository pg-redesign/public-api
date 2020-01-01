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

    test("builds credit payment URL with appended JWT path of registration data { courseId, studentId, email }", () => {
      const output = buildCreditPaymentLink(course, student, context);
      expect(output.includes(`/${registrationDataToken}`)).toBe(true);

      const [[payload]] = jwtPayload.create.mock.calls;

      ["courseId", "studentId", "email"].every(requiredField =>
        expect(payload.data).toHaveProperty(requiredField),
      );
    });
  });
});
