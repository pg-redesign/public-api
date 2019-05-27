module.exports = {
  Query: {
    getCourses: (_, { upcoming }, { models: { Course } }) => {
      if (upcoming) return Course.getUpcoming();
      return Course.getAll();
    },

    getFormSchema: (_, { form }, { schemas: { forms } }) => forms[form],
  },
};
