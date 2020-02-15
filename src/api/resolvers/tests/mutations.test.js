const { AuthenticationError } = require("apollo-server-express");

const schemas = require("../../../schemas");
const { Mutation } = require("../mutations");

describe("Mutation resolvers", () => {
  describe("registerForCourse", () => {
    const logger = { error: jest.fn() };

    const addStudentRow = jest.fn(() => Promise.resolve());
    const addToMailingList = jest.fn(() => Promise.resolve());
    const sendCourseInvoice = jest.fn(() => Promise.resolve());

    const course = {};
    const student = {};
    const Course = {
      registerStudent: jest.fn(() => Promise.resolve({ course, student })),
    };

    const args = { registrationData: {} };
    const context = {
      logger,
      schemas,
      models: { Course },
      services: {
        email: { sendCourseInvoice },
        spreadsheet: { addStudentRow },
        mailChimp: { addToMailingList },
      },
    };

    test("returns the registered student", async () => {
      await Mutation.registerForCourse(null, args, context);
      expect(Course.registerStudent).toHaveBeenCalled();
    });

    describe("Spreadsheet Service integration", () => {
      afterEach(() => jest.clearAllMocks());

      it("adds the student data to the Course Sheet", async () => {
        await Mutation.registerForCourse(null, args, context);
        expect(addStudentRow).toHaveBeenCalledWith(course, student, context);
      });

      it("handles and logs any errors thrown while adding student row", async () => {
        const error = new Error();
        addStudentRow.mockRejectedValueOnce(error);

        await Mutation.registerForCourse(null, args, context);
        expect(logger.error).toHaveBeenCalled();
      });
    });

    describe("args.registrationData.paymentOption", () => {
      afterEach(() => sendCourseInvoice.mockClear());

      test("INVOICE: sends the student a course invoice email", async () => {
        const invoiceArgs = {
          registrationData: {
            paymentOption: schemas.enums.PaymentOptions.invoice,
          },
        };

        await Mutation.registerForCourse(null, invoiceArgs, context);
        expect(sendCourseInvoice).toHaveBeenCalled();
      });

      test("CREDIT: does not send the student a course invoice email", async () => {
        const creditArgs = {
          registrationData: {
            paymentOption: schemas.enums.PaymentOptions.credit,
          },
        };

        await Mutation.registerForCourse(null, creditArgs, context);
        expect(sendCourseInvoice).not.toHaveBeenCalled();
      });
    });
  });

  describe("payForCourseWithStripe", () => {
    const args = { paymentData: {} };
    const Course = {
      completeStripePayment: jest.fn(() => Promise.resolve({})),
    };
    const context = {
      models: { Course },
    };

    beforeAll(() => Mutation.payForCourseWithStripe(null, args, context));

    test("issues Stripe charge and returns the updated student", () =>
      expect(Course.completeStripePayment).toHaveBeenCalled());
  });

  describe("subscribeToMailingList", () => {
    const args = { mailingListData: {} };
    const logger = { error: jest.fn() };
    const Student = { subscribeToMailingList: jest.fn() };
    const context = { models: { Student }, logger };

    beforeEach(() => jest.resetAllMocks());

    test("success: subscribes a user to the mailing list and returns true", async () => {
      Student.subscribeToMailingList.mockResolvedValueOnce(true);

      const output = await Mutation.subscribeToMailingList(null, args, context);

      expect(output).toBe(true);
      expect(Student.subscribeToMailingList).toHaveBeenCalledWith(
        args.mailingListData,
      );
    });

    test("failure: logs the error message and returns false", async () => {
      Student.subscribeToMailingList.mockRejectedValueOnce(new Error());

      const output = await Mutation.subscribeToMailingList(null, args, context);

      expect(output).toBe(false);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("authenticateAdmin", () => {
    const logger = { error: jest.fn() };
    const req = { headers: {}, ip: "ip.address" };
    const cognitoAuth = { authenticateAdmin: jest.fn() };
    const context = { services: { cognitoAuth }, logger, req };

    test("success: returns a signed admin cognitoAuth token", async () => {
      const args = { code: "cognitoAuth-code" };
      cognitoAuth.authenticateAdmin.mockResolvedValueOnce("token");

      await Mutation.authenticateAdmin(null, args, context);
      expect(cognitoAuth.authenticateAdmin).toHaveBeenCalled();
    });

    describe("failure during authentication", () => {
      const code = "aws-cognitoAuth-code";
      const rejectedError = new Error("rejection reasons");

      let thrownError;
      beforeAll(async () => {
        cognitoAuth.authenticateAdmin.mockImplementationOnce(() =>
          Promise.reject(rejectedError),
        );

        try {
          await Mutation.authenticateAdmin(null, { code }, context);
        } catch (error) {
          thrownError = error;
        }
      });

      test("catches the error and rethrows an AuthenticationError", () => {
        expect(thrownError).toBeInstanceOf(AuthenticationError);
      });

      test("logs user request IP and headers", () => {
        const [requestContextLog] = logger.error.mock.calls;

        // first arg is log message
        const requestContext = requestContextLog[1];
        expect(requestContext).toHaveProperty("ip", req.ip);
        expect(requestContext).toHaveProperty("headers", req.headers);
      });

      test("non-network error: logs the originally thrown error", () => {
        const originalErrorLog = logger.error.mock.calls[1];
        expect(originalErrorLog[0]).toBe(rejectedError);
      });

      test("network related error: logs response status and data", async () => {
        jest.clearAllMocks();
        const networkError = { response: { status: 400, data: {} } };
        cognitoAuth.authenticateAdmin.mockImplementationOnce(() =>
          Promise.reject(networkError),
        );

        try {
          await Mutation.authenticateAdmin(null, { code }, context);
        } catch (e) {
          // request context is the first call
          // first arg is the message
          const loggedResponseData = logger.error.mock.calls[1][1];
          expect(loggedResponseData.status).toBe(networkError.response.status);
          expect(loggedResponseData.data).toBe(networkError.response.data);
        }
      });
    });
  });

  describe("createCourseLocation", () => {
    const CourseLocation = { create: jest.fn() };
    const context = { models: { CourseLocation } };

    test("creates and returns a new Course Location", async () => {
      await Mutation.createCourseLocation(
        null,
        { courseLocationData: {} },
        context,
      );
      expect(CourseLocation.create).toHaveBeenCalled();
    });
  });

  describe("createCourse", () => {
    const logger = { error: jest.fn() };

    const sheetId = "course sheet ID";
    const createCourseSheet = jest.fn(() => Promise.resolve(sheetId));

    const course = { update: jest.fn(() => Promise.resolve()) };
    const Course = { create: jest.fn(() => Promise.resolve(course)) };

    const args = { courseData: {} };
    const context = {
      logger,
      models: { Course },
      services: { spreadsheet: { createCourseSheet } },
    };

    test("creates and returns a new Course", async () => {
      await Mutation.createCourse(null, args, context);
      expect(Course.create).toHaveBeenCalled();
    });

    describe("Spreadsheet Service integration", () => {
      beforeAll(() => Mutation.createCourse(null, args, context));

      it("creates a Course Sheet in the Courses Spreadsheet doc", () =>
        expect(createCourseSheet).toHaveBeenCalledWith(course, context));

      it("sets the sheetId of the Course", () =>
        expect(course.update).toHaveBeenCalledWith({ sheetId }));

      // better to leave unhandled?
      // it("handles and logs any errors thrown while adding the Course Sheet", async () => {
      //   const error = new Error();
      //   createCourseSheet.mockRejectedValueOnce(error);

      //   await Mutation.createCourse(null, args, spreadsheetContext);
      //   expect(logger.error).toHaveBeenCalled();
      // });
    });
  });
});
