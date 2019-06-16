const { ValidationError, NotFoundError } = require("objection");

const Course = require("../course");
const Student = require("../student");
const { enums } = require("../../../schemas");
const { connection } = require("../../connection");

const studentMock = require("./__mocks__/student");

describe("Course prototype methods", () => {
  const { studentData } = studentMock;

  afterAll(() => connection.destroy());

  describe("registerNewStudent", () => {
    let course;
    let registeredStudent;
    beforeAll(async () => {
      course = await Course.query().findOne("start_date", ">", new Date());

      const paymentData = {
        amount: course.price,
        invoiceDate: new Date().toISOString(),
      };

      registeredStudent = await course.registerNewStudent(
        studentData,
        paymentData,
      );
    });

    afterAll(() => Student.query().del());

    test("creates and returns a student", async () => {
      expect(registeredStudent.constructor.name).toBe("Student");
    });

    test("creates a payment association between the student and the course", async () => {
      await course.$loadRelated({ payments: true, students: true });
      expect(course.payments.length).toBe(1);
      expect(course.payments[0].studentId).toBe(registeredStudent.id);
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
      };
    });

    afterAll(() => Student.query().del());

    test("student is not registered for course: returns false", async () => expect(course.hasStudent(1)).resolves.toBe(false));

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

  describe("getRegisteredStudent", () => {
    let course;
    let registeredStudent;
    beforeAll(async () => {
      course = await Course.query()
        .where("start_date", ">", new Date())
        .first();

      const { student } = await Course.registerStudent({
        courseId: course.id,
        paymentType: enums.PaymentTypes.credit,
        ...studentMock.studentRegistrationData,
      });

      registeredStudent = student;
    });
    afterAll(() => Student.query().del());

    test("student is registered: returns the student", async () => {
      const result = await course.getRegisteredStudent(registeredStudent.id);
      expect(result.id).toBe(registeredStudent.id);
    });

    test("student not registered: throws NotFoundError", () => expect(course.getRegisteredStudent(0)).rejects.toBeInstanceOf(
      NotFoundError,
    ));

    test("columns arg: only returns chosen columns", async () => {
      const result = await course.getRegisteredStudent(registeredStudent.id, [
        "first_name",
      ]);
      expect(result).toEqual({ firstName: registeredStudent.firstName });
    });
  });

  describe("completeStudentRegistration", () => {
    const mockConfirmationId = "a confirmation ID";

    let result;
    let chosenPaymentType;
    let registeredStudent;
    beforeAll(async () => {
      const course = await Course.query()
        .where("start_date", ">", new Date())
        .first();

      const { student } = await Course.registerStudent({
        courseId: course.id,
        ...studentMock.studentRegistrationData,
      });

      registeredStudent = student;
      chosenPaymentType = enums.PaymentTypes.credit;

      result = await course.completeStudentRegistration(
        registeredStudent.id,
        mockConfirmationId,
        chosenPaymentType,
      );
    });
    afterAll(() => Student.query().del());

    test("returns the updated student", () => expect(result.id).toBe(registeredStudent.id));

    test("sets the student's payment date, payment type, and confirmation ID", () => {
      const { confirmationId, paymentDate, paymentType } = result;

      expect(paymentDate).not.toBeNull();
      expect(paymentType).toBe(chosenPaymentType);
      expect(confirmationId).toBe(mockConfirmationId);
    });
  });
});
