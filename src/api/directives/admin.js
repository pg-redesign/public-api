const { defaultFieldResolver } = require("graphql");
const {
  AuthenticationError,
  SchemaDirectiveVisitor,
} = require("apollo-server-express");

const isAdmin = (sub, env) => env.ADMIN_SUBS.split(",").includes(sub);

/* eslint-disable class-methods-use-this, no-param-reassign */
class AdminDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    // store the original resolver
    // if the field is a mapped scalar it wont have a custom resolver, use default
    const resolver = field.resolve || defaultFieldResolver;

    // reassign the fields resolver to the directive wrapper
    field.resolve = function adminResolve(...args) {
      const [context] = args.slice(2);
      const {
        logger, services, env, req: { ip, headers } = {},
      } = context;

      const authHeader = headers.Authorization;
      const bearerToken = authHeader && authHeader.split(" ")[1];
      const token = services.authToken.verifyToken(bearerToken, context);

      if (!token || !isAdmin(token.sub, env)) {
        logger.error("Auth token validation failed, request context:", {
          ip,
          headers,
          args: args[1],
          field: field.name,
        });

        throw new AuthenticationError(
          "Admin authentication required. Your request context has been logged for review.",
        );
      }

      // if auth checks pass call the original resolver
      return resolver.apply(this, args);
    };
  }
}

module.exports = AdminDirective;
