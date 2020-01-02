const nodeMailer = require("nodemailer");
const SimpleEmailService = require("aws-sdk/clients/ses");

const emailClient = nodeMailer.createTransport({
  SES: new SimpleEmailService(),
});

module.exports = require("./emailService")(emailClient);
