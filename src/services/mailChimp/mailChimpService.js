const { createHash } = require("crypto");

module.exports = mailChimp => ({
  addToMailingList: async (mailingListData, context) => {
    const { env, logger } = context;
    const { email, firstName, lastName } = mailingListData;

    const mailingListEndpoint = `/lists/${env.MAILCHIMP_NEWSLETTER_ID}/members`;

    // requires an md5 hash of the email for subscription
    const hashedEmail = createHash("md5")
      .update(email.toLowerCase())
      .digest("hex");

    return mailChimp
      .put(`${mailingListEndpoint}/${hashedEmail}`, {
        email_address: email,
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      })
      .then(() => true)
      .catch(error => {
        logger.error(
          `[MailChimp Service]: Failed subscribing [${email}] to mailing list`,
        );

        logger.error(error.message);

        if (error.response) {
          const { data, status } = error.response;
          logger.error(
            `response: ${JSON.stringify({ data, status }, null, 2)}`,
          );
        }

        return false;
      });
  },
});
