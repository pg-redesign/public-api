const { connection } = require("../../connection");
const CourseLocation = require("../course-location");

const location = {
  city: "Salem",
  state: "MA",
  country: "USA",
  mapUrl: "https://goo.gl/maps/c0D3",
};

describe("CourseLocation static methods", () => {
  afterAll(() => connection.destroy());

  test("create: creates and returns a new CourseLocation", async () => {
    const courseLocation = await CourseLocation.create(location);

    expect(courseLocation).toBeDefined();
    expect(courseLocation.mapUrl).toBe(location.mapUrl);
    return courseLocation.$query().del();
  });

  describe("getBy", () => {
    let courseLocation;
    beforeAll(async () => {
      courseLocation = await CourseLocation.create(location);
    });
    afterAll(() => courseLocation.$query().del());

    it("returns a CourseLocation by a field { id: value }", async () => {
      const output = await CourseLocation.getBy({ id: courseLocation.id });
      expect(output.id).toBe(courseLocation.id);
    });

    it("returns a CourseLocation by another field { city: value }", async () => {
      const output = await CourseLocation.getBy({ city: location.city });
      expect(output.id).toBe(courseLocation.id);
    });

    it("allows specific columns to be selected", async () => {
      const output = await CourseLocation.getBy({ id: courseLocation.id }, [
        "city",
        "mapUrl",
      ]);
      expect(output.state).not.toBeDefined();
      expect(output.mapUrl).toBe(location.mapUrl);
    });
  });

  describe("getAll", () => {
    const otherLocation = {
      ...location,
      city: "Boston",
    };

    let courseLocations;
    beforeAll(async () => {
      courseLocations = await Promise.all(
        [location, otherLocation].map(locationData => CourseLocation.create(locationData)),
      );
    });
    afterAll(() => Promise.all(
      courseLocations.map(courseLocation => courseLocation.$query().del()),
    ));

    it("returns all CourseLocation entries", async () => {
      const output = await CourseLocation.getAll();
      expect(output.length).toBe(courseLocations.length);
      expect(
        output.every(entry => courseLocations.some(
          courseLocation => entry.id === courseLocation.id,
        )),
      ).toBe(true);
    });

    it("allows specific columns to be selected", async () => {
      const output = await CourseLocation.getAll(["state"]);
      output.forEach((courseLocation) => {
        expect(courseLocation.state).toBeDefined();
        expect(courseLocation.id).not.toBeDefined();
      });
    });
  });
});
