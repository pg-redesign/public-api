const Course = {
  name: (course, args, context) => {
    const { fullCourseNames } = context.utils.constants;

    return args.short ? course.name : fullCourseNames[course.name];
  },

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

  description: (course, _, context) => {
    // TODO: reimplement as a db fetch for admin editing
    const { courseDescriptions } = context.utils.constants;
    return courseDescriptions[course.name];
  },

  location: course => course.getLocation(),

  students: (course, args) => course.getStudents(args),

  payments: (course, args) => course.getPayments(args),
};

const Student = {
  courses: student => student.getCourses(),
  payments: student => student.getPayments(),
};

const Payment = {
  course: payment => payment.getCourse(),
  student: payment => payment.getStudent(),
};

module.exports = {
  Course,
  Student,
  Payment,
};
