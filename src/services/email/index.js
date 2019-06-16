const aws = require("aws-sdk");
const nodeMailer = require("nodemailer");

const emailClient = nodeMailer.createTransport({
  SES: new aws.SES({
    apiVersion: "2010-12-01",
  }),
  sendingRate: 1, // limit 1 email per second
});

module.exports = require("./emailService")(emailClient);
