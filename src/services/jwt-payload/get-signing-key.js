const { PAYLOAD_PRIVATE_KEY_NAME } = process.env;

module.exports = secretsClient =>
  new Promise((res, rej) =>
    secretsClient.getSecretValue(
      {
        SecretId: PAYLOAD_PRIVATE_KEY_NAME,
      },
      (err, data) => {
        if (err) return rej(err);
        const secretAsJSON = JSON.parse(data.SecretString);
        return res(secretAsJSON.PAYLOAD_PRIVATE_KEY);
      },
    ),
  );
