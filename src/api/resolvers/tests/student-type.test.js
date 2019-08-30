const { Student } = require("../types");

describe("Student Type resolvers", () => {
  describe("Student.courses", () => {
    const student = { getCourses: jest.fn() };

    it("returns a list of Courses the Student has registered for", async () => {
      await Student.courses(student);
      expect(student.getCourses).toHaveBeenCalled();
    });
  });

  describe("Student.payments", () => {
    const student = { getPayments: jest.fn() };

    it("returns a list of Student Payments for registered Courses", async () => {
      await Student.payments(student);
      expect(student.getPayments).toHaveBeenCalled();
    });
  });
});
