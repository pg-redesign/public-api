const { ApolloServer } = require("apollo-server");
const logger = require("@vampiire/node-logger")();

const utils = require("./utils");
const { models } = require("./db");
const schemas = require("./schemas");
const typeDefs = require("./api/type-defs");
const resolvers = require("./api/resolvers");

const server = new ApolloServer({
  resolvers,
  typeDefs,
  context: (options) => {
    const { req } = options;

    return {
      req,
      utils,
      logger,
      models,
      schemas,
    };
  },
});

server
  .listen(process.env.PORT)
  .then(serverInfo => logger.info(`server up on ${serverInfo.url}`))
  .catch(logger.error);
