const aws = require("aws-sdk");
const nodeMailer = require("nodemailer");

aws.config.update({
  region: process.env.AWS_SES_REGION,
  accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
});

const emailClient = nodeMailer.createTransport({
  SES: new aws.SES({
    apiVersion: "2010-12-01",
  }),
});

module.exports = require("./emailService")(emailClient);
