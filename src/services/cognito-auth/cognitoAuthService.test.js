const cognitoAuthService = require("./cognitoAuthService");

const awsCognitoMock = {
  post: jest.fn(),
};

const AdminModelMock = {
  signIn: jest.fn(),
};

const authTokenServiceMock = {
  signAdminToken: jest.fn(),
};

const context = {
  models: { Admin: AdminModelMock },
  services: { authToken: authTokenServiceMock },
  env: {
    AWS_COGNITO_CLIENT_ID: "app_client_id",
    AWS_COGNITO_REDIRECT_URI: "http://localhost:3000/success",
  },
};

const tokenDataMock = {
  access_token: "eyJz9sdfsdfsdfsd",
  refresh_token: "dn43ud8uj32nk2je",
  id_token: "dmcxd329ujdmkemkd349r",
  token_type: "Bearer",
  expires_in: 3600,
};

const adminInfoMock = {
  sub: "248289761001",
  name: "Jane Doe",
  given_name: "Jane",
  family_name: "Doe",
  preferred_username: "j.doe",
  email: "janedoe@example.com",
};

const authCodeMock = "auth_code";

describe("AWS Auth Service", () => {
  describe("getTokenData", () => {
    let output;
    beforeAll(async () => {
      awsCognitoMock.post.mockImplementationOnce(() => ({
        data: tokenDataMock,
      }));

      output = await cognitoAuthService(awsCognitoMock).getTokenData(
        authCodeMock,
        context,
      );
    });
    afterAll(() => jest.clearAllMocks());

    test("targets /oauth2/token endpoint with Content-Type header expected by AWS Cognito [7/24/19]", () => {
      const mockRequest = awsCognitoMock.post.mock.calls[0];
      const endpoint = mockRequest[0];
      const options = mockRequest[2];

      expect(endpoint).toBe("/token");
      expect(options.headers).toEqual({
        "Content-Type": "application/x-www-form-urlencoded",
      });
    });

    test("sets payload body in URL encoded form expected by AWS Cognito token endpoint [7/24/19]", () => {
      const mockRequestPayload = awsCognitoMock.post.mock.calls[0][1];
      const { AWS_COGNITO_CLIENT_ID, AWS_COGNITO_REDIRECT_URI } = context.env;

      const expectedPayload = `code=${authCodeMock}&grant_type=authorization_code&client_id=${AWS_COGNITO_CLIENT_ID}&redirect_uri=${AWS_COGNITO_REDIRECT_URI}`
        .replace(/\//g, "%2F")
        .replace(/:/g, "%3A");

      expect(mockRequestPayload).toBe(expectedPayload);
    });

    test("returns the token data object", () =>
      expect(output).toEqual(tokenDataMock));
  });

  describe("getUserInfo", () => {
    const accessToken = "access.token";

    let output;
    beforeAll(async () => {
      awsCognitoMock.post.mockImplementationOnce(() => ({
        data: adminInfoMock,
      }));

      output = await cognitoAuthService(awsCognitoMock).getUserInfo(
        accessToken,
      );
    });
    afterAll(() => jest.clearAllMocks());

    test("targets /oauth2/userInfo endpoint setting Authorization header expected by AWS Cognito [7/24/19]", () => {
      const mockRequest = awsCognitoMock.post.mock.calls[0];
      const endpoint = mockRequest[0];
      const options = mockRequest[2];

      expect(endpoint).toBe("/userInfo");
      expect(options.headers).toEqual({
        Authorization: `Bearer ${accessToken}`,
      });
    });

    test("returns the admin info object", () =>
      expect(output).toEqual(adminInfoMock));
  });

  describe("authenticateAdmin", () => {
    const mockedService = cognitoAuthService(awsCognitoMock);
    mockedService.getUserInfo = jest.fn(() => adminInfoMock);
    mockedService.getTokenData = jest.fn(() => tokenDataMock);

    beforeAll(() => mockedService.authenticateAdmin(authCodeMock, context));

    test("retrieves the admin token data and identity from AWS Cognito", () => {
      expect(mockedService.getTokenData).toHaveBeenCalled();
      expect(mockedService.getUserInfo).toHaveBeenCalled();
    });

    test("returns an API signed admin token object", () =>
      expect(context.services.authToken.signAdminToken).toHaveBeenCalled());
  });
});
