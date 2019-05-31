const format = require("../format");

describe("format utilities", () => {
  describe("courseDateRange(): formats Course date ranges by language", () => {
    const { courseDateRange } = format;

    const startDate = new Date("October 24, 2020");
    const endDate = new Date("October 31, 2020");

    test("ENGLISH: returns format 'Month DD-DD, YYYY'", () => {
      const expected = "October 24-31, 2020";
      expect(courseDateRange(startDate, endDate, "ENGLISH")).toBe(expected);
    });

    test("PORTUGUESE: returns format 'DD a DD de month de YYYY'", () => {
      const expected = "24 a 31 de outubro de 2020";
      expect(courseDateRange(startDate, endDate, "PORTUGUESE")).toBe(expected);
    });
  });
});
