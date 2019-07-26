const qs = require("querystring");

module.exports = awsCognito => ({
  async authenticateAdmin(code, context) {
    const { models, services } = context;

    const tokenData = await this.getTokenData(code, context);
    const adminInfo = await this.getUserInfo(tokenData.access_token);

    // throws if admin info is invalid
    const admin = await models.Admin.signIn(adminInfo);

    return services.authToken.signAdminToken(admin, context);
  },

  async getTokenData(authorizationCode, context) {
    const { env } = context;

    const payload = qs.stringify({
      code: authorizationCode,
      grant_type: "authorization_code",
      client_id: env.AWS_COGNITO_CLIENT_ID,
      redirect_uri: env.AWS_COGNITO_REDIRECT_URI,
    });

    const res = await awsCognito.post("/token", payload, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    /*
      example response data:

      {
        "access_token":"eyJz9sdfsdfsdfsd",
        "refresh_token":"dn43ud8uj32nk2je",
        "id_token":"dmcxd329ujdmkemkd349r",
        "token_type":"Bearer",
        "expires_in":3600
      }
    */
    return res.data;
  },

  async getUserInfo(accessToken) {
    const res = await awsCognito.post("/userInfo", null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    /*
      example response data:

      {
        "sub": "248289761001",
        "phone_number": "+15555556693"
        "email": "janedoe@example.com"
      }
    */

    return res.data;
  },
});
