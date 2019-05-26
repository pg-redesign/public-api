module.exports = {
  Course: {
    date: (course, args, { utils: { format } }) => {
      const { start, end, language } = args;
      const { startDate, endDate } = course;

      // full date range in language format if neither start nor end are passed
      if ([start, end].every(arg => arg === undefined)) {
        return format.courseDateRange(startDate, endDate, language);
      }

      // if there are args give precedence to start
      return start ? startDate.toUTCString() : endDate.toUTCString();
    },
  },
};
