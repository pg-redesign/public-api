const { ApolloServer } = require("apollo-server-express");
const config = require("../api"); // { resolvers, typeDefs, schemaDirectives, context, ... }

const baseContext = config.context({});

class ApolloTestServer extends ApolloServer {
  constructor(serverConfig) {
    super(serverConfig);
    this.context = baseContext;
  }

  setContext(newContext) {
    this.context = newContext;
  }

  mergeContext(partialContext) {
    this.context = Object.assign({}, this.context, partialContext);
  }

  resetContext() {
    this.context = baseContext;
  }
}

module.exports = {
  baseContext,
  testServer: new ApolloTestServer(config),
};
