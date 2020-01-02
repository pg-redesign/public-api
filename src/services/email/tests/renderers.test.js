const AJV = require("ajv");

const templates = require("../templates");
const schemas = require("../../../schemas").templates;
const { renderCourseInvoice } = require("../renderers");
const { courseMocks } = require("../../../db/models/tests/__mocks__/course");
const { studentData } = require("../../../db/models/tests/__mocks__/student");

// mocked
const renderTemplate = require("../templates/render-template");

jest.mock("../templates/render-template");

const dataValidator = new AJV();
const [upcomingCourse] = courseMocks;

const student = {
  id: 1,
  ...studentData,
};

const courseData = upcomingCourse.course;

const course = {
  id: 1,
  ...courseData,
  location: upcomingCourse.location,
  // DB mocks are used for inserting / seeding
  // they have dates converted to ISO strings
  // these tests assume live data that would have Date types
  startDate: new Date(courseData.startDate),
  endDate: new Date(courseData.endDate),
};

describe("Template Renderers", () => {
  describe("renderCourseInvoice", () => {
    let renderTemplateCall;
    beforeAll(async () => {
      // jwtPayload service is not mocked
      // testing for real behavior in render data
      await renderCourseInvoice({
        course,
        student,
        paymentToken: "JWT.payment",
      });
      [renderTemplateCall] = renderTemplate.mock.calls;
    });

    test("renders the course invoice template with all required data", () => {
      const courseInvoiceTemplate = templates.courseInvoice;
      const [templateFileName, templateData] = renderTemplateCall;

      const hasRequiredData = dataValidator.validate(
        schemas.courseInvoice,
        templateData,
      );

      expect(hasRequiredData).toBe(true);
      expect(templateFileName).toBe(courseInvoiceTemplate.fileName);
    });
  });
});
