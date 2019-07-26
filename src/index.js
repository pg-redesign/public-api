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

  context: ({ req }) => ({
    env,
    req,
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
    // allow subdomains
    origin: [/^https:\/\/(.+\.)?princeton-groundwater\.com$/]
      .concat(env.CLIENT_URL || []) // for development deployment
      .concat(env.ADMIN_CLIENT_URL || []) // for development deployment
      // for local development
      .concat(
        inDevelopment ? [/^http:\/\/(localhost|127.0.0.1):\d{4,5}$/] : [],
      ),
  },
});

app.listen(env.PORT, (error) => {
  if (error) {
    return logger.error(error);
  }

  const startupLog = inDevelopment
    ? `API up on http://localhost:${env.PORT}/graphql`
    : `API listening on port: ${env.PORT}`;

  return logger.graphql(startupLog);
});
