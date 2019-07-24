const awsAuthService = require("../aws-auth-service");

const awsAuthMock = {
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
  describe("getAdminTokenData", () => {
    let output;
    beforeAll(async () => {
      awsAuthMock.post.mockImplementationOnce(() => ({
        data: tokenDataMock,
      }));

      output = await awsAuthService(awsAuthMock).getAdminTokenData(
        authCodeMock,
        context,
      );
    });
    afterAll(() => jest.clearAllMocks());

    test("targets /oauth2/token endpoint with Content-Type header expected by AWS Cognito [7/24/19]", () => {
      const [endpoint, options] = awsAuthMock.post.mock.calls[0];
      expect(endpoint).toBe("/token");
      expect(options.headers).toEqual({
        "Content-Type": "application/x-www-form-urlencoded",
      });
    });

    test("sets grant_type, client_id, authorization_code, and redirect_uri expected by AWS Cognito token endpoint [7/24/19]", () => {
      const options = awsAuthMock.post.mock.calls[0][1];
      const expectedRequestBody = {
        grant_type: "authorization_code",
        client_id: context.env.AWS_COGNITO_CLIENT_ID,
        authorization_code: authCodeMock,
        redirect_uri: context.env.AWS_COGNITO_REDIRECT_URI,
      };

      expect(options.body).toEqual(expectedRequestBody);
    });

    test("returns the token data object", () => expect(output).toEqual(tokenDataMock));
  });

  describe("getAdminInfo", () => {
    const accessToken = "access.token";

    let output;
    beforeAll(async () => {
      awsAuthMock.post.mockImplementationOnce(() => ({
        data: adminInfoMock,
      }));

      output = await awsAuthService(awsAuthMock).getAdminInfo(accessToken);
    });
    afterAll(() => jest.clearAllMocks());

    test("targets /oauth2/userInfo endpoint setting Authorization header expected by AWS Cognito [7/24/19]", () => {
      const [endpoint, options] = awsAuthMock.post.mock.calls[0];

      expect(endpoint).toBe("/userInfo");
      expect(options.headers).toEqual({
        Authorization: `Bearer ${accessToken}`,
      });
    });

    test("returns the admin info object", () => expect(output).toEqual(adminInfoMock));
  });

  describe("authenticateAdmin", () => {
    const mockedService = awsAuthService(awsAuthMock);
    mockedService.getAdminInfo = jest.fn(() => adminInfoMock);
    mockedService.getAdminTokenData = jest.fn(() => tokenDataMock);

    beforeAll(() => mockedService.authenticateAdmin(authCodeMock, context));

    test("retrieves the admin token data and identity from AWS Cognito", () => {
      expect(mockedService.getAdminTokenData).toHaveBeenCalled();
      expect(mockedService.getAdminInfo).toHaveBeenCalled();
    });

    test("returns an API signed admin token object", () => expect(context.services.authToken.signAdminToken).toHaveBeenCalled());
  });
});
