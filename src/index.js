const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { ApolloErrorConverter } = require("apollo-error-converter");

const utils = require("./utils");
const schemas = require("./schemas");
const services = require("./services");
const typeDefs = require("./api/type-defs");
const resolvers = require("./api/resolvers");
const { models, objectionErrorMap } = require("./db");
const { logger, requestLogger } = require("./logger-config");

const { env } = process;
const inDevelopment = env.NODE_ENV !== "production";

const app = express();
app.use([requestLogger]);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: inDevelopment,
  introspection: inDevelopment,
  formatError: new ApolloErrorConverter({
    errorMap: [objectionErrorMap],
    logger: logger.error.bind(logger),
  }),

  context: () => ({
    env,
    utils,
    logger,
    models,
    schemas,
    services,
  }),
});

server.applyMiddleware({
  app,
  cors: {
    credentials: true,
    optionsSuccessStatus: 200,
    origin: [env.CLIENT_ADDRESS].concat(
      inDevelopment ? [/^http:\/\/(localhost|127.0.0.1):\d{4,5}/] : [],
    ),
  },
});

app.listen(env.PORT, (error) => {
  if (error) {
    return logger.error(error);
  }
  return logger.graphql(`server up on http://localhost:${env.PORT}/graphql`);
});
