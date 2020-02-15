const jwt = require("jsonwebtoken");

// cache key to limit AWS requests
let payloadPrivateKey = null;

const create = async (config, context) => {
  const { data, ...configOptions } = config;
  const { env, services } = context;
  const { API_DOMAIN, PAYLOAD_PRIVATE_KEY_ASM_ID } = env;

  if (!payloadPrivateKey) {
    // TODO: store as private key string only? no jsonKey label
    // have to update client pipeline access for building public key
    const secret = await services.secrets.getSecret(PAYLOAD_PRIVATE_KEY_ASM_ID);
    payloadPrivateKey = secret.PAYLOAD_PRIVATE_KEY;
  }

  const options = {
    ...configOptions,
    issuer: API_DOMAIN,
    algorithm: "RS256",
  };

  return jwt.sign({ data }, payloadPrivateKey, options);
};

const createPaymentToken = (course, student, context) =>
  create(
    {
      audience: "client",
      subject: "registration",
      data: {
        courseId: course.id,
        studentId: student.id,
        email: student.email,
      },
    },
    context,
  );

module.exports = {
  create,
  createPaymentToken,
};
