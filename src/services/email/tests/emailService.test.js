const { handleError, emailService } = require("../emailService");

// mocked internals
const {
  renderCourseInvoice,
  renderRegistrationComplete,
} = require("../renderers");
const { accounts } = require("../../../utils/constants").emailService;

const logger = { error: jest.fn() };

jest.mock("../renderers.js", () => ({
  renderCourseInvoice: jest.fn(),
  renderRegistrationComplete: jest.fn(),
}));

jest.mock("../../../utils/constants.js", () => ({
  emailService: { accounts: { billing: "billing", info: "info " } },
}));

describe("Email Service utils", () => {
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
});

describe("Email Service", () => {
  const course = { id: 1 };
  const student = { email: "email" };
  const emailClient = { sendMail: jest.fn() };
  const mockedEmailService = emailService(emailClient);

  describe("sendCourseInvoice", () => {
    const invoiceFile = "invoice file";
    const context = {
      logger,
      services: { file: { generateInvoice: jest.fn(() => invoiceFile) } },
    };

    test("failure: catches and logs the error", () => {
      jest.clearAllMocks();
      emailClient.sendMail.mockImplementationOnce(() => Promise.reject(new Error()));

      return mockedEmailService
        .sendCourseInvoice(course, student, context)
        .catch((error) => {
          expect(error).not.toBeDefined();
          expect(logger.error).toHaveBeenCalled();
        });
    });

    describe("success", () => {
      let sendMailCallArg;
      beforeAll(async () => {
        jest.clearAllMocks();
        emailClient.sendMail.mockImplementationOnce(() => Promise.resolve());

        await mockedEmailService.sendCourseInvoice(course, student, context);

        const callArgs = emailClient.sendMail.mock.calls[0];
        [sendMailCallArg] = callArgs;
      });

      test("sends an invoice email to the student", () => expect(sendMailCallArg.to).toBe(student.email));

      test("sends from the billing email account", () => expect(sendMailCallArg.from).toBe(accounts.billing));

      test("uses course invoice template", () => expect(renderCourseInvoice).toHaveBeenCalled());

      test("adds the course invoice as an attachment", () => expect(sendMailCallArg.attachments[0]).toBe(invoiceFile));
    });
  });

  describe("sendRegistrationComplete", () => {
    const context = { logger };

    test("failure: catches and logs the error", () => {
      jest.clearAllMocks();
      emailClient.sendMail.mockImplementationOnce(() => Promise.reject(new Error()));

      return mockedEmailService
        .sendRegistrationComplete(course, student, context)
        .catch((error) => {
          expect(error).not.toBeDefined();
          expect(logger.error).toHaveBeenCalled();
        });
    });

    describe("success", () => {
      let sendMailCallArg;
      beforeAll(async () => {
        jest.clearAllMocks();
        emailClient.sendMail.mockImplementationOnce(() => Promise.resolve());

        await mockedEmailService.sendRegistrationComplete(
          course,
          student,
          context,
        );

        const callArgs = emailClient.sendMail.mock.calls[0];
        [sendMailCallArg] = callArgs;
      });

      test("sends a registration completed email to the student", () => expect(sendMailCallArg.to).toBe(student.email));

      test("sends from the info email account", () => expect(sendMailCallArg.from).toBe(accounts.info));

      test("uses registration complete template", () => expect(renderRegistrationComplete).toHaveBeenCalled());
    });
  });
});
