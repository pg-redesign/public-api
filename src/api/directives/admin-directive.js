const { AuthenticationError } = require("apollo-server-express");

const isAdmin = (sub, env) => env.ADMIN_SUBS.split(",").includes(sub);

const requireAdminReplacer = (originalResolver, directiveContext) => function requireAdminResolver(...args) {
  const [context] = args.slice(2);
  const {
    env,
    logger,
    services,
    req: { ip, headers },
  } = context;

  const authHeader = headers.Authorization;
  const bearerToken = authHeader && authHeader.split(" ")[1];
  const token = services.authToken.verifyToken(bearerToken, context);

  if (!token || !isAdmin(token.sub, env)) {
    const { objectType, field } = directiveContext;

    logger.error(
      "Failed request for Admin protected data, request context:",
      {
        ip,
        headers,
        args: args[1],
        type: objectType,
        field: field.name,
      },
    );

    throw new AuthenticationError(
      "Admin authorization required. Your request context has been logged for review.",
    );
  }

  // if auth checks pass call the original resolver
  return originalResolver.apply(this, args);
};

module.exports = {
  isAdmin,
  requireAdminReplacer,
  adminDirectiveConfig: {
    name: "admin",
    resolverReplacer: requireAdminReplacer,
  },
};
