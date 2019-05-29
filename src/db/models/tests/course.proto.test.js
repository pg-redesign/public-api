const { ValidationError } = require("objection");

const Course = require("../course");
const Student = require("../student");
const { enums } = require("../../../schemas");
const { connection } = require("../../connection");

describe("Course prototype methods", () => {
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

  afterAll(() => connection.destroy());

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
      const student = await course.registerNewStudent(studentData, paymentData);
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
