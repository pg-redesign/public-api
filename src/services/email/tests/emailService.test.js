const { accounts } = require("../constants");
const emailService = require("../emailService");

// mocked
const renderers = require("../renderers");
const emailUtils = require("../email-utils");

jest.mock("../renderers.js");
jest.mock("../email-utils.js");

const logger = { error: jest.fn() };

describe("Email Service", () => {
  const course = { id: 1 };
  const student = { email: "email" };
  const emailClient = { sendMail: jest.fn() };
  const mockedEmailService = emailService(emailClient);

  describe("sendCourseInvoice", () => {
    const jwtPayload = { createPaymentToken: jest.fn(() => Promise.resolve()) };
    const context = { logger, services: { jwtPayload } };

    test("failure: catches and logs the error", async () => {
      jest.clearAllMocks();
      emailClient.sendMail.mockImplementationOnce(() =>
        Promise.reject(new Error()),
      );

      await mockedEmailService.sendCourseInvoice(course, student, context);
      expect(emailUtils.handleError).toHaveBeenCalled();
    });

    describe("success", () => {
      let sendMailCallArg;
      beforeAll(async () => {
        jest.resetAllMocks();
        emailClient.sendMail.mockImplementationOnce(() => Promise.resolve());

        await mockedEmailService.sendCourseInvoice(course, student, context);

        const callArgs = emailClient.sendMail.mock.calls[0];
        [sendMailCallArg] = callArgs;
      });

      test("sends an invoice email to the student", () =>
        expect(sendMailCallArg.to).toBe(student.email));

      test("sends from the billing email account", () =>
        expect(sendMailCallArg.from).toBe(accounts.billing));

      test("uses course invoice template", () =>
        expect(renderers.renderCourseInvoice).toHaveBeenCalled());
    });
  });
});
