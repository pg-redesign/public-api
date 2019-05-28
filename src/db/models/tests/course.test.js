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

    test("course not found: throws NotFoundError", async () => {
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
  describe("static registerStudent", () => {});

  // -- INSTANCE METHODS -- //

  describe("instance registerNewStudent", () => {
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

    let course;
    let student;
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

  describe("instance hasStudent", () => {
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
      const student = await course.registerNewStudent(studentData, paymentData);
      expect(await course.hasStudent(student.id)).toBe(true);
    });
  });

  describe("instance registerExistingStudent", () => {
    const initialStudentData = {
      firstName: "Vamp",
      lastName: "Hallow",
      email: "vamp@hallow.com",
      company: "Vampiire Codes",
      location: {
        city: "Tampa",
        state: "FL",
        country: "USA",
      },
    };

    let course;
    let result;
    let paymentData;
    let existingStudent;
    beforeAll(async () => {
      course = await Course.query()
        .where("start_date", ">", new Date())
        .first();

      existingStudent = await Student.query().insert(initialStudentData);

      paymentData = {
        amount: course.price,
        invoiceDate: new Date().toISOString(),
        paymentType: enums.PaymentTypes.credit,
      };

      result = await course.registerExistingStudent(
        existingStudent,
        {
          ...initialStudentData,
          // change location info to confirm update
          location: {
            city: "Salem",
            state: "MA",
            country: "USA",
          },
        },
        paymentData,
      );
    });

    afterAll(() => Student.query().del());

    test("returns a student with updated data", () => {
      expect(result.location).not.toEqual(initialStudentData.location);
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
          initialStudentData,
          paymentData,
        );
      } catch (error) {
        expect(error instanceof ValidationError).toBe(true);
      }
    });
  });
});
