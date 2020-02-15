const { AuthenticationError } = require("apollo-server-express");

module.exports = {
  Mutation: {
    registerForCourse: async (_, args, context) => {
      const { models, schemas, services, logger } = context;
      const { paymentOption, ...registrationData } = args.registrationData;

      const { course, student } = await models.Course.registerStudent(
        registrationData,
      );

      // TODO: check for ID before adding row to prevent duplicates
      await services.spreadsheet
        .addStudentRow(course, student, context)
        .catch(logger.error);

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

      return services.cognitoAuth
        .authenticateAdmin(code, context)
        .catch(error => {
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

    createCourse: async (_, args, context) => {
      const { courseData } = args;
      const { services, models } = context;

      const course = await models.Course.create(courseData);
      const sheetId = await services.spreadsheet.createCourseSheet(
        course,
        context,
      );
      await course.update({ sheetId });

      return course;
    },
  },
};
