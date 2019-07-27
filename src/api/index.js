const { ApolloErrorConverter } = require("apollo-error-converter");

const typeDefs = require("./type-defs");
const resolvers = require("./resolvers");
const schemaDirectives = require("./directives");

const utils = require("../utils");
const schemas = require("../schemas");
const services = require("../services");
const { logger } = require("../loggers");
const { models, objectionErrorMap } = require("../db");

const { env } = process;
const inDevelopment = env.NODE_ENV !== "production";

module.exports = {
  typeDefs,
  resolvers,
  schemaDirectives,
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
};
