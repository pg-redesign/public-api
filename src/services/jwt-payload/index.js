const SecretsManager = require("aws-sdk/clients/secretsmanager");

const secretsClient = new SecretsManager({});

module.exports = require("./jwtPayloadService")(secretsClient);
