const { AuthenticationError } = require("apollo-server-express");

const schemas = require("../../../schemas");
const { Mutation } = require("../mutations");

describe("Mutation resolvers", () => {
  describe("registerForCourse", () => {
    const logger = { error: jest.fn() };

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
        mailChimp: { addToMailingList },
      },
    };

    test("returns the registered student", async () => {
      await Mutation.registerForCourse(null, args, context);
      expect(Course.registerStudent).toHaveBeenCalled();
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

    const stripe = {
      createCharge: jest.fn(),
    };

    const student = { id: 1 };
    const course = {
      completeStudentRegistration: jest.fn(() => student),
    };
    const Course = {
      validatePrePaymentRegistration: jest.fn(() =>
        Promise.resolve({ course, student }),
      ),
    };

    const context = {
      schemas,
      models: { Course },
      services: { stripe },
    };

    let result;
    beforeAll(async () => {
      result = await Mutation.payForCourseWithStripe(null, args, context);
    });

    it("validates the registration", () =>
      expect(Course.validatePrePaymentRegistration).toHaveBeenCalled());

    it("issues the Stripe charge", () =>
      expect(stripe.createCharge).toHaveBeenCalled());

    it("returns the updated student", () => expect(result.id).toBe(student.id));
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
    const course = { update: jest.fn() };
    const Course = { create: jest.fn() };

    const args = { courseData: {} };
    const context = {
      models: { Course },
    };

    let result;
    beforeAll(async () => {
      Course.create.mockImplementation(() => Promise.resolve(course));

      result = await Mutation.createCourse(null, args, context);
    });

    it("creates and returns a new Course", async () => {
      expect(Course.create).toHaveBeenCalled();
      expect(result).toBe(course);
    });
  });
});
