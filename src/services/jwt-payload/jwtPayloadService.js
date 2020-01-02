const jwt = require("jsonwebtoken");
const getSigningKey = require("./get-signing-key");

// cache key to limit AWS requests
let payloadPrivateKey = null;

module.exports = secretsClient => {
  const create = async config => {
    const { data, ...configOptions } = config;

    if (!payloadPrivateKey) {
      payloadPrivateKey = await getSigningKey(secretsClient);
    }

    const options = {
      ...configOptions,
      algorithm: "RS256",
      issuer: process.env.API_HOST,
    };

    return jwt.sign({ data }, payloadPrivateKey, options);
  };

  const createPaymentToken = (course, student) =>
    create({
      audience: "client",
      subject: "registration",
      data: {
        courseId: course.id,
        studentId: student.id,
        email: student.email,
      },
    });

  return {
    create,
    createPaymentToken,
  };
};
