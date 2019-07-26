const { NotFoundError } = require("objection");

const Admin = require("../admin");
const { connection } = require("../../connection");

// seeded by db/seeds/make-admins.js
describe("Admin static methods", () => {
  afterAll(() => connection.destroy());

  describe("signIn: completes admin authentication flow", () => {
    test("success: finds and returns an Admin by its AWS Cognito sub ID", async () => {
      const sub = process.env.ADMIN_SUBS.split(",")[0];
      const output = await Admin.signIn({ sub });
      expect(output).toBeDefined();
      expect(output.sub).toBe(sub);
    });
    test("failure: invalid sub ID throws NotFoundError", () => {
      const sub = "invalid-sub";
      expect(Admin.signIn({ sub })).rejects.toThrow(NotFoundError);
    });
  });
});
