const BaseModel = require("../base-model");

const query = {
  first: jest.fn(() => query),
  where: jest.fn(() => query),
  insert: jest.fn(() => query),
  select: jest.fn(() => query),
};

const returnsAPromise = () => it("returns a Promise", () => {
  expect(BaseModel.create()).toBeInstanceOf(Promise);
});

describe("BaseModel static methods", () => {
  beforeAll(() => {
    BaseModel.query = () => query;
  });

  describe("create", () => {
    beforeAll(() => jest.clearAllMocks());

    returnsAPromise();

    it("creates and returns a row in the associated table", async () => {
      const data = {};

      await BaseModel.create(data);
      expect(query.insert).toHaveBeenCalledWith(data);
    });
  });

  describe("getBy", () => {
    beforeAll(() => jest.clearAllMocks());

    returnsAPromise();

    it("queries by a specific field { fieldName: value }", async () => {
      const field = {};

      await BaseModel.getBy(field);
      expect(query.where).toHaveBeenCalledWith(field);
    });

    it("returns the first result only", async () => {
      await BaseModel.getBy();
      expect(query.first).toHaveBeenCalled();
    });

    it("allows selecting specific columns", async () => {
      const columns = [];
      await BaseModel.getBy({}, columns);
      expect(query.select).toHaveBeenCalledWith(columns);
    });
  });

  describe("getAll", () => {
    beforeAll(() => jest.clearAllMocks());

    returnsAPromise();

    it("returns a list of results from the associated table", async () => {
      await BaseModel.getAll();
      expect(query.select).toHaveBeenCalled();
    });

    it("allows selecting specific columns", async () => {
      const columns = [];
      await BaseModel.getAll(columns);
      expect(query.select).toHaveBeenCalledWith(columns);
    });
  });
});
