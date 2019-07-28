/* eslint-disable class-methods-use-this, no-param-reassign, no-underscore-dangle */

const {
  AuthenticationError,
  SchemaDirectiveVisitor,
} = require("apollo-server-express");
const { defaultFieldResolver } = require("graphql");

// confirm the token sub matches a valid admin sub id
class AdminDirective extends SchemaDirectiveVisitor {
  // astNode.name.value -> getStudents
  visitObject(type) {
    // console.log(JSON.stringify({ ...type }, null, 2));
    this.wrapObjectTypeFields(type);
  }

  visitFieldDefinition(_, details) {
    this.wrapObjectTypeFields(details.objectType);
  }

  wrapObjectTypeFields(objectType) {
    // Mark the GraphQLObjectType object to avoid re-wrapping:
    if (objectType._authFieldsWrapped) return;
    objectType._authFieldsWrapped = true;

    const fields = objectType.getFields();

    Object.values(fields).forEach((field) => {
      const originalResolver = field.resolve || defaultFieldResolver;
      field.resolve = this.requireAdmin(originalResolver, {
        objectType,
        field,
      });
    });
  }

  static isAdmin(sub, env) {
    return env.ADMIN_SUBS.split(",").includes(sub);
  }

  requireAdmin(originalResolver, queryContext) {
    return function requireAdminResolver(...args) {
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

      if (!token || !AdminDirective.isAdmin(token.sub, env)) {
        const { objectType, field } = queryContext;

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
  }
}

module.exports = AdminDirective;
