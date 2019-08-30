const resolvers = require("../resolvers");

describe("Location Interface", () => {
  /* eslint-disable no-underscore-dangle */
  describe("Location __resolveType resolver", () => {
    test("receives an object with a 'mapUrl' property: returns 'CourseLocation'", () => {
      const locationObject = { mapUrl: "a url" };
      expect(resolvers.Location.__resolveType(locationObject)).toBe(
        "CourseLocation",
      );
    });
    test("receives an object with no additional properties: returns 'StudentLocation'", () => {
      const locationObject = { city: "Salem" };
      expect(resolvers.Location.__resolveType(locationObject)).toBe(
        "StudentLocation",
      );
    });
  });

  describe("base resolvers (shared across implementing types)", () => {
    describe("concatenated: returns 'city, state, country' format", () => {
      const mockLocation = { city: "city", state: "state", country: "country" };

      [
        {
          message: "on CourseLocation implementing type",
          implementingType: "CourseLocation",
        },
        {
          message: "on StudentLocation implementing type",
          implementingType: "StudentLocation",
        },
      ].forEach(testCase => test(testCase.message, () => expect(
        resolvers[testCase.implementingType].concatenated(mockLocation),
      ).toBe("city, state, country")));
    });
  });

  describe("CourseLocation implementing type", () => {
    test("CourseLocation.courses: returns a list of related Courses", async () => {
      const courseLocation = { getCourses: jest.fn() };
      await resolvers.CourseLocation.courses(courseLocation);
      expect(courseLocation.getCourses).toHaveBeenCalled();
    });
  });
});
