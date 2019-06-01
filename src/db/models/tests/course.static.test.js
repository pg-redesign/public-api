const AJV = require("ajv");
const { NotFoundError, ValidationError } = require("objection");
const Course = require("../course");
const schemas = require("../../../schemas");
const { connection } = require("../../connection");
const studentMock = require("./__mocks__/student");

const schemaValidator = new AJV();
schemaValidator.addSchema(schemas.types.student, "studentSchema");
schemaValidator.addSchema(schemas.types.payment, "paymentSchema");

// move to test utils?
const expectedOrder = (list, sortOrder) => {
  const sorted = [...list];
  const [property, direction] = sortOrder;

  sorted.sort((a, b) => {
    const [aValue, bValue] = [a, b].map(obj => obj[property]);
    return direction === "asc" ? aValue > bValue : aValue < bValue;
  });

  return sorted;
};

/* seeded by "db/test-seeds/make-courses" */
describe("Course static methods", () => {
  // destroy connection
  afterAll(() => connection.destroy());

  // -- STATIC METHODS -- //
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
        paymentType: schemas.enums.PaymentTypes.check,
        ...studentMock.studentRegistrationData,
      };

      // mock internally used methods
      Course.validateCourseId = jest.fn(() => course);
      Course.prototype.registerNewStudent = jest.fn(() => newStudent);
      Course.prototype.registerExistingStudent = jest.fn(() => updatedStudent);
    });

    afterAll(() => {
      // reset mocks to original methods
      Course.validateCourseId = validateCourseId;
      Course.prototype.registerNewStudent = registerNewStudent;
      Course.prototype.registerExistingStudent = registerExistingStudent;
    });

    afterEach(() => jest.clearAllMocks());

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
        expect(Course.validateCourseId).toHaveBeenCalledWith(
          registrationData.courseId,
        );
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

    test("student not in db: registers and returns a new student", async () => {
      await Course.registerStudent(registrationData);
      expect(Course.prototype.registerNewStudent).toHaveBeenCalled();
    });

    test("student exists in db: registers and returns updated student", async () => {
      const student = await studentMock.createStudent();

      await Course.registerStudent({ email: studentMock.studentData.email });
      expect(Course.prototype.registerExistingStudent).toHaveBeenCalled();

      // delete student
      await studentMock.destroyStudent(student.id);
    });
  });
});
