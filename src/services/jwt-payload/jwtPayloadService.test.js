const JWT = require("jsonwebtoken");
const SecretsManager = require("aws-sdk/clients/secretsmanager");
const jwtPayloadServiceInit = require("./jwtPayloadService");

const jwtPayloadService = jwtPayloadServiceInit(new SecretsManager());

describe("JWT Payload Service", () => {
  test("createPaymentToken: signs a JWT with payment data { courseId, studentId, email }", async () => {
    const course = { id: 1 };
    const student = { id: 2, email: "vamp@mail.com" };

    const token = await jwtPayloadService.createPaymentToken(course, student);
    expect(token).toBeDefined();

    const { data } = JWT.decode(token);
    expect(data).toEqual({
      courseId: course.id,
      studentId: student.id,
      email: student.email,
    });
  });
});
