const {
  renderCourseInvoice,
  // renderRegistrationComplete,
} = require("../renderers");

const emailUtils = require("../email-utils");
const constants = require("../../../utils/constants");

jest.mock("../email-utils.js");

describe("Template Renderers", () => {
  describe("renderCourseInvoice", () => {
    let filenameArg;
    let templateDataArg;
    beforeAll(() => {
      renderCourseInvoice({}, {});
      const [mockCall] = emailUtils.renderPugTemplate.mock.calls;
      [filenameArg, templateDataArg] = mockCall;
    });

    test("sets course invoice template data", () => expect(Object.keys(templateDataArg).length).toBeTruthy());

    test("overrides default contact email to billing account", () => expect(templateDataArg.contactEmail).toBe(
      constants.emailService.accounts.billing,
    ));

    test("renders the course invoice template", () => expect(filenameArg).toBe("course-invoice.pug"));
  });
});
