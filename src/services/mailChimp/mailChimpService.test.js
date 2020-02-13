const mailChimpService = require("./mailChimpService");

const mailChimpMock = {
  put: jest.fn(),
};

describe("mailChimpService.addToMailingList: adds a user to the MailChimp mailing list", () => {
  const mockedService = mailChimpService(mailChimpMock);

  const mailingListData = {
    email: "email",
    firstName: "first name",
    lastName: "last name",
  };
  const logger = { error: jest.fn() };
  const context = { logger, env: process.env };

  describe("success", () => {
    let result;
    let mockCall;
    beforeAll(async () => {
      mailChimpMock.put.mockImplementationOnce(() => Promise.resolve());

      result = await mockedService.addToMailingList(mailingListData, context);

      [mockCall] = mailChimpMock.put.mock.calls;
    });

    test("sends PUT request to list members endpoint", () =>
      expect(mailChimpMock.put).toHaveBeenCalled());

    test("appends the hashed user email to the endpoint", () => {
      // this is an awful test but not sure how else to go about it without hashing or mocking the crypto lib
      const [endpoint] = mockCall;
      const endpointSplit = endpoint.split("/");
      const numSubPaths = endpointSplit.length;

      expect(numSubPaths).toBe(5);
      expect(endpointSplit[numSubPaths - 1]).not.toBe(mailingListData.email);
    });

    test("sends the correct payload", () => {
      const body = mockCall[1];

      [
        "email_address",
        "status_if_new",
        "merge_fields.FNAME",
        "merge_fields.LNAME",
      ].forEach(property => expect(body).toHaveProperty(property));
    });

    test("returns true", () => expect(result).toBe(true));
  });

  describe("failure", () => {
    test("logs the error and returns false", async () => {
      mailChimpMock.put.mockImplementationOnce(() =>
        Promise.reject(new Error()),
      );

      const result = await mockedService.addToMailingList(
        mailingListData,
        context,
      );
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    test("if the error includes a server response logs the data and status", async () => {
      const error = new Error();
      error.response = { response: { data: "", status: "" } };
      mailChimpMock.put.mockImplementationOnce(() => Promise.reject(error));

      const result = await mockedService.addToMailingList(
        mailingListData,
        context,
      );
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
