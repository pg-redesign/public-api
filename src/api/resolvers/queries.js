module.exports = {
  Query: {
    getCourses: (_, args, context) => {
      const { upcoming } = args;
      const { Course } = context.models;

      if (upcoming) return Course.getUpcoming();
      return Course.getAll();
    },

    getFormSchema: (_, args, context) => {
      const { form } = args;
      const { forms } = context.schemas;
      return forms[form];
    },

    getCourseLocations: (_, __, context) => {
      const { CourseLocation } = context.models;
      return CourseLocation.getAll();
    },
  },
};
