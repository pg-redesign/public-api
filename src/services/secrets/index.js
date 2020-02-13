const SecretsManager = require("aws-sdk/clients/secretsmanager");
const secretsService = require("./secretsService");

const ASMClient = new SecretsManager({});

module.exports = secretsService(ASMClient);
