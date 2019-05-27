const { GraphQLJSON } = require("graphql-type-json");
const { URL, EmailAddress } = require("@okgrow/graphql-scalars");

module.exports = {
  URL,
  EmailAddress,
  JSON: GraphQLJSON,
};
