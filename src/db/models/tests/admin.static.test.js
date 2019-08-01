const { NotFoundError } = require("objection");

const Admin = require("../admin");
const { connection } = require("../../connection");

// seeded by db/seeds/make-admins.js
describe("Admin static methods", () => {
  afterAll(() => connection.destroy());

  describe("signIn: completes admin authentication flow", () => {
    describe("success", () => {
      const sub = process.env.ADMIN_SUBS.split(",")[0];

      let admin;
      let previousLogin;
      beforeAll(async () => {
        previousLogin = new Date();
        previousLogin.setFullYear(previousLogin.getFullYear() - 1);
        await Admin.query()
          .where({ sub })
          .patch({ lastLogin: previousLogin.toISOString() });

        admin = await Admin.signIn({ sub });
      });

      test("finds an Admin by its AWS Cognito sub ID and updates the lastLogin field value", () => {
        expect(admin.lastLogin).not.toEqual(previousLogin);
      });

      test("returns the found Admin", async () => {
        expect(admin).toBeDefined();
        expect(admin.sub).toBe(sub);
      });
    });

    test("failure: invalid sub ID throws NotFoundError", () => {
      const sub = "invalid-sub";
      expect(Admin.signIn({ sub })).rejects.toThrow(NotFoundError);
    });
  });
});
