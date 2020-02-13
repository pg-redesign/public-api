const secretsServiceBuilder = require("./secretsService");

const mockASMClient = { getSecretValue: jest.fn() };
const secretsService = secretsServiceBuilder(mockASMClient);

// this is really awkward but the only way to mock the 2 arg method that uses a callback
const configureGetSecretCallback = (err, data) =>
  mockASMClient.getSecretValue.mockImplementationOnce((_, cb) =>
    err ? cb(err, null) : cb(null, data),
  );

describe("Secrets Manager Service", () => {
  describe("getSecret", () => {
    const stringSecret = "a secret";
    const secretId = "a mock secret id";
    const parsedJSONSecret = {
      secretProperty: stringSecret,
    };

    it("resolves a String secret as a plain String", async () => {
      configureGetSecretCallback(null, { SecretString: stringSecret });

      return expect(secretsService.getSecret(secretId)).resolves.toBe(
        stringSecret,
      );
    });

    it("resolves A JSON secret as a parsed object", () => {
      configureGetSecretCallback(null, {
        SecretString: JSON.stringify(parsedJSONSecret),
      });

      return expect(secretsService.getSecret(secretId)).resolves.toEqual(
        parsedJSONSecret,
      );
    });

    it("rejects any ASM error encountered", () => {
      const error = new Error();
      configureGetSecretCallback(error, null);

      return expect(secretsService.getSecret(secretId)).rejects.toBe(error);
    });
  });
});
