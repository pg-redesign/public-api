module.exports = secretsClient => {
  const getSecret = SecretId => {
    return new Promise((res, rej) =>
      secretsClient.getSecretValue(
        {
          SecretId,
        },
        (err, data) => {
          if (err) return rej(err);

          const { SecretString } = data;

          try {
            // try to parse JSON into an object
            return res(JSON.parse(SecretString));
          } catch (_) {
            // SyntaxError because secret is a plain string
            return res(SecretString);
          }
        },
      ),
    );
  };

  return {
    getSecret,
  };
};
