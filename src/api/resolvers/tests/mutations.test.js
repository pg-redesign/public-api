const { Mutation } = require("../mutations");

describe("Mutation resolvers", () => {
  describe("registerForCourse", () => {
    const Course = { registerStudent: jest.fn() };
    const addToMailingList = jest.fn(() => Promise.resolve());
    const context = {
      logger: { error: jest.fn() },
      models: { Course },
      emailService: { addToMailingList },
    };

    test("returns the registered student", async () => {
      const args = { registrationData: {} };

      await Mutation.registerForCourse(null, args, context);
      expect(Course.registerStudent).toHaveBeenCalled();
    });

    describe("args.registrationData.mailingList", () => {
      afterEach(() => addToMailingList.mockClear());

      test("false: does not subscribe student to mailing list", async () => {
        const args = { registrationData: { mailingList: false } };

        await Mutation.registerForCourse(null, args, context);
        expect(addToMailingList).not.toHaveBeenCalled();
      });

      test("true: subscribes student to mailing list", async () => {
        const args = { registrationData: { mailingList: true, email: "test" } };

        await Mutation.registerForCourse(null, args, context);
        expect(addToMailingList).toHaveBeenCalledWith(
          args.registrationData.email,
        );
      });

      test("true and fails to subscribe: catches error with logger.error", async () => {
        addToMailingList.mockImplementationOnce(() => Promise.reject(new Error()));
        const args = { registrationData: { mailingList: true, email: "test" } };

        await Mutation.registerForCourse(null, args, context);
        expect(addToMailingList).toHaveBeenCalledWith(
          args.registrationData.email,
        );
        expect(context.logger.error).toHaveBeenCalled();
      });
    });
  });
});