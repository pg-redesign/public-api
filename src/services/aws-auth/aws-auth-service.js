module.exports = awsAuth => ({
  async authenticateAdmin(code, context) {
    const { models, services } = context;

    const tokenData = await this.getAdminTokenData(code, context);
    const adminInfo = await this.getAdminInfo(tokenData.access_token);

    // throws if admin is invalid
    const admin = await models.Admin.signIn({
      tokenData,
      adminInfo,
    });

    return services.authToken.signAdminToken(admin, context);
  },

  async getAdminTokenData(authorizationCode, context) {
    const { env } = context;

    const res = await awsAuth.post("/token", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: {
        grant_type: "authorization_code",
        client_id: env.AWS_COGNITO_CLIENT_ID,
        authorization_code: authorizationCode,
        redirect_uri: env.AWS_COGNITO_REDIRECT_URI,
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

  async getAdminInfo(accessToken) {
    const res = await awsAuth.post("/userInfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    /*
      example response data:

      {
        "sub": "248289761001",
        "name": "Jane Doe",
        "given_name": "Jane",
        "family_name": "Doe",
        "preferred_username": "j.doe",
        "email": "janedoe@example.com"
      }
    */

    return res.data;
  },
});
