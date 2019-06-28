const { ApolloServer } = require("apollo-server");
const logger = require("@vampiire/node-logger")();
const { ApolloErrorConverter } = require("apollo-error-converter");

const utils = require("./utils");
const schemas = require("./schemas");
const services = require("./services");
const typeDefs = require("./api/type-defs");
const resolvers = require("./api/resolvers");
const { models, objectionErrorMap } = require("./db");

const inDevelopment = process.env.NODE_ENV !== "production";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: inDevelopment,
  introspection: inDevelopment,
  formatError: new ApolloErrorConverter({
    errorMap: [objectionErrorMap],
    logger: logger.error.bind(logger),
  }),
  cors: {
    credentials: true,
    optionsSuccessStatus: 200,
    origin: [process.env.CLIENT_ADDRESS].concat(
      inDevelopment ? [/^http:\/\/(localhost|127.0.0.1):\d{4,5}/] : [],
    ),
  },

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
