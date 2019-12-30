const { AuthenticationError } = require("apollo-server-express");

module.exports = {
  Mutation: {
    registerForCourse: async (_, args, context) => {
      const { models, schemas, services } = context;
      const { paymentOption, ...registrationData } = args.registrationData;

      const { course, student } = await models.Course.registerStudent(
        registrationData,
      );

      if (paymentOption === schemas.enums.PaymentOptions.invoice) {
        await services.email.sendCourseInvoice(course, student, context);
      }

      return student;
    },

    payForCourseWithStripe: async (_, args, context) => {
      const { paymentData } = args;
      const { models } = context;

      const { student } = await models.Course.completeStripePayment(
        paymentData,
        context,
      );

      return student;
    },

    subscribeToMailingList: async (_, args, context) => {
      const { mailingListData } = args;
      const { logger, models } = context;

      return models.Student.subscribeToMailingList(mailingListData).catch(
        error => {
          logger.error(error.message);
          return false;
        },
      );
    },

    authenticateAdmin: async (_, args, context) => {
      const { code } = args;
      const { services, logger } = context;

      return services.awsAuth.authenticateAdmin(code, context).catch(error => {
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
