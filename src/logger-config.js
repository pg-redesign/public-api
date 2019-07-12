const buildLogger = require("@vampiire/node-logger");
const expressLogger = require("express-winston").logger;

const inDevelopment = process.env.NODE_ENV !== "production";

const logger = buildLogger({
  levels: {
    error: 0,
    warn: 1,
    graphql: 2,
    debug: 3,
  },
  colors: {
    error: "bold red",
    warn: "italic yellow",
    graphql: "bold blue",
    debug: "cyan",
  },
});

const requestLogger = expressLogger({
  level: "graphql",
  winstonInstance: logger,
  colorize: inDevelopment,
  msg: "IP [{{req.ip}}], status {{res.statusCode}}, {{res.responseTime}}ms",
  // skip the gql playground ping requests
  skip: req => inDevelopment
    && req.body
    && req.body.operationName === "IntrospectionQuery",
  dynamicMeta: req => ({
    ip: req.ip,
    body: req.body,
  }),
});

module.exports = {
  logger,
  requestLogger,
};
