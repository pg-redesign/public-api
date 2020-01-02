const AWS = require("aws-sdk/global");

const configure = () =>
  new Promise((res, rej) =>
    AWS.config.getCredentials(error => {
      return error ? rej(error) : res();
    }),
  );

module.exports = async () => {
  await configure();
  AWS.config.update({
    region: process.env.AWS_REGION,
  });
};
