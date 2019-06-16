const pug = require("pug");
const constants = require("../../../utils/constants");
const {
  handleError,
  renderPugTemplate,
  buildCreditPaymentLink,
} = require("../email-utils");

jest.mock("pug");

const logger = { error: jest.fn() };

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

  describe("renderPugTemplate", () => {
    const templateData = { some: "data" };
    const filename = "template.pug";

    let pugRenderFileOptions;
    beforeAll(() => {
      renderPugTemplate(filename, templateData);
      const [mockCall] = pug.renderFile.mock.calls;
      [pugRenderFileOptions] = mockCall.slice(1);
    });

    test("sets default template email contact to info account", () => expect(pugRenderFileOptions.contactEmail).toBe(
      constants.emailService.accounts.info,
    ));

    test("sets default template phone contact to business number", () => expect(pugRenderFileOptions.contactPhone).toBe(
      constants.emailService.phoneContact,
    ));

    test("injects any additional template data", () => expect(pugRenderFileOptions.some).toBe(templateData.some));

    test("renders the chosen template", () => expect(pug.renderFile).toHaveBeenCalled());
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

    describe("throws an Error if", () => [
      {
        test: "missing course ID",
        args: [{}, student, creditPaymentLink],
      },
      {
        test: "missing student ID",
        args: [course, {}, creditPaymentLink],
      },
      {
        test: "missing credit payment site link",
        args: [course, student, null],
      },
    ].forEach(testCase => test(testCase.test, () => expect(() => buildCreditPaymentLink(...testCase.args)).toThrow())));
  });
});
