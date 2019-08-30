const emailService = require("../emailService");
const { accounts } = require("../../../utils/constants").emailService;

// mocked
const renderers = require("../renderers");
const emailUtils = require("../email-utils");

jest.mock("../email-utils.js");
jest.mock("../renderers.js");

const logger = { error: jest.fn() };

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

    test("failure: catches and logs the error", async () => {
      jest.clearAllMocks();
      emailClient.sendMail.mockImplementationOnce(() => Promise.reject(new Error()));

      await mockedEmailService.sendCourseInvoice(course, student, context);
      expect(emailUtils.handleError).toHaveBeenCalled();
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

      test("uses course invoice template", () => expect(renderers.renderCourseInvoice).toHaveBeenCalled());

      test("adds the course invoice as an attachment", () => expect(sendMailCallArg.attachments[0]).toBe(invoiceFile));
    });
  });

  describe("sendRegistrationComplete", () => {
    const context = { logger };

    test("failure: catches and logs the error", async () => {
      jest.clearAllMocks();
      emailClient.sendMail.mockImplementationOnce(() => Promise.reject(new Error()));

      await mockedEmailService.sendRegistrationComplete(
        course,
        student,
        context,
      );
      expect(emailUtils.handleError).toHaveBeenCalled();
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

      test("sends from the info email account", () => expect(sendMailCallArg.from).toBe(accounts.registration));

      test("uses registration complete template", () => expect(renderers.renderRegistrationComplete).toHaveBeenCalled());
    });
  });
});
