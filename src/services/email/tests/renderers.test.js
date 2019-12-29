const templates = require("../templates");
const { renderCourseInvoice } = require("../renderers");
const { courseMocks } = require("../../../db/models/tests/__mocks__/course");
const { studentData } = require("../../../db/models/tests/__mocks__/student");

// mocked
const renderTemplate = require("../templates/render-template");

jest.mock("../templates/render-template");

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

      const hasRequiredData = courseInvoiceTemplate.requiredData.every(
        requiredField => {
          console.log({ requiredField, val: templateData[requiredField] });
          return templateData[requiredField];
        }, // every value is defined (truthy)
      );

      expect(hasRequiredData).toBe(true);
    });
  });
});
