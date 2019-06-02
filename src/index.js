const { ApolloServer } = require("apollo-server");
const logger = require("@vampiire/node-logger")();
const { ApolloErrorConverter } = require("apollo-error-converter");

const utils = require("./utils");
const { models } = require("./db");
const schemas = require("./schemas");
const services = require("./services");
const typeDefs = require("./api/type-defs");
const resolvers = require("./api/resolvers");

// TODO: CORS config
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: new ApolloErrorConverter({
    logger: logger.error.bind(logger),
  }),
  context: (options) => {
    const { req } = options;
    // TODO: log requests, logger.request() config in node-logger

    return {
      req,
      utils,
      logger,
      models,
      schemas,
      services,
    };
  },
});

server
  .listen(process.env.PORT)
  .then(serverInfo => logger.info(`server up on ${serverInfo.url}`))
  .catch(logger.error);
