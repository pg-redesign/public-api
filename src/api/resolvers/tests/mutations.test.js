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
});
