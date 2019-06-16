module.exports = {
  Mutation: {
    registerForCourse: async (_, args, context) => {
      const {
        mailingList,
        paymentOption,
        ...registrationData
      } = args.registrationData;

      const { models, schemas, services } = context;

      if (mailingList) {
        // run in background
        services.mailChimp.addToMailingList(registrationData, context);
      }

      const { course, student } = await models.Course.registerStudent(
        registrationData,
      );

      const { PaymentOptions } = schemas.enums;
      if (paymentOption === PaymentOptions.invoice) {
        await services.email.sendCourseInvoice(course, student, context);
      }

      return student;
    },

    payForCourseWithStripe: async (_, args, context) => {
      const { paymentData } = args;
      const { models, services } = context;

      const { course, student } = await models.Course.completeStripePayment(
        paymentData,
        context,
      );

      await services.email.sendRegistrationComplete(course, student, context);

      return student;
    },

    subscribeToMailingList: (_, args, context) => {
      const { services } = context;
      const { mailingListData } = args;

      return services.mailChimp.addToMailingList(mailingListData, context);
    },
  },
};
