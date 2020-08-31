const { GoogleSpreadsheet } = require("google-spreadsheet");

const secretsService = require("../../secrets");
const getCoursesDoc = require("../getCoursesDoc");

jest.mock("google-spreadsheet");

describe("getCoursesDoc: loads and returns the Google Courses Sheet document", () => {
  describe("internal doc object caching behavior", () => {
    const context = {
      env: process.env,
      services: { secrets: secretsService },
    };

    let cachedDoc = null;

    beforeEach(() => jest.resetAllMocks());

    test("first call: authenticates, loads and returns a new GoogleSpreadsheet object", async () => {
      expect(cachedDoc).toBeNull();

      cachedDoc = await getCoursesDoc(context);

      expect(cachedDoc).toBeInstanceOf(GoogleSpreadsheet); // creates GoogleSpreadsheet object
      expect(
        GoogleSpreadsheet.prototype.useServiceAccountAuth,
      ).toHaveBeenCalled(); // authenticates
      expect(GoogleSpreadsheet.prototype.loadInfo).toHaveBeenCalled(); // loads data
    });

    test("future calls: reloads and returns the cached GoogleSpreadsheet object", async () => {
      const secondCallDoc = await getCoursesDoc(context);

      expect(cachedDoc === secondCallDoc).toBe(true);
      expect(
        GoogleSpreadsheet.prototype.useServiceAccountAuth,
      ).not.toHaveBeenCalled(); // does not re-authenticate
      expect(GoogleSpreadsheet.prototype.loadInfo).toHaveBeenCalled(); // does reload data
    });
  });
});
