const { isAdmin, requireAdminReplacer } = require("../admin-directive");

const validSubId = "admin-sub-id";
const env = {
  ADMIN_SUBS: `${validSubId},another-admin-sub-id`,
};

describe("@admin directive", () => {
  describe("isAdmin utility", () => {
    test("valid admin sub ID: returns true", () =>
      expect(isAdmin(validSubId, env)).toBe(true));
    test("invalid admin sub ID: returns false", () =>
      expect(isAdmin("nonsense-sub-id", env)).toBe(false));
  });

  describe("requireAdminReplacer -> requireAdminResolver", () => {
    const originalResolver = jest.fn();
    const directiveContext = { objectType: "Course", field: "students" };

    const logger = { error: jest.fn() };
    const req = {
      ip: "ip.address",
      headers: {
        Authorization: "Bearer token",
      },
    };
    const services = { authToken: { verifyToken: jest.fn() } };
    const context = {
      req,
      env,
      logger,
      services,
    };

    test("valid admin authentication: returns a call to the original resolver", async () => {
      services.authToken.verifyToken.mockImplementationOnce(() => ({
        sub: validSubId,
      }));

      const requireAdminResolver = requireAdminReplacer(
        originalResolver,
        directiveContext,
      );

      await requireAdminResolver(null, {}, context);
      expect(originalResolver).toHaveBeenCalled();
    });

    describe("failure cases: logs the failed request context and throws an AuthenticationError", () => {
      afterEach(() => jest.clearAllMocks());

      const testFailCase = async () => {
        const requireAdminResolver = requireAdminReplacer(
          originalResolver,
          directiveContext,
        );

        try {
          await requireAdminResolver(null, {}, context);
        } catch (error) {
          expect(logger.error).toHaveBeenCalled();
          expect(error.name).toBe("AuthenticationError");
        }
      };

      test("invalid bearer token", () => {
        services.authToken.verifyToken.mockImplementationOnce(() => null);
        return testFailCase();
      });

      test("token.sub is not a valid admin sub ID", () => {
        services.authToken.verifyToken.mockImplementationOnce(() => ({
          sub: "nonsense-sub-id",
        }));
        return testFailCase();
      });
    });
  });
});
