const jwt = require("jsonwebtoken");
const { signAdminToken, verifyToken } = require("./index");

jest.mock("jsonwebtoken");

const context = {
  env: { AUTH_TOKEN_SIGNING_SECRET: "test", API_DOMAIN: "localhost" },
};

const token = "some.long.token";

describe("Auth Token Service", () => {
  test("signAdminToken: returns an object with a signed admin token in the form { token, expiresIn }", () => {
    const adminSubId = "admin-sub-id";
    jwt.sign.mockImplementationOnce(() => token);

    const output = signAdminToken(adminSubId, context);
    expect(output.token).toBe(token);
    expect(output.expiresIn).toBeDefined();
  });

  test("verifyToken: verifies the signature and issuer, returns the decoded token", () => {
    const decodedToken = {};
    jwt.verify.mockImplementationOnce(() => decodedToken);

    const output = verifyToken(token, context);
    expect(jwt.verify).toHaveBeenCalledWith(
      token,
      context.env.AUTH_TOKEN_SIGNING_SECRET,
      { iss: context.env.API_DOMAIN, algorithms: ["HS256"] },
    );
    expect(output).toBe(decodedToken);
  });
});
