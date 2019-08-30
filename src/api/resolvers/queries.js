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

    getCoursesByLocation: async (_, args, context) => {
      const { courseLocationId } = args;
      const { CourseLocation } = context.models;

      const courseLocation = await CourseLocation.getBy({
        id: courseLocationId,
      });

      // empty list expected by schema if location is not found
      return courseLocation ? courseLocation.getCourses() : [];
    },

    getStudent: async (_, args, context) => {
      const { field } = args;
      const { Student } = context.models;

      return Student.getBy(field);
    },
  },
};
