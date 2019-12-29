const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const apiConfig = require("./api");
const { logger, requestLogger } = require("./loggers");

const app = express();
const graphqlServer = new ApolloServer(apiConfig);
const inDevelopment = process.env.NODE_ENV !== "production";

app.use([requestLogger]);

graphqlServer.applyMiddleware({
  app,
  cors: {
    credentials: true,
    optionsSuccessStatus: 200,
    // allow subdomains
    origin: [/^https:\/\/(.+\.)?princeton-groundwater\.com$/]
      .concat(process.env.CLIENT_ORIGIN || []) // for development deployment
      .concat(process.env.ADMIN_CLIENT_ORIGIN || []) // for development deployment
      // for local development
      .concat(
        inDevelopment ? [/^http:\/\/(localhost|127.0.0.1):\d{4,5}$/] : [],
      ),
  },
});

app.listen(process.env.PORT, error => {
  if (error) {
    return logger.error(error);
  }

  const startupLog = inDevelopment
    ? `API up on http://localhost:${process.env.PORT}/graphql`
    : `API listening on port: ${process.env.PORT}`;

  return logger.graphql(startupLog);
});
