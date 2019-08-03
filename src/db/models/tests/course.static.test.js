const AJV = require("ajv");
const { NotFoundError, ValidationError } = require("objection");

const Course = require("../course");
const schemas = require("../../../schemas");
const studentMock = require("./__mocks__/student");
const { connection } = require("../../connection");
const CourseLocation = require("../course-location");
const {
  createLocationsAndCourses,
  cleanupLocationsAndCourses,
} = require("./__mocks__/course");

const schemaValidator = new AJV();
schemaValidator.addSchema(schemas.types.student, "studentSchema");
schemaValidator.addSchema(schemas.types.payment, "paymentSchema");

// move to test utils?
const expectedOrder = (list, sortOrder) => {
  const sorted = [...list];
  const [property, direction] = sortOrder;

  return sorted.sort((a, b) => {
    const [aValue, bValue] = [a, b].map(obj => obj[property]);
    return direction === "asc" ? aValue > bValue : aValue < bValue;
  });
};

describe("Course static methods", () => {
  beforeAll(() => createLocationsAndCourses());
  // destroy connection and cleanup DB
  afterAll(async () => {
    await cleanupLocationsAndCourses();
    return connection.destroy();
  });

  describe("create", () => {
    const locationData = {
      city: "New Orleans",
      state: "LA",
      country: "USA",
      mapUrl: "https://goo.gl/maps/c0d3",
    };

    let course;
    let rawCourseData;
    let courseLocation;
    beforeAll(async () => {
      courseLocation = await CourseLocation.create(locationData);

      const thisYear = new Date().getFullYear();
      rawCourseData = {
        price: 1695,
        courseLocationId: courseLocation.id,
        name: schemas.enums.CourseShortNames.remediation,
        startDate: "10/24/".concat(thisYear + 1),
        endDate: "10/31/".concat(thisYear + 1),
      };

      course = await Course.create(rawCourseData);
    });

    afterAll(async () => {
      await courseLocation.$query().del();
      return course.$query().del();
    });

    it("converts the start and end dates into ISO string format", () => {
      const [expectedStart, expectedEnd] = [
        rawCourseData.startDate,
        rawCourseData.endDate,
      ].map(rawDate => new Date(rawDate).toISOString());

      expect(course.startDate).toEqual(expectedStart);
      expect(course.endDate).toEqual(expectedEnd);
    });

    it("creates and returns a new Course", () => {
      expect(course).toBeDefined();
      expect(course.courseLocationId).toBe(courseLocation.id);
    });
  });

  describe("getAll", () => {
    let results;
    beforeAll(async () => {
      results = await Course.getAll();
    });

    test("returns all courses", async () => {
      expect(results.length).toBe(2);
    });

    test(`courses are sorted by DEFAULT_SORT: [${Course.DEFAULT_SORT.toString()}]`, () => {
      expect(results).toEqual(expectedOrder(results, Course.DEFAULT_SORT));
    });
  });

  describe("getUpcoming", () => {
    let results;
    beforeAll(async () => {
      results = await Course.getUpcoming();
    });

    test("returns up to 2 courses", () => expect(results.length).toBeLessThanOrEqual(2));

    test(`courses are sorted by DEFAULT_SORT: [${Course.DEFAULT_SORT.toString()}]`, () => expect(results).toEqual(results, Course.DEFAULT_SORT));

    test("filters courses older than the current date", () => expect(results.every(course => course.startDate >= new Date())).toBe(
      true,
    ));
  });

  describe("validateCourseId", () => {
    let pastCourse;
    let upcomingCourse;
    beforeAll(async () => {
      const date = new Date();
      [pastCourse, upcomingCourse] = await Promise.all(
        ["<", ">"].map(equalityClause => Course.query().findOne("start_date", equalityClause, date)),
      );
    });

    test("course is valid for registration: void", async () => {
      const output = await Course.validateCourseId(upcomingCourse.id);
      expect(output.id).toBe(upcomingCourse.id);
    });

    test("course does not exist: throws NotFoundError", async () => {
      try {
        await Course.validateCourseId(0);
      } catch (error) {
        expect(error instanceof NotFoundError).toBe(true);
      }
    });

    test("course is older than current date: throws ValidationError", async () => {
      try {
        await Course.validateCourseId(pastCourse.id);
      } catch (error) {
        expect(error instanceof ValidationError).toBe(true);
      }
    });
  });

  describe("registerStudent", () => {
    // capture originals to reset after tests
    const { validateCourseId } = Course;
    const { registerNewStudent, registerExistingStudent } = Course.prototype;

    // return values of mocked proto methods
    const newStudent = "im new here";
    const updatedStudent = "updated student";

    let course;
    let registrationData;
    beforeAll(async () => {
      course = await Course.query().findOne("start_date", ">", new Date());

      registrationData = {
        courseId: course.id,
        ...studentMock.studentRegistrationData,
      };

      // mock internally used methods
      Course.validateCourseId = jest.fn(() => course);
      Course.prototype.registerNewStudent = jest.fn(() => newStudent);
      Course.prototype.registerExistingStudent = jest.fn(() => updatedStudent);
    });

    afterEach(() => jest.clearAllMocks());

    afterAll(() => {
      // reset mocks to original methods
      Course.validateCourseId = validateCourseId;
      Course.prototype.registerNewStudent = registerNewStudent;
      Course.prototype.registerExistingStudent = registerExistingStudent;
    });

    describe("auxiliary behavior", () => {
      let studentData;
      let paymentData;
      beforeAll(async () => {
        await Course.registerStudent(registrationData);
        // extract the args given to the mocked function to check their shape
        const [mockCall] = Course.prototype.registerNewStudent.mock.calls;
        [studentData, paymentData] = mockCall;
      });

      test("validates the course ID", () => {
        expect(Course.validateCourseId).toHaveBeenCalled();
      });

      test("creates student data object with correct shape (schema validated)", () => {
        expect(schemaValidator.validate("studentSchema", studentData)).toBe(
          true,
        );
      });

      test("creates payment data object with correct shape (schema validated)", () => {
        expect(schemaValidator.validate("paymentSchema", paymentData)).toBe(
          true,
        );
      });
    });

    test("student not in db: returns course and new registered student", async () => {
      const output = await Course.registerStudent(registrationData);
      expect(Course.prototype.registerNewStudent).toHaveBeenCalled();
      expect(output.course).toBe(course);
      expect(output.student).toBe(newStudent);
    });

    test("student exists in db: returns course and registered student", async () => {
      const student = await studentMock.createStudent();

      const output = await Course.registerStudent({
        email: studentMock.studentData.email,
      });

      expect(Course.prototype.registerExistingStudent).toHaveBeenCalled();
      expect(output.course).toBe(course);
      expect(output.student).toBe(updatedStudent);

      // delete student
      await studentMock.destroyStudent(student.id);
    });
  });

  describe("completeStripePayment", () => {
    const stripeService = { createCharge: jest.fn() };

    const student = {
      id: 1,
      ...studentMock.studentData,
    };

    let course;
    let paymentData;
    const {
      validateCourseId,
      getRegisteredStudent,
      completeStudentRegistration,
    } = Course.prototype;
    beforeAll(async () => {
      course = await Course.query().findOne("start_date", ">", new Date());

      paymentData = {
        courseId: course.id,
        studentId: student.id,
      };

      // mock methods
      Course.validateCourseId = jest.fn(() => course);
      Course.prototype.getRegisteredStudent = jest.fn();
      Course.prototype.completeStudentRegistration = jest.fn();
    });

    afterAll(() => {
      // reset mocked methods
      Course.validateCourseId = validateCourseId;
      Course.prototype.getRegisteredStudent = getRegisteredStudent;
      Course.prototype.completeStudentRegistration = completeStudentRegistration;
    });

    describe("success", () => {
      let result;
      beforeAll(async () => {
        Course.prototype.getRegisteredStudent.mockImplementationOnce(
          () => student,
        );
        Course.prototype.completeStudentRegistration.mockImplementationOnce(
          () => student,
        );

        result = await Course.completeStripePayment(paymentData, stripeService);
      });
      afterAll(() => jest.clearAllMocks());

      test("validates the course ID", () => {
        expect(Course.validateCourseId).toHaveBeenCalled();
      });

      test("confirms student existence and registration", () => {
        expect(Course.prototype.getRegisteredStudent).toHaveBeenCalled();
      });

      test("calls stripe service to create a charge", () => {
        expect(stripeService.createCharge).toHaveBeenCalled();
      });

      test("updates the payment status of the student", () => {
        expect(Course.prototype.completeStudentRegistration).toHaveBeenCalled();
      });

      test("returns the course and paid student", () => {
        expect(result.student).toBe(student);
        expect(result.course.id).toBe(course.id);
      });
    });

    describe("failure", () => {
      test("student has already paid: does not call stripe service or update payment status", async () => {
        Course.prototype.getRegisteredStudent.mockImplementationOnce(() => ({
          ...student,
          paymentDate: "some date",
        }));
        const notCalled = [
          stripeService.createCharge,
          Course.prototype.completeStudentRegistration,
        ];

        await Course.completeStripePayment(paymentData);
        notCalled.forEach(action => expect(action).not.toHaveBeenCalled());
      });
    });
  });
});
