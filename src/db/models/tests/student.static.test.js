const Student = require("../student");
const { connection } = require("../../connection");

const studentData = {
  firstName: "vamp",
  lastName: "moon",
  email: "vampiire@vamp.com",
};

describe("Student static methods", () => {
  // destroy connection and cleanup DB
  afterAll(async () => {
    await Student.query().del();
    return connection.destroy();
  });

  describe("subscribeToMailingList", () => {
    beforeEach(() => Student.query().del());

    it("student exists: updates the mailingList field and returns true", async () => {
      const student = await Student.query().insertAndFetch(studentData);
      expect(student.mailingList).toBe(false);

      const output = await Student.subscribeToMailingList(studentData);
      expect(output).toBe(true);

      const { mailingList } = await Student.query().findById(student.id);
      expect(mailingList).toBe(true);
    });

    it("student does not exist: creates the student with mailingList field and returns true", async () => {
      const output = await Student.subscribeToMailingList(studentData);
      expect(output).toBe(true);

      const student = await Student.getBy({ email: studentData.email }, [
        "id",
        "mailingList",
      ]);
      expect(student.mailingList).toBe(true);
    });
  });
});
