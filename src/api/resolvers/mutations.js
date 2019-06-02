module.exports = {
  Mutation: {
    registerForCourse: async (_, args, context) => {
      const { mailingList, ...registrationData } = args.registrationData;
      const { logger, models, services } = context;

      if (mailingList) {
        const { email } = registrationData;
        // TODO: implement email service
        services.email.addToMailingList(email).catch((error) => {
          logger.error(`Failed subscribing [${email}] to mailing list`);
          logger.error(error);
        });
      }
      // TODO: handle sending invoices for paymentType = "check"?
      return models.Course.registerStudent(registrationData);
    },

    payForCourseWithStripe: (_, args, context) => {
      const { paymentData } = args;
      const { models, services } = context;

      return models.Course.completeStripePayment(paymentData, services.stripe);
    },
  },
};
