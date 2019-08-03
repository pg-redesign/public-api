const { AuthenticationError } = require("apollo-server-express");

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

    authenticateAdmin: async (_, args, context) => {
      const { code } = args;
      const { services, logger } = context;

      return services.awsAuth.authenticateAdmin(code, context).catch((error) => {
        const { headers, ip } = context.req;

        logger.error("Failed admin authentication, request data:", {
          ip,
          headers,
          awsAuthCode: code,
        });

        if (error.response) {
          const { data, status } = error.response;
          logger.error("request error:", { status, data });
        } else {
          logger.error(error);
        }

        throw new AuthenticationError(
          "Authentication failed. Request context has been logged for review.",
        );
      });
    },

    createCourseLocation: (_, args, context) => {
      const { courseLocationData } = args;
      const { CourseLocation } = context.models;

      return CourseLocation.create(courseLocationData);
    },

    createCourse: (_, args, context) => {
      const { courseData } = args;
      const { Course } = context.models;

      return Course.create(courseData);
    },
  },
};
