const { AuthenticationError } = require("apollo-server-express");

const schemas = require("../../../schemas");
const { Mutation } = require("../mutations");

describe("Mutation resolvers", () => {
  describe("registerForCourse", () => {
    const addToMailingList = jest.fn(() => Promise.resolve());
    const sendCourseInvoice = jest.fn(() => Promise.resolve());
    const Course = { registerStudent: jest.fn(() => Promise.resolve({})) };

    const context = {
      schemas,
      models: { Course },
      logger: { error: jest.fn() },
      services: {
        email: { sendCourseInvoice },
        mailChimp: { addToMailingList },
      },
    };

    test("returns the registered student", async () => {
      const args = { registrationData: {} };

      await Mutation.registerForCourse(null, args, context);
      expect(Course.registerStudent).toHaveBeenCalled();
    });

    describe("args.registrationData.mailingList", () => {
      afterEach(() => addToMailingList.mockClear());

      test("true: subscribes student to mailing list", async () => {
        const args = { registrationData: { mailingList: true } };

        await Mutation.registerForCourse(null, args, context);
        expect(addToMailingList).toHaveBeenCalled();
      });

      test("false: does not subscribe student to mailing list", async () => {
        const args = { registrationData: { mailingList: false } };

        await Mutation.registerForCourse(null, args, context);
        expect(addToMailingList).not.toHaveBeenCalled();
      });
    });

    describe("args.registrationData.paymentOption", () => {
      afterEach(() => sendCourseInvoice.mockClear());

      test("INVOICE: sends the student a course invoice email", async () => {
        const args = {
          registrationData: {
            paymentOption: schemas.enums.PaymentOptions.invoice,
          },
        };

        await Mutation.registerForCourse(null, args, context);
        expect(sendCourseInvoice).toHaveBeenCalled();
      });

      test("CREDIT: does not send the student a course invoice email", async () => {
        const args = {
          registrationData: {
            paymentOption: schemas.enums.PaymentOptions.credit,
          },
        };

        await Mutation.registerForCourse(null, args, context);
        expect(sendCourseInvoice).not.toHaveBeenCalled();
      });
    });
  });

  describe("payForCourseWithStripe", () => {
    const args = { paymentData: {} };
    const sendRegistrationComplete = jest.fn();
    const Course = {
      completeStripePayment: jest.fn(() => Promise.resolve({})),
    };
    const context = {
      models: { Course },
      services: { email: { sendRegistrationComplete } },
    };

    beforeAll(() => Mutation.payForCourseWithStripe(null, args, context));

    test("issues Stripe charge and returns the updated student", () => expect(Course.completeStripePayment).toHaveBeenCalled());

    test("sends registration complete email", () => expect(sendRegistrationComplete).toHaveBeenCalled());
  });

  test("subscribeToMailingList: subscribes a user to the mailing list", () => {
    const args = { mailingListData: {} };
    const mailChimp = { addToMailingList: jest.fn() };
    const context = { services: { mailChimp } };

    Mutation.subscribeToMailingList(null, args, context);
    expect(mailChimp.addToMailingList).toHaveBeenCalled();
  });

  describe("authenticateAdmin", () => {
    const logger = { error: jest.fn() };
    const req = { headers: {}, ip: "ip.address" };
    const awsAuth = { authenticateAdmin: jest.fn(() => Promise.resolve()) };
    const context = { services: { awsAuth }, logger, req };

    test("success: returns a signed admin auth token", async () => {
      const args = { code: "auth-code" };

      await Mutation.authenticateAdmin(null, args, context);
      expect(awsAuth.authenticateAdmin).toHaveBeenCalled();
    });

    describe("failure during authentication", () => {
      const code = "aws-auth-code";
      const rejectedError = new Error("rejection reasons");

      let thrownError;
      beforeAll(async () => {
        awsAuth.authenticateAdmin.mockImplementationOnce(() => Promise.reject(rejectedError));

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
        awsAuth.authenticateAdmin.mockImplementationOnce(() => Promise.reject(networkError));

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
    const Course = { create: jest.fn() };
    const context = { models: { Course } };

    test("creates and returns a new Course", async () => {
      await Mutation.createCourse(null, { courseData: {} }, context);
      expect(Course.create).toHaveBeenCalled();
    });
  });
});
