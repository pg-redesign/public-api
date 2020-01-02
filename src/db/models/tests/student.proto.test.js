const { connection } = require("../../connection");

const studentMock = require("./__mocks__/student");
const {
  getNextCourse,
  createLocationsAndCourses,
  cleanupLocationsAndCourses,
} = require("./__mocks__/course");

describe("Student proto methods", () => {
  beforeAll(() => createLocationsAndCourses());
  afterAll(async () => {
    await cleanupLocationsAndCourses();
    await studentMock.destroyAllStudents();
    connection.destroy();
  });

  describe("getCoursePayment", () => {
    let course;
    let student;
    beforeAll(async () => {
      course = await getNextCourse();
      student = await studentMock.createStudent();
    });
    afterAll(() => studentMock.destroyStudent(student.id));

    it("returns null if the student is not associated with the course", () =>
      expect(student.getCoursePayment(course.id)).resolves.not.toBeDefined());

    it("returns the payment if the student is associated with the course", async () => {
      await course.registerExistingStudent(student, studentMock.studentData, {
        amount: course.price,
        invoiceDate: new Date().toISOString(),
      });

      const payment = await student.getCoursePayment(course.id);
      expect(payment.courseId).toBe(course.id);
    });

    it("allows for specific payment columns to be selected", async () => {
      const payment = await student.getCoursePayment(course.id, ["amount"]);
      expect(payment.amount).toBe(course.price);
      expect(payment.courseId).not.toBeDefined();
    });
  });
});
