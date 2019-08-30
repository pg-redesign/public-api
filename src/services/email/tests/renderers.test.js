const templates = require("../templates");
const { renderCourseInvoice } = require("../renderers");

// mocked
const { renderTemplate } = require("../email-utils");

jest.mock("../email-utils.js");

const { courseMocks } = require("../../../db/models/tests/__mocks__/course");
const { studentData } = require("../../../db/models/tests/__mocks__/student");

const student = {
  id: 1,
  ...studentData,
};

const course = {
  id: 1,
  ...courseMocks[0].course,
};

describe("Template Renderers", () => {
  describe("renderCourseInvoice", () => {
    let renderTemplateCall;
    beforeAll(async () => {
      await renderCourseInvoice(course, student);
      [renderTemplateCall] = renderTemplate.mock.calls;
    });

    test("renders the course invoice template with all required data", () => {
      const courseInvoiceTemplate = templates.courseInvoice;
      const [templateFileName, templateData] = renderTemplateCall;

      expect(templateFileName).toBe(courseInvoiceTemplate.fileName);

      const templateDataFields = Object.keys(templateData);
      const hasRequiredData = courseInvoiceTemplate.requiredData.every(
        requiredField => templateDataFields.includes(requiredField),
      );
      expect(hasRequiredData).toBe(true);
    });
  });
});
