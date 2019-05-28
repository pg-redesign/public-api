const { NotFoundError, ValidationError } = require("objection");

const Course = require("../course");
const Student = require("../student");
const { enums } = require("../../../schemas");
const { connection } = require("../../connection");

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
describe("Course methods", () => {
  // destroy connection
  afterAll(() => connection.destroy());

  // -- STATIC METHODS -- //
  describe("static getAll", () => {
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

  describe("static getUpcoming", () => {
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

  describe("static validateCourseId", () => {
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

  // TODO: complete tests
  describe("static registerStudent", () => {
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
        firstName: "Vamp",
        lastName: "Hallow",
        email: "vamp@hallow.com",
        company: "Vampiire Codes",
        city: "Salem",
        state: "MA",
        country: "USA",
        paymentType: enums.PaymentTypes.check,
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

      test("creates student data object with a location {city, state, country} property", () => {
        const { city, state, country } = registrationData;
        expect(studentData.location).toEqual({ city, state, country });
      });

      test("creates payment data object {paymentType, invoiceDate, and amount} (course price)", () => {
        ["amount", "invoiceDate", "paymentType"].forEach(property => expect(paymentData).toHaveProperty(property));
      });
    });

    test("student not in db: registers and returns a new student", async () => {
      await Course.registerStudent(registrationData);
      expect(Course.prototype.registerNewStudent).toHaveBeenCalled();
    });

    test("student exists in db: registers and returns updated student", async () => {
      const {
        firstName,
        lastName,
        email,
        company,
        city,
        state,
        country,
      } = registrationData;
      const student = await Student.query().insert({
        firstName,
        lastName,
        email,
        company,
        location: { city, state, country },
      });

      await Course.registerStudent(registrationData);
      expect(Course.prototype.registerExistingStudent).toHaveBeenCalled();

      // delete student
      await Student.query().deleteById(student.id);
    });
  });

  // -- INSTANCE METHODS -- //

  describe("instance methods", () => {
    const studentData = {
      firstName: "Vamp",
      lastName: "Hallow",
      email: "vamp@hallow.com",
      company: "Vampiire Codes",
      location: {
        city: "Salem",
        state: "MA",
        country: "USA",
      },
    };

    describe("registerNewStudent", () => {
      let course;
      let student;
      let paymentData;
      beforeAll(async () => {
        course = await Course.query().findOne("start_date", ">", new Date());

        paymentData = {
          amount: course.price,
          invoiceDate: new Date().toISOString(),
          paymentType: enums.PaymentTypes.credit,
        };
      });

      afterAll(() => Student.query().del());

      test("creates and returns a student", async () => {
        student = await course.registerNewStudent(studentData, paymentData);
        expect(student.constructor.name).toBe("Student");
      });

      test("creates a payment association between the student and the course", async () => {
        await course.$loadRelated({ payments: true, students: true });
        expect(course.payments.length).toBe(1);
        expect(course.payments[0].studentId).toBe(student.id);
      });
    });

    describe("hasStudent", () => {
      let course;
      let paymentData;
      beforeAll(async () => {
        course = await Course.query()
          .where("start_date", ">", new Date())
          .first();

        paymentData = {
          amount: course.price,
          invoiceDate: new Date().toISOString(),
          paymentType: enums.PaymentTypes.credit,
        };
      });

      afterAll(() => Student.query().del());

      test("student is not registered for course: returns false", async () => {
        const result = await course.hasStudent(1);
        expect(result).toBe(false);
      });
      test("student is registered for course: returns true", async () => {
        const student = await course.registerNewStudent(
          studentData,
          paymentData,
        );
        expect(await course.hasStudent(student.id)).toBe(true);
      });
    });

    describe("registerExistingStudent", () => {
      let course;
      let result;
      let paymentData;
      let existingStudent;
      beforeAll(async () => {
        course = await Course.query()
          .where("start_date", ">", new Date())
          .first();

        existingStudent = await Student.query().insert(studentData);

        paymentData = {
          amount: course.price,
          invoiceDate: new Date().toISOString(),
          paymentType: enums.PaymentTypes.credit,
        };

        result = await course.registerExistingStudent(
          existingStudent,
          {
            ...studentData,
            // change location info to confirm update
            location: {
              city: "Tampa",
              state: "FL",
              country: "USA",
            },
          },
          paymentData,
        );
      });

      afterAll(() => Student.query().del());

      test("returns a student with updated data", () => {
        expect(result.location).not.toEqual(studentData.location);
      });

      test("creates a payment association between the existing student and the course", async () => {
        await course.$loadRelated({ payments: true, students: true });
        expect(course.payments.length).toBe(1);
        expect(course.payments[0].studentId).toBe(existingStudent.id);
      });

      test("student already registered: throws ValidationError", async () => {
        try {
          await course.registerExistingStudent(
            existingStudent,
            studentData,
            paymentData,
          );
        } catch (error) {
          expect(error instanceof ValidationError).toBe(true);
        }
      });
    });
  });
});
