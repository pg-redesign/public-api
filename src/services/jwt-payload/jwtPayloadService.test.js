const JWT = require("jsonwebtoken");

// integration test using real service, too critical to mock
const secretsService = require("../secrets");
const jwtPayloadService = require("./jwtPayloadService");

describe("JWT Payload Service", () => {
  test("createPaymentToken: signs a JWT with payment data { courseId, studentId, email }", async () => {
    const course = { id: 1 };
    const student = { id: 2, email: "vamp@mail.com" };
    const context = {
      env: process.env,
      services: { secrets: secretsService },
    };

    const token = await jwtPayloadService.createPaymentToken(
      course,
      student,
      context,
    );

    expect(token).toBeDefined();

    const { data } = JWT.decode(token);
    expect(data).toEqual({
      courseId: course.id,
      studentId: student.id,
      email: student.email,
    });
  });
});
