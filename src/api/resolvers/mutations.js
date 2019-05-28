module.exports = {
  Mutation: {
    registerForCourse: async (_, args, context) => {
      const { mailingList, ...registrationData } = args.registrationData;
      const {
        logger,
        models: { Course },
        // TODO: implement
        emailService: { addToMailingList },
      } = context;

      if (mailingList) {
        const { email } = registrationData;

        addToMailingList(email).catch((error) => {
          logger.error(`Failed subscribing [${email}] to mailing list`);
          logger.error(error);
        });
      }
      // TODO: handle sending invoices for paymentType = "check"?
      return Course.registerStudent(registrationData);
    },
  },
};
