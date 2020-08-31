require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

const apiConfig = require("./api");
const { logger, requestLogger } = require("./loggers");

const { NODE_ENV, PORT } = process.env;

const app = express();
const graphqlServer = new ApolloServer(apiConfig);
const inDevelopment = NODE_ENV !== "production";

// healthcheck endpoint: before loggers to prevent flooding logs
app.get("/health", (_, res) => res.sendStatus(200));

app.use([requestLogger]);

graphqlServer.applyMiddleware({
  app,
  cors: {
    credentials: true,
    optionsSuccessStatus: 200,
    // allow subdomains
    origin: [/^https:\/\/(.+\.)?princeton-groundwater\.com$/].concat(
      // for local development
      inDevelopment ? [/^http:\/\/(localhost|127.0.0.1):\d{4,5}$/] : [],
    ),
  },
});

app.listen(PORT, error => {
  if (error) {
    return logger.error(error);
  }

  const startupLog = inDevelopment
    ? `API up on http://localhost:${PORT}/graphql`
    : `API listening on port: ${PORT}`;

  return logger.graphql(startupLog);
});
