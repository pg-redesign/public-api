const buildToken = (sub, context) => context.services.authToken.signAdminToken(sub, context).token;

const buildAuthedRequestContext = (context) => {
  const sub = context.env.ADMIN_SUBS.split(",")[0];
  const token = buildToken(sub, context);

  return {
    req: { headers: { Authorization: `Bearer ${token}` } },
  };
};

module.exports = {
  buildToken,
  buildAuthedRequestContext,
};
